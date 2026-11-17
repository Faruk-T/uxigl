// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { render, screen, within, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import {
  DataTable,
  type DataTableColumn,
} from '../../src/components/composites/DataTable/DataTable';

interface SampleServiceRow extends Record<string, unknown> {
  id: string;
  service: string;
  latencyMs: number;
  region: string;
}

const SAMPLE_ROWS: SampleServiceRow[] = [
  { id: 'srv-1', service: 'Zero-Trust Auth', latencyMs: 18, region: 'Frankfurt' },
  { id: 'srv-2', service: 'Aurora Edge Gateway', latencyMs: 4, region: 'Istanbul' },
  { id: 'srv-3', service: 'Neural Telemetry Collector', latencyMs: 42, region: 'Tokyo' },
];

const SAMPLE_COLUMNS: DataTableColumn<SampleServiceRow>[] = [
  { key: 'service', header: 'Servis', sortable: true },
  { key: 'latencyMs', header: 'Gecikme (ms)', sortable: true, align: 'right' },
  {
    key: 'region',
    header: 'Bölge',
    sortable: false,
    render: (row) => <span data-testid={`region-${row.id}`}>{row.region} Hub</span>,
  },
];

describe('DataTable', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders headers, rows, custom cell renderers, toolbar/footer slots, and variant classes', () => {
    const { container } = render(
      <DataTable<SampleServiceRow>
        id="cluster-table"
        data={SAMPLE_ROWS}
        columns={SAMPLE_COLUMNS}
        rowKey="id"
        variant="striped"
        size="sm"
        stickyHeader
        toolbarRight={<button type="button">Export CSV</button>}
        footerSummary={<span>SLA: 99.99%</span>}
      />
    );

    const table = container.querySelector('table.uxu-table');
    expect(table).toHaveClass(
      'uxu-table--striped',
      'uxu-table--sm',
      'uxu-table--sticky'
    );

    expect(screen.getByText('3 kayıt')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Export CSV' })).toBeInTheDocument();
    expect(screen.getByText('SLA: 99.99%')).toBeInTheDocument();

    // Custom cell renderer output
    expect(screen.getByTestId('region-srv-1')).toHaveTextContent('Frankfurt Hub');
    expect(screen.getByTestId('region-srv-2')).toHaveTextContent('Istanbul Hub');
    expect(screen.getByTestId('region-srv-3')).toHaveTextContent('Tokyo Hub');
  });

  it('filters rows case-insensitively via search input and displays emptyMessage when no rows match', async () => {
    const user = userEvent.setup();
    render(
      <DataTable<SampleServiceRow>
        data={SAMPLE_ROWS}
        columns={SAMPLE_COLUMNS}
        rowKey="id"
        searchPlaceholder="Servis ara..."
        emptyMessage="Eşleşen servis bulunamadı."
      />
    );

    const searchInput = screen.getByRole('textbox', { name: 'Servis ara...' });
    await user.type(searchInput, 'aurora');

    expect(screen.getByText('1 kayıt')).toBeInTheDocument();
    expect(screen.getByText('Aurora Edge Gateway')).toBeInTheDocument();
    expect(screen.queryByText('Zero-Trust Auth')).not.toBeInTheDocument();

    await user.clear(searchInput);
    await user.type(searchInput, 'non-existent-node');

    expect(screen.getByText('0 kayıt')).toBeInTheDocument();
    expect(screen.getByText('Eşleşen servis bulunamadı.')).toBeInTheDocument();
  });

  it('sorts string and numeric columns via click and keyboard Enter/Space while updating aria-sort', async () => {
    const user = userEvent.setup();
    render(
      <DataTable<SampleServiceRow>
        data={SAMPLE_ROWS}
        columns={SAMPLE_COLUMNS}
        rowKey="id"
      />
    );

    const serviceHeader = screen.getByRole('columnheader', { name: 'Servis' });
    const latencyHeader = screen.getByRole('columnheader', { name: 'Gecikme (ms)' });
    const regionHeader = screen.getByRole('columnheader', { name: 'Bölge' });

    expect(serviceHeader).toHaveAttribute('aria-sort', 'none');
    expect(latencyHeader).toHaveAttribute('aria-sort', 'none');
    expect(regionHeader).not.toHaveAttribute('aria-sort');

    const getRowOrder = () =>
      screen
        .getAllByRole('row')
        .slice(1) // skip header row
        .map((row) => within(row).getAllByRole('cell')[0].textContent);

    // 1. Click numeric column header -> ascending (4, 18, 42)
    await user.click(latencyHeader);
    expect(latencyHeader).toHaveAttribute('aria-sort', 'ascending');
    expect(getRowOrder()).toEqual([
      'Aurora Edge Gateway',
      'Zero-Trust Auth',
      'Neural Telemetry Collector',
    ]);

    // 2. Click numeric column header again -> descending (42, 18, 4)
    await user.click(latencyHeader);
    expect(latencyHeader).toHaveAttribute('aria-sort', 'descending');
    expect(getRowOrder()).toEqual([
      'Neural Telemetry Collector',
      'Zero-Trust Auth',
      'Aurora Edge Gateway',
    ]);

    // 3. Keyboard Enter on string column header -> ascending alphabetical
    serviceHeader.focus();
    await user.keyboard('{Enter}');
    expect(serviceHeader).toHaveAttribute('aria-sort', 'ascending');
    expect(getRowOrder()).toEqual([
      'Aurora Edge Gateway',
      'Neural Telemetry Collector',
      'Zero-Trust Auth',
    ]);

    // 4. Keyboard Space on string column header -> descending alphabetical
    await user.keyboard(' ');
    expect(serviceHeader).toHaveAttribute('aria-sort', 'descending');
    expect(getRowOrder()).toEqual([
      'Zero-Trust Auth',
      'Neural Telemetry Collector',
      'Aurora Edge Gateway',
    ]);

    // 5. Clicking non-sortable column does not alter order or aria-sort
    await user.click(regionHeader);
    expect(serviceHeader).toHaveAttribute('aria-sort', 'descending');
    expect(getRowOrder()).toEqual([
      'Zero-Trust Auth',
      'Neural Telemetry Collector',
      'Aurora Edge Gateway',
    ]);
  });

  it('supports row selection and select-all via click and keyboard without triggering onRowClick', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();

    render(
      <DataTable<SampleServiceRow>
        data={SAMPLE_ROWS}
        columns={SAMPLE_COLUMNS}
        rowKey="id"
        selectable
        onRowClick={onRowClick}
      />
    );

    const selectAllCheckbox = screen.getByRole('checkbox', {
      name: 'Tüm satırları seç',
    });
    const row1Checkbox = screen.getByRole('checkbox', {
      name: 'Satır seç srv-1',
    });

    expect(selectAllCheckbox).toHaveAttribute('aria-checked', 'false');
    expect(row1Checkbox).toHaveAttribute('aria-checked', 'false');

    // Click row 1 checkbox -> selects row 1 without firing onRowClick
    await user.click(row1Checkbox);
    expect(row1Checkbox).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText('1 seçili')).toBeInTheDocument();
    expect(onRowClick).not.toHaveBeenCalled();

    // Keyboard toggle row 1 checkbox off
    row1Checkbox.focus();
    await user.keyboard(' ');
    expect(row1Checkbox).toHaveAttribute('aria-checked', 'false');
    expect(screen.queryByText(/seçili/i)).not.toBeInTheDocument();

    // Keyboard Space on Select-All checkbox -> selects all 3 rows
    selectAllCheckbox.focus();
    await user.keyboard('{Enter}');
    expect(selectAllCheckbox).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText('3 seçili')).toBeInTheDocument();

    // Click Select-All checkbox -> clears all selections
    await user.click(selectAllCheckbox);
    expect(selectAllCheckbox).toHaveAttribute('aria-checked', 'false');
    expect(screen.queryByText(/seçili/i)).not.toBeInTheDocument();
  });

  it('invokes onRowClick with the clicked row payload when a body row is clicked', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();

    render(
      <DataTable<SampleServiceRow>
        data={SAMPLE_ROWS}
        columns={SAMPLE_COLUMNS}
        rowKey="id"
        onRowClick={onRowClick}
      />
    );

    await user.click(screen.getByText('Aurora Edge Gateway'));
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick).toHaveBeenCalledWith(SAMPLE_ROWS[1]);
  });
});
