import { cx } from '@/lib/cx';

/**
 * Section opener. The short gold rule is the site's one recurring ornament — it marks
 * the start of a section the way a stamp marks the start of a schedule. No all-caps
 * eyebrow, and the heading carries the whole message on its own.
 */
export function SectionHeading({
  title,
  lead,
  action,
  align = 'left',
  onDark = false,
  className,
  id,
}: {
  title: string;
  lead?: string;
  action?: React.ReactNode;
  align?: 'left' | 'center';
  onDark?: boolean;
  className?: string;
  id?: string;
}) {
  return (
    <div
      className={cx(
        'flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'sm:flex-col sm:items-center sm:text-center',
        className,
      )}
    >
      <div className={cx('max-w-[42ch]', align === 'center' && 'mx-auto')}>
        <span
          aria-hidden="true"
          className={cx('mb-5 block h-[3px] w-10 bg-gold', align === 'center' && 'mx-auto')}
        />
        <h2 id={id} className={cx('text-h2', onDark ? 'text-cream' : 'text-green')}>
          {title}
        </h2>
        {lead && (
          <p
            className={cx(
              'mt-4 max-w-[54ch] text-[1.0625rem] leading-relaxed',
              onDark ? 'text-cream/80' : 'text-muted',
            )}
          >
            {lead}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
