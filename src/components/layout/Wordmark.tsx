import { cx } from '@/lib/cx';

/**
 * The CMT wordmark, set in type as the client's hero design (Hero.html) sets it: "CMT" in the
 * display serif over a gold tab reading REALTORS LIMITED.
 *
 * Type rather than the supplied PNG, because that file is a solid green tile with no transparency
 * and cannot sit on the paper masthead without showing as a rectangle. When CMT supplies a
 * transparent or vector logo, this is the one component to swap.
 *
 * `tone="light"` is the same mark on the dark footer and drawer.
 */
export function Wordmark({
  tone = 'dark',
  className,
}: {
  tone?: 'dark' | 'light';
  className?: string;
}) {
  return (
    <span className={cx('flex flex-col items-start gap-[3px]', className)}>
      <b
        className={cx(
          'font-display text-[42px] leading-[0.9] font-bold tracking-[-0.01em]',
          tone === 'dark' ? 'text-green' : 'text-white',
        )}
      >
        CMT
      </b>
      <small className="rounded-[3px] bg-gold px-1.5 py-[2px] text-[9px] leading-normal font-bold tracking-[0.14em] text-green">
        REALTORS LIMITED
      </small>
    </span>
  );
}
