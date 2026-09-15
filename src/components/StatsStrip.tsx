import { AnimatedStatValue } from '@/components/AnimatedStatValue';
import { Container } from '@/components/ui/Container';
import { stats } from '@/data/site';
import { cx } from '@/lib/cx';

/**
 * The credentials, set as a ledger row rather than four identical cards: value, unit,
 * then the line of evidence underneath. Gold hairlines divide the cells on desktop.
 */
export function StatsStrip({ className }: { className?: string }) {
  return (
    <section aria-label="CMT Realtors in numbers" className={cx('bg-green text-cream', className)}>
      <Container>
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={cx(
                'border-cream/15 px-1 py-7 sm:px-5 lg:py-9',
                index % 2 === 1 && 'border-l',
                index > 1 && 'border-t lg:border-t-0',
                index > 0 && 'lg:border-l',
              )}
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="flex items-baseline gap-2">
                  <span className="font-display text-stat leading-none text-gold">
                    <AnimatedStatValue value={stat.value} />
                  </span>
                  <span className="text-sm text-cream/70">{stat.unit}</span>
                </span>
                <span className="mt-3 block max-w-[22ch] text-micro leading-snug text-cream/80">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
