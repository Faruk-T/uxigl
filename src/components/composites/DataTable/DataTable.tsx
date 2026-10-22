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
 */

export type NativeTableVariant = 'default' | 'striped' | 'bordered' | 'minimal';
export type NativeTableSize = 'sm' | 'md' | 'lg';

export interface DataTableColumn<TRow> {
  key: keyof TRow & string;
  header: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
  render?: (row: TRow) => React.ReactNode;
}

export interface DataTableProps<TRow extends Record<string, unknown>>
  extends IdentifiableProps {
  columns: DataTableColumn<TRow>[];
  data: TRow[];
  rowKey: keyof TRow & string;
  variant?: NativeTableVariant;
  size?: NativeTableSize;
  searchable?: boolean;
  selectable?: boolean;
  stickyHeader?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  toolbarRight?: React.ReactNode;
  footerSummary?: React.ReactNode;
  onRowClick?: (row: TRow) => void;
}

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

  const handleSort = (key: keyof TRow & string) => {
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

  const toggleRow = (keyStr: string, e: React.MouseEvent) => {
    e.stopPropagation();
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

      <div
        className={`uxu-table-scroll uxu-table-scroll--${variant}`}
      >
        <table className={tableClasses}>
          <thead>
            <tr>
              {selectable && (
                <th className="uxu-table__th-check" onClick={toggleAll}>
                  <span
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
                return (
                  <th
                    key={col.key}
                    style={{
                      textAlign: col.align ?? 'left',
                      width: col.width,
                    }}
                    className={col.sortable ? 'uxu-table__th--sortable' : ''}
                    onClick={() => col.sortable && handleSort(col.key)}
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
