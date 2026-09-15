import { kenyaOffices, ugandaOffices } from '@/data/site';
import type { Office } from '@/lib/types';
import { cx } from '@/lib/cx';

/**
 * Nine offices, two countries, one rule.
 *
 * Borrowed directly from the trade: a surveyor's baseline with stations ticked along it. Head
 * offices take a filled square, branches a tick.
 *
 * DELIBERATELY NOT A MAP. A Leaflet map of nine pins across two countries is a slow, zoomed-out
 * blur that says nothing at a glance, and it would be the second map on the site. A baseline reads
 * instantly and says something a map cannot: that the coverage is organised rather than scattered.
 * It also costs no JavaScript and no tiles.
 *
 * The two halves distribute independently — `justify-between` inside each country rather than
 * across all nine — so the border stays at the centre and the split is the thing you see first.
 * Below md the whole object rotates: the rule runs down the left and stations become rows, which
 * is the same drawing turned ninety degrees rather than a wrapped mess. See LAYOUT-SPECS.md A-02.
 */
function Station({ office, vertical }: { office: Office; vertical?: boolean }) {
  const isHead = office.role === 'Head office';

  if (vertical) {
    return (
      <li className="relative flex h-11 items-center gap-4 pl-6">
        <span
          aria-hidden="true"
          className={cx(
            'absolute left-0 -translate-x-1/2',
            isHead ? 'h-1.5 w-1.5 bg-green' : 'h-px w-2.5 bg-green/60',
          )}
        />
        <span className="text-[0.9375rem] text-ink">{office.city}</span>
        <span className="text-[0.75rem] text-muted">{office.role}</span>
      </li>
    );
  }

  return (
    <li className="flex flex-col items-center gap-2">
      <span className="text-[0.6875rem] uppercase tracking-[0.1em] text-muted">
        {isHead ? 'Head' : ''}
      </span>
      <span
        aria-hidden="true"
        className={cx(isHead ? 'h-1.5 w-1.5 bg-green' : 'h-2.5 w-px bg-green/60')}
      />
      <span className="text-[0.8125rem] text-ink">{office.city}</span>
    </li>
  );
}

export function SurveyBaseline() {
  return (
    <section aria-label="CMT Realtors offices" className="border-y border-rule bg-cream py-10">
      {/* Horizontal baseline, md and up. */}
      <div className="mx-auto hidden w-full max-w-[1200px] px-6 md:block">
        <div className="relative">
          {/* The rule itself, running the full width behind the stations. */}
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-[calc(50%+2px)] h-px bg-rule"
          />
          <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-6">
            <ul className="flex items-center justify-between">
              {ugandaOffices.map((office) => (
                <Station key={office.city} office={office} />
              ))}
            </ul>

            {/* The border. */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[0.6875rem] tracking-[0.12em] text-gold-deep">UG</span>
              <span aria-hidden="true" className="h-8 w-0.5 bg-gold" />
              <span className="text-[0.6875rem] tracking-[0.12em] text-gold-deep">KE</span>
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
        <div className="relative pl-3">
          <span aria-hidden="true" className="absolute bottom-2 left-3 top-2 w-px bg-rule" />
          <p className="mb-2 text-[0.6875rem] tracking-[0.12em] text-gold-deep">UG</p>
          <ul>
            {ugandaOffices.map((office) => (
              <Station key={office.city} office={office} vertical />
            ))}
          </ul>
          <p className="mb-2 mt-4 border-t-2 border-gold pt-3 text-[0.6875rem] tracking-[0.12em] text-gold-deep">
            KE
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
