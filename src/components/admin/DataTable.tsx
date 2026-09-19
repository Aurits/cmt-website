'use client';

import { useMemo, useState } from 'react';
import { SortIcon } from '@/components/admin/icons';
import { cx } from '@/lib/cx';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  /** Enables click-to-sort on this column. */
  sortValue?: (row: T) => string | number;
  align?: 'left' | 'right';
  className?: string;
}

/**
 * The one data table the CMS uses everywhere. Square (rounded-brand), ruled rows — the same
 * "schedule" logic as the rest of the site, scaled up to a grid. Sorting is optional per
 * column and entirely client-side, which is the right cost for a prototype with at most a
 * few dozen rows.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  emptyMessage = 'Nothing here yet.',
  className,
}: {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  emptyMessage?: string;
  className?: string;
}) {
  const [sort, setSort] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const column = columns.find((c) => c.key === sort.key);
    if (!column?.sortValue) return rows;
    const withValues = rows.map((row) => ({ row, value: column.sortValue!(row) }));
    withValues.sort((a, b) => {
      if (typeof a.value === 'number' && typeof b.value === 'number') return a.value - b.value;
      return String(a.value).localeCompare(String(b.value));
    });
    if (sort.direction === 'desc') withValues.reverse();
    return withValues.map((entry) => entry.row);
  }, [rows, sort, columns]);

  const toggleSort = (key: string) => {
    setSort((prev) => {
      if (prev?.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      return null;
    });
  };

  return (
    <div className={cx('overflow-x-auto rounded-brand border border-rule bg-paper', className)}>
      <table className="w-full min-w-[720px] border-collapse text-body">
        <thead>
          <tr className="border-b border-rule bg-cream-deep/60">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cx(
                  'px-4 py-3 text-label uppercase tracking-[0.08em] text-muted',
                  column.align === 'right' ? 'text-right' : 'text-left',
                )}
              >
                {column.sortValue ? (
                  <button
                    type="button"
                    onClick={() => toggleSort(column.key)}
                    className={cx(
                      'inline-flex items-center gap-1 hover:text-green',
                      sort?.key === column.key && 'text-green',
                    )}
                  >
                    {column.header}
                    <SortIcon width={13} height={13} />
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sorted.map((row) => (
              <tr
                key={getRowKey(row)}
                className="border-b border-rule/70 last:border-b-0 transition-colors hover:bg-green/5"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cx(
                      'px-4 py-3.5 align-middle',
                      column.align === 'right' && 'text-right',
                      column.className,
                    )}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
