import { SearchIcon } from '@/components/admin/icons';
import { cx } from '@/lib/cx';

/** The admin's small round icon button: edit, reorder, remove. One look everywhere. */
export const iconButtonClass =
  'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-green/15 text-green/70 transition-colors hover:bg-cream hover:text-green disabled:pointer-events-none disabled:opacity-30';

/** A secondary pill action ("Add", "Upload"), lighter than the primary Button. */
export const softButtonClass =
  'inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border border-green/20 px-4 text-small font-medium text-green transition-colors hover:bg-cream';

/**
 * The row at the top of every admin list: what is here (a count, a one-line note), a search box
 * for this list, and the page's main action on the right. One component so every list page reads
 * the same way and the search sits in the same place on each.
 */
export function PageToolbar({
  summary,
  search,
  onSearch,
  searchLabel = 'Search this list',
  action,
  className,
}: {
  summary?: React.ReactNode;
  search?: string;
  onSearch?: (value: string) => void;
  searchLabel?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cx('flex flex-wrap items-center justify-between gap-3', className)}>
      {summary && <div className="min-w-0 text-small text-muted">{summary}</div>}
      <div className="flex w-full flex-wrap items-center gap-3 sm:ml-auto sm:w-auto">
        {onSearch && (
          <label className="relative block flex-1 sm:flex-none">
            <span className="sr-only">{searchLabel}</span>
            <SearchIcon
              width={15}
              height={15}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
            />
            <input
              type="search"
              value={search ?? ''}
              onChange={(event) => onSearch(event.target.value)}
              placeholder={searchLabel}
              className="h-10 w-full rounded-full sm:w-56 border border-green/15 bg-white pr-4 pl-9 text-small text-green placeholder:text-muted focus:border-green focus:shadow-[0_0_0_3px_rgb(15_42_26/0.12)] focus:outline-none"
            />
          </label>
        )}
        {action}
      </div>
    </div>
  );
}
