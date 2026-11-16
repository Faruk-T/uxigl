// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

// Stub out SheetGLGridAdapter's WebGL/Canvas rendering in jsdom while keeping
// SHEETGL_PRESET_META intact and surfacing datasetPreset / initialRowCount props.
vi.mock(
  '../../src/components/composites/SheetGLGridAdapter/SheetGLGridAdapter',
  async (importOriginal) => {
    const actual = await importOriginal<
      typeof import('../../src/components/composites/SheetGLGridAdapter/SheetGLGridAdapter')
    >();
    return {
      ...actual,
      SheetGLGridAdapter: ({
        datasetPreset = 'finance-erp',
        initialRowCount = 150,
      }: {
        datasetPreset?: string;
        initialRowCount?: number;
      }) =>
        React.createElement(
          'div',
          {
            'data-testid': 'sheetgl-grid-adapter-stub',
            'data-preset': datasetPreset,
            'data-rows': String(initialRowCount),
          },
          `SheetGL Stub: ${datasetPreset}`
        ),
    };
  }
);

import { AnalyticsDashboardView } from '../../src/features/showcase/AnalyticsDashboardView';

describe('AnalyticsDashboardView', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders default finance-erp scenario KPI metrics and compliance badges', () => {
    render(<AnalyticsDashboardView />);

    expect(
      screen.getByRole('heading', { name: /Analytics & Financial Telemetry/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Live Ledger · 150 Rows')).toBeInTheDocument();
    expect(screen.getByText('SOC2 · GDPR · ISO27001')).toBeInTheDocument();

    // Finance & ERP KPI metrics
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('$4,820,450')).toBeInTheDocument();
    expect(screen.getByText('Active Enterprise Accounts')).toBeInTheDocument();
    expect(screen.getByText('28,490')).toBeInTheDocument();
    expect(screen.getByText('Audit & SLA Compliance')).toBeInTheDocument();
    expect(screen.getByText('99.99%')).toBeInTheDocument();

    const gridStub = screen.getByTestId('sheetgl-grid-adapter-stub');
    expect(gridStub).toHaveAttribute('data-preset', 'finance-erp');
    expect(gridStub).toHaveAttribute('data-rows', '150');
  });

  it('switches interactively across cloud-telemetry, hr-payroll, and inventory-supply scenarios', async () => {
    const user = userEvent.setup();
    render(<AnalyticsDashboardView />);

    // 1. Switch to Cloud Telemetry ('cloud-telemetry')
    await user.click(screen.getByRole('tab', { name: /Cloud Telemetry/i }));

    expect(screen.getByText('K8s Cluster Stream · 150 Nodes')).toBeInTheDocument();
    expect(screen.getByText('HPA Active · Zero-Trust Mesh')).toBeInTheDocument();
    expect(screen.getByText('Cluster Throughput (RPS)')).toBeInTheDocument();
    expect(screen.getByText('1.42M req/s')).toBeInTheDocument();
    expect(screen.getByText('Global P99 Latency')).toBeInTheDocument();
    expect(screen.getByText('8.4 ms')).toBeInTheDocument();
    expect(screen.getByText('System Uptime SLA')).toBeInTheDocument();
    expect(screen.getByText('99.99%')).toBeInTheDocument();
    expect(screen.getByTestId('sheetgl-grid-adapter-stub')).toHaveAttribute(
      'data-preset',
      'cloud-telemetry'
    );

    // 2. Switch to HR & Payroll ('hr-payroll')
    await user.click(screen.getByRole('tab', { name: /HR & Payroll/i }));

    expect(screen.getByText('Workforce Matrix · 150 Staff')).toBeInTheDocument();
    expect(screen.getByText('OKR Q4 · Global Payroll')).toBeInTheDocument();
    expect(screen.getByText('Monthly Payroll & RSU')).toBeInTheDocument();
    expect(screen.getByText('$2,140,800')).toBeInTheDocument();
    expect(screen.getByText('Active Engineering & R&D')).toBeInTheDocument();
    expect(screen.getByText('1,284')).toBeInTheDocument();
    expect(screen.getByText('Mean OKR Attainment')).toBeInTheDocument();
    expect(screen.getByText('91.4%')).toBeInTheDocument();
    expect(screen.getByTestId('sheetgl-grid-adapter-stub')).toHaveAttribute(
      'data-preset',
      'hr-payroll'
    );

    // 3. Switch to Supply Chain ('inventory-supply')
    await user.click(screen.getByRole('tab', { name: /Supply Chain/i }));

    expect(screen.getByText('Live SKU Telemetry · 150 SKUs')).toBeInTheDocument();
    expect(screen.getByText('Insured · 7 Global Hubs')).toBeInTheDocument();
    expect(screen.getByText('Total Inventory Valuation')).toBeInTheDocument();
    expect(screen.getByText('$18,940,200')).toBeInTheDocument();
    expect(screen.getByText('Warehouse Capacity')).toBeInTheDocument();
    expect(screen.getByText('84.6%')).toBeInTheDocument();
    expect(screen.getByText('On-Time Dispatch SLA')).toBeInTheDocument();
    expect(screen.getByText('98.7%')).toBeInTheDocument();
    expect(screen.getByTestId('sheetgl-grid-adapter-stub')).toHaveAttribute(
      'data-preset',
      'inventory-supply'
    );
  });
});
