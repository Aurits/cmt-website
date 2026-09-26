import { kenyaOffices, ugandaOffices } from '@/data/site';
import type { Office } from '@/lib/types';
import { cx } from '@/lib/cx';

/**
 * Nine offices, two countries, one rule.
 *
 * Borrowed directly from the trade: a surveyor's baseline with stations marked along it. Head
 * offices take a filled square, branches an outlined one.
 *
 * DELIBERATELY NOT A MAP. A Leaflet map of nine pins across two countries is a slow, zoomed-out
 * blur that says nothing at a glance, and it would be the second map on the site. A baseline reads
 * instantly and says something a map cannot: that the coverage is organised rather than scattered.
 * It also costs no JavaScript and no tiles.
 *
 * The two halves distribute independently — `justify-between` inside each country rather than
 * across all nine — so the border stays at the centre and the split is the thing you see first.
 * Below md the whole object rotates: the rule runs down the left and stations become rows, which
 * is the same drawing turned ninety degrees rather than a wrapped mess. See docs/LAYOUT-SPECS.md A-02.
 */

/*
 * A station on the line. Stronger than it was: the first cut drew a 6px dot for a head office and
 * a 1px tick for a branch, on a 1px hairline, with the town in 13px type, and the whole strip read
 * as faint pencil marks. Now a head office is a solid green square with a gold core, a branch a
 * square outlined in green, both 14px and centred on a 2px gold line, and the town is set at body
 * size. The same marker language as the process timeline on the homepage.
 */
function Marker({ head }: { head: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        'relative z-10 flex h-3.5 w-3.5 items-center justify-center',
        head ? 'bg-green' : 'border-2 border-green bg-cream',
      )}
    >
      {head && <span className="h-1.5 w-1.5 bg-gold" />}
    </span>
  );
}

function Station({ office, vertical }: { office: Office; vertical?: boolean }) {
  const isHead = office.role === 'Head office';

  if (vertical) {
    return (
      <li className="relative flex h-12 items-center gap-4">
        <span className="flex w-3.5 justify-center">
          <Marker head={isHead} />
        </span>
        <span className={cx('text-body text-ink', isHead && 'font-medium')}>{office.city}</span>
        {isHead && (
          <span className="text-label font-semibold uppercase tracking-[0.1em] text-gold-deep">
            Head office
          </span>
        )}
      </li>
    );
  }

  return (
    <li className="flex flex-col items-center gap-2.5">
      {/* A fixed-height row, so every marker sits at the same height and the line meets all of them. */}
      <span className="h-4 text-label font-semibold uppercase tracking-[0.1em] text-gold-deep">
        {isHead ? 'Head office' : ''}
      </span>
      <Marker head={isHead} />
      <span className={cx('text-body text-ink', isHead && 'font-medium')}>{office.city}</span>
    </li>
  );
}

export function SurveyBaseline() {
  return (
    <section aria-label="CMT Realtors offices" className="border-y border-rule bg-cream py-10">
      {/* Horizontal baseline, md and up. */}
      <div className="mx-auto hidden w-full max-w-[1200px] px-6 md:block">
        <div className="relative">
          {/* The line, running the full width behind the stations and through every marker's
              centre: the 16px label row, the 10px gap, then half of the 14px marker. */}
          <span aria-hidden="true" className="absolute top-[32px] right-0 left-0 h-[2px] bg-gold/60" />
          <div className="relative grid grid-cols-[1fr_auto_1fr] items-start gap-8">
            <ul className="flex items-center justify-between">
              {ugandaOffices.map((office) => (
                <Station key={office.city} office={office} />
              ))}
            </ul>

            {/* The border. */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-label font-semibold tracking-[0.12em] text-green">Uganda</span>
              <span aria-hidden="true" className="h-9 w-[3px] bg-gold" />
              <span className="text-label font-semibold tracking-[0.12em] text-green">Kenya</span>
            </div>

            <ul className="flex items-center justify-between">
              {kenyaOffices.map((office) => (
                <Station key={office.city} office={office} />
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Rotated ninety degrees below md — same drawing, not a reflow. */}
      <div className="mx-auto w-full max-w-[1200px] px-4 md:hidden">
        <div className="relative">
          <span aria-hidden="true" className="absolute top-8 bottom-4 left-[6px] w-[2px] bg-gold/60" />
          <p className="mb-1 text-label font-semibold tracking-[0.12em] text-green">Uganda</p>
          <ul>
            {ugandaOffices.map((office) => (
              <Station key={office.city} office={office} vertical />
            ))}
          </ul>
          <p className="relative mt-4 mb-1 bg-cream pt-3 text-label font-semibold tracking-[0.12em] text-green before:absolute before:top-0 before:left-0 before:h-[3px] before:w-10 before:bg-gold">
            Kenya
          </p>
          <ul>
            {kenyaOffices.map((office) => (
              <Station key={office.city} office={office} vertical />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
