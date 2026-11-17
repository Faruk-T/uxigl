import React, { useMemo, useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Check } from 'lucide-react';
import type { IdentifiableProps } from '../../../core/contracts/ComponentContracts';

/**
 * ============================================================================
 * uxiGL COMPOSITE — NATIVE DATA TABLE (LIGHTWEIGHT HTML TABLE)
 * ============================================================================
 * Clean, lightweight, zero-WebGL native HTML `<table>` component for simple
 * datasets, settings lists, audit logs, and summary reports.
 *
 * Features:
 * - 4 visual variants: `'default'` | `'striped'` | `'bordered'` | `'minimal'`
 * - 3 row densities: `'sm'` | `'md'` | `'lg'`
 * - Optional column sorting, instant search filter, and row selection checkboxes
 * - Full WAI-ARIA semantics (`aria-sort`, `role="checkbox"`, `aria-checked`, keyboard navigation)
 */

/** Visual variant options for {@link DataTable}. */
export type NativeTableVariant = 'default' | 'striped' | 'bordered' | 'minimal';

/** Row density scale options for {@link DataTable}. */
export type NativeTableSize = 'sm' | 'md' | 'lg';

/**
 * Column schema definition for {@link DataTable}.
 */
export interface DataTableColumn<TRow> {
  /** Property key on `TRow` bound to this column. */
  key: keyof TRow & string;
  /** Visible column header label. */
  header: string;
  /** Whether clicking or pressing Enter/Space on the column header sorts by this column. */
  sortable?: boolean;
  /** Horizontal text alignment for cells in this column (defaults to `'left'`). */
  align?: 'left' | 'center' | 'right';
  /** Optional explicit CSS width for the column header. */
  width?: string | number;
  /** Optional custom cell renderer function. */
  render?: (row: TRow) => React.ReactNode;
}

/**
 * Props contract for {@link DataTable}.
 */
export interface DataTableProps<TRow extends Record<string, unknown>>
  extends IdentifiableProps {
  /** Array of column definitions. */
  columns: DataTableColumn<TRow>[];
  /** Array of row records to display. */
  data: TRow[];
  /** Unique identifier property key on each `TRow` record. */
  rowKey: keyof TRow & string;
  /** Visual table surface variant (defaults to `'default'`). */
  variant?: NativeTableVariant;
  /** Row padding density scale (defaults to `'md'`). */
  size?: NativeTableSize;
  /** Enables the instant toolbar search filter input (defaults to `true`). */
  searchable?: boolean;
  /** Enables per-row and select-all checkboxes (defaults to `false`). */
  selectable?: boolean;
  /** Pins the `<thead>` during vertical scroll (defaults to `false`). */
  stickyHeader?: boolean;
  /** Placeholder and accessible label for the search input. */
  searchPlaceholder?: string;
  /** Message rendered when no rows match the current filter. */
  emptyMessage?: string;
  /** Optional custom actions node rendered on the right side of the toolbar. */
  toolbarRight?: React.ReactNode;
  /** Optional summary node rendered inside the table footer. */
  footerSummary?: React.ReactNode;
  /** Optional callback fired when a body row is clicked. */
  onRowClick?: (row: TRow) => void;
}

/**
 * Lightweight, zero-WebGL semantic HTML `<DataTable />` composite with built-in
 * search filtering, WAI-ARIA sortable columns, and accessible row selection.
 *
 * @param props - {@link DataTableProps} configuration options.
 * @returns Rendered semantic HTML table container.
 */
