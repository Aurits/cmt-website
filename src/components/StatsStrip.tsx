import { AnimatedStatValue } from '@/components/AnimatedStatValue';
import { Container } from '@/components/ui/Container';
import { stats } from '@/data/site';
import { cx } from '@/lib/cx';

/**
 * The credentials, set as a ledger row rather than four identical cards: value, unit,
 * then the line of evidence underneath.
 *
 * This used to be a green slab, and it sat directly above the featured carousel, which is
 * also green. Two dark bands with nothing between them read as one band with a line through
 * it, and the page lost its second breath immediately after the hero.
 *
 * Moving it to paper fixed the rhythm and turned out to be the more accurate setting anyway.
 * On green with gold numerals this was a banner, and a banner is a claim you are asked to
 * take on trust. On paper, ruled, with the figure over its own caption and the numerals set
 * tabular, it is a schedule, which is what these four facts actually are and what the rest of
 * the site already sets them as everywhere else. The argument the whole design makes is
 * that CMT is a document rather than a brochure; this is the section where that was least
 * true.
 *
 * Gold survives as the hairline along the top, which is the site's own stamp. The figures
 * take gold-deep, the readable half of the pair (5.55:1 on paper), because gold proper on a
 * light ground is 1.97:1 and would be a decoration of a number rather than a number.
 */
export function StatsStrip({ className }: { className?: string }) {
  return (
    <section
      aria-label="CMT Realtors in numbers"
      className={cx('border-t-2 border-t-gold bg-paper', className)}
    >
      <Container>
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={cx(
                'border-rule px-1 py-7 sm:px-5 lg:py-9',
                index % 2 === 1 && 'border-l',
                index > 1 && 'border-t lg:border-t-0',
                index > 0 && 'lg:border-l',
              )}
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="flex items-baseline gap-2">
                  <span className="tnum font-display text-stat leading-none text-gold-deep">
                    <AnimatedStatValue value={stat.value} />
                  </span>
                  <span className="text-body text-muted">{stat.unit}</span>
                </span>
                <span className="mt-3 block max-w-[22ch] text-micro leading-snug text-muted">
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
