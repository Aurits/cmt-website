import { cx } from '@/lib/cx';

export interface FilterTab {
  value: string;
  label: string;
  count?: number;
}

/** Underline tabs for filtering a table — controls, so rounded-control on the active pill. */
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
    <div role="tablist" aria-label="Filter" className="flex flex-wrap gap-2">
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
              'inline-flex items-center gap-1.5 rounded-control border px-3.5 py-2 text-micro font-medium transition-colors',
              active
                ? 'border-green bg-green text-cream'
                : 'border-rule-strong bg-paper text-muted hover:border-green/50 hover:text-green',
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cx(
                  'tnum rounded-control px-1.5 text-label',
                  active ? 'bg-cream/20 text-cream' : 'bg-cream-deep text-muted',
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
