import { cx } from '@/lib/cx';

/**
 * A dashboard figure, as the admin design sets it: a white panel with a short gold rule on its top
 * edge, the label in small capitals with its mark in a pale gold disc, the figure large in
 * Fraunces, and one line under it saying what the number includes. `badge` sits in front of that
 * line, for a status such as "All clear".
 */
export function MetricCard({
  label,
  value,
  hint,
  icon,
  badge,
  className,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cx('relative border border-green/10 bg-white p-5', className)}>
      <span aria-hidden="true" className="absolute -top-px left-5 h-[3px] w-7 bg-gold" />
      <div className="flex items-start justify-between gap-3">
        <p className="pt-2 text-[11.5px] font-semibold tracking-[0.14em] text-green uppercase">{label}</p>
        {icon && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-tag text-green">
            {icon}
          </span>
        )}
      </div>
      <p className="tnum mt-3 font-display text-[44px] leading-none font-semibold text-green">{value}</p>
      {(hint || badge) && (
        <p className="mt-3 flex flex-wrap items-center gap-2 text-small leading-snug text-muted">
          {badge}
          {hint}
        </p>
      )}
    </div>
  );
}