export function DataTable<TRow extends Record<string, unknown>>({
  id,
  className = '',
  style,
  columns,
  data,
  rowKey,
  variant = 'default',
  size = 'md',
  searchable = true,
  selectable = false,
  stickyHeader = false,
  searchPlaceholder = 'Tabloda filtrele...',
  emptyMessage = 'Gösterilecek kayıt bulunamadı.',
  toolbarRight,
  footerSummary,
  onRowClick,
}: DataTableProps<TRow>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<(keyof TRow & string) | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const handleSort = (key: keyof TRow & string, sortable?: boolean) => {
    if (!sortable) return;
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const processedRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = q
      ? data.filter((row) =>
          Object.values(row).some((val) =>
            String(val ?? '')
              .toLowerCase()
              .includes(q)
          )
        )
      : data;

    if (!sortKey) return filtered;

    return [...filtered].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDir === 'asc' ? valA - valB : valB - valA;
      }
      return sortDir === 'asc'
        ? String(valA ?? '').localeCompare(String(valB ?? ''))
        : String(valB ?? '').localeCompare(String(valA ?? ''));
    });
  }, [data, searchQuery, sortKey, sortDir]);

  const allSelected =
    processedRows.length > 0 &&
    processedRows.every((r) => selectedKeys.has(String(r[rowKey])));

  const toggleAll = () => {
    if (allSelected) {
      setSelectedKeys(new Set());
    } else {
      setSelectedKeys(new Set(processedRows.map((r) => String(r[rowKey]))));
    }
  };

  const toggleRow = (keyStr: string, e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(keyStr)) {
        next.delete(keyStr);
      } else {
        next.add(keyStr);
      }
      return next;
    });
  };

  const tableClasses = [
    'uxu-table',
    `uxu-table--${variant}`,
    `uxu-table--${size}`,
    stickyHeader ? 'uxu-table--sticky' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div id={id} className={`uxu-table-container ${className}`} style={style}>
      {(searchable || toolbarRight || selectable) && (
        <div className="uxu-table-toolbar">
          <div className="uxu-table-toolbar__left">
            {searchable && (
              <div className="uxu-table-search">
                <Search size={14} className="uxu-table-search__icon" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  aria-label={searchPlaceholder}
                  className="uxu-table-search__input"
                />
              </div>
            )}
            {selectable && selectedKeys.size > 0 && (
              <span className="uxu-table-selection-pill">
                {selectedKeys.size} seçili
              </span>
            )}
          </div>

          <div className="uxu-table-toolbar__right">
            {toolbarRight}
            <span className="uxu-table-count">
              {processedRows.length} kayıt
            </span>
          </div>
        </div>
      )}

      <div className={`uxu-table-scroll uxu-table-scroll--${variant}`}>
        <table className={tableClasses}>
          <thead>
            <tr>
              {selectable && (
                <th className="uxu-table__th-check" onClick={toggleAll}>
                  <span
                    role="checkbox"
                    aria-checked={allSelected}
                    aria-label="Tüm satırları seç"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleAll();
                      }
                    }}
                    className={`uxu-table-check ${
                      allSelected ? 'uxu-table-check--checked' : ''
                    }`}
                  >
                    {allSelected && <Check size={11} strokeWidth={3} />}
                  </span>
                </th>
              )}
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                const ariaSort = col.sortable
                  ? isSorted
                    ? sortDir === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                  : undefined;

                return (
                  <th
                    key={col.key}
                    style={{
                      textAlign: col.align ?? 'left',
                      width: col.width,
                    }}
                    aria-sort={ariaSort}
                    tabIndex={col.sortable ? 0 : undefined}
                    className={col.sortable ? 'uxu-table__th--sortable' : ''}
                    onClick={() => handleSort(col.key, col.sortable)}
                    onKeyDown={
                      col.sortable
                        ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleSort(col.key, col.sortable);
                            }
                          }
                        : undefined
                    }
                  >
                    <span className="uxu-table__th-inner">
                      {col.header}
                      {col.sortable && (
                        <span
                          className={`uxu-table__sort-icon ${
                            isSorted ? 'uxu-table__sort-icon--active' : ''
                          }`}
                        >
                          {!isSorted ? (
                            <ArrowUpDown size={12} />
                          ) : sortDir === 'asc' ? (
                            <ArrowUp size={12} />
                          ) : (
                            <ArrowDown size={12} />
                          )}
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {processedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="uxu-table__empty"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              processedRows.map((row) => {
                const keyStr = String(row[rowKey]);
                const isSelected = selectedKeys.has(keyStr);
                return (
                  <tr
                    key={keyStr}
                    onClick={() => onRowClick?.(row)}
                    className={[
                      onRowClick ? 'uxu-table__tr--clickable' : '',
                      isSelected ? 'uxu-table__tr--selected' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {selectable && (
                      <td
                        className="uxu-table__td-check"
                        onClick={(e) => toggleRow(keyStr, e)}
                      >
                        <span
                          role="checkbox"
                          aria-checked={isSelected}
                          aria-label={`Satır seç ${keyStr}`}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              toggleRow(keyStr, e);
                            }
                          }}
                          className={`uxu-table-check ${
                            isSelected ? 'uxu-table-check--checked' : ''
                          }`}
                        >
                          {isSelected && <Check size={11} strokeWidth={3} />}
                        </span>
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        style={{ textAlign: col.align ?? 'left' }}
                      >
                        {col.render
                          ? col.render(row)
                          : String(row[col.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {footerSummary && (
        <div className="uxu-table-footer">{footerSummary}</div>
      )}
    </div>
  );
}
