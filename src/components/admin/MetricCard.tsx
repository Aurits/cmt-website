import { cx } from '@/lib/cx';

/**
 * A dashboard metric, set as a valuation-style schedule rather than a generic stat card: a
 * gold top rule, a label, then the figure in tabular Fraunces. Square (rounded-brand) like
 * every other data panel — this presents a fact, so it does not get the softened radius.
 */
export function MetricCard({
  label,
  value,
  unit,
  hint,
  className,
}: {
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cx('rounded-brand border-t-2 border-gold bg-paper p-5', className)}>
      <p className="text-label uppercase tracking-[0.1em] text-muted">{label}</p>
      <p className="mt-3 flex items-baseline gap-1.5">
        <span className="tnum font-display text-h2 leading-none text-green">{value}</span>
        {unit && <span className="text-body text-muted">{unit}</span>}
      </p>
      {hint && <p className="mt-2 text-micro text-muted">{hint}</p>}
    </div>
  );
}
