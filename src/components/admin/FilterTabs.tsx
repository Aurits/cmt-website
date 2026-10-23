import { cx } from '@/lib/cx';

export interface FilterTab {
  value: string;
  label: string;
  count?: number;
}

/** Underline tabs for filtering a table, controls, so rounded-control on the active pill. */
export function FilterTabs({
  tabs,
  value,
  onChange,
}: {
  tabs: FilterTab[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    // A segmented pill bar, like the public site's tabs: the current filter in ink, counts in a
    // pale gold tag.
    <div
      role="tablist"
      aria-label="Filter"
      // One line that scrolls sideways on a phone, rather than wrapping into a lumpy block.
      className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-green/12 bg-white p-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:rounded-[22px] [&::-webkit-scrollbar]:hidden"
    >
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cx(
              'inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-small font-medium whitespace-nowrap transition-colors',
              active ? 'bg-green text-white' : 'text-green/75 hover:bg-cream hover:text-green',
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cx(
                  'tnum rounded-full px-1.5 text-[11px] font-semibold',
                  active ? 'bg-white/15 text-white' : 'bg-tag text-tag-ink',
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
