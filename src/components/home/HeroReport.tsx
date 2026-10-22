import { CheckCircleIcon, ShieldIcon } from '@/components/ui/icons';
import { site } from '@/data/site';
import { cx } from '@/lib/cx';

/*
 * The comparables, as bar heights. The fourth, in gold, is the subject property: it sits among
 * its comparables rather than above them, which is the whole idea of comparable evidence.
 * Delays as Hero.html: left to right, with the subject arriving last.
 */
const BARS = [
  { height: 38, delay: 50 },
  { height: 54, delay: 150 },
  { height: 46, delay: 250 },
  { height: 72, delay: 750, subject: true },
  { height: 60, delay: 350 },
  { height: 66, delay: 450 },
  { height: 50, delay: 550 },
];

const PREPARED_FOR = ['Bank', 'Public body', 'Company'];

/**
 * The hero's picture: a sample valuation report rather than a photograph, from the client's
 * hero design (Hero.html), built to its measurements.
 *
 * It shows what the firm sells instead of decorating the claim beside it: the basis of value,
 * the method, who it is prepared for, the market evidence (comparables as bars under an arch,
 * the subject property in gold among them), and the range a hunch gives tightening to the single
 * figure evidence gives. That last bar loops on a six-second cycle; with reduced motion it rests
 * on the tight, evidenced state. Marked "Sample", because it is not a real report.
 *
 * Built from three layers, back to front: a sage plate offset 26px down and right, a gold disc
 * at the top-right corner, and the white card itself. All the keyframes are report-* in
 * globals.css.
 */
export function HeroReport({ className }: { className?: string }) {
  return (
    <div className={cx('relative w-full', className)}>
      <div aria-hidden="true" className="absolute inset-[26px_-26px_-26px_26px] rounded-(--radius-plate) bg-sage" />
      <div aria-hidden="true" className="absolute -top-[26px] -right-[26px] h-[92px] w-[92px] rounded-full bg-gold" />

      <div
        role="img"
        aria-label="A sample valuation report: basis of value, market value; method, comparable evidence; prepared for banks, public bodies and companies. A chart of comparable sales with the subject property among them, and a market value range narrowing from a wide hunch to one evidenced figure."
        className="relative rounded-(--radius-card) border border-green/8 bg-white p-5 shadow-[0_28px_56px_rgba(15,42,26,0.12)] min-[601px]:p-7"
      >
        <div aria-hidden="true">
          <div className="flex items-center gap-2.5 pb-4">
            <ShieldIcon width={20} height={20} />
            <span className="text-[12px] font-semibold tracking-[0.14em] uppercase">Valuation report</span>
            <span className="ml-auto rounded-full bg-tag px-2.5 py-1 text-[11px] font-semibold text-tag-ink">
              Sample
            </span>
          </div>

          <Row label="Basis of value">
            <b className="text-right font-semibold">Market Value</b>
          </Row>
          <Row label="Method">
            <b className="text-right font-semibold">Comparable evidence</b>
          </Row>
          <Row label="Prepared for">
            <span className="flex flex-wrap justify-end gap-1.5">
              {PREPARED_FOR.map((who) => (
                <span key={who} className="rounded-full border border-chip px-2.5 py-[3px] text-[12px] font-medium">
                  {who}
                </span>
              ))}
            </span>
          </Row>

          {/* The arch: 160px corners on a 190px panel make the top a semicircle-ish dome. */}
          <div className="relative mt-3.5 flex h-[190px] flex-col justify-end rounded-[160px_160px_18px_18px] bg-sage-soft px-7 min-[601px]:px-12">
            <span className="absolute inset-x-0 top-8 text-center text-[12px] font-medium tracking-[0.14em] text-muted uppercase">
              Market evidence
            </span>
            <span className="flex h-[104px] items-end gap-2">
              {BARS.map((bar) => (
                <span
                  key={bar.delay}
                  className={cx(
                    'report-bar flex-1 rounded-t-[7px]',
                    bar.subject ? 'bg-gold' : 'bg-green/88',
                  )}
                  style={{ height: `${bar.height}%`, animationDelay: `${bar.delay}ms` }}
                />
              ))}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-center gap-5 text-[12.5px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <i className="inline-block h-2.5 w-2.5 rounded-full bg-green" />
              Comparables
            </span>
            <span className="inline-flex items-center gap-1.5">
              <i className="inline-block h-2.5 w-2.5 rounded-full bg-gold" />
              Subject property
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-3.5 rounded-[18px] bg-green px-5 pt-4 pb-[18px] text-white">
            <div className="flex items-center justify-between gap-3">
              <small className="text-[12px] tracking-[0.12em] text-white/80 uppercase">Market value</small>
              <span className="relative h-4 max-w-[170px] flex-1 text-[12.5px] text-white/88">
                <span className="report-text-a absolute top-0 right-0 whitespace-nowrap">Hunch · wide range</span>
                <span className="report-text-b absolute top-0 right-0 whitespace-nowrap">Evidence · one figure</span>
              </span>
            </div>
            <span className="relative block h-3 rounded-full bg-white/14">
              <span className="report-range absolute inset-y-0 right-0 left-0 mx-auto rounded-full bg-gold" />
            </span>
          </div>

          <p className="mt-4 flex items-center justify-center gap-2 text-[12.5px] text-muted">
            <CheckCircleIcon width={16} height={16} />
            Regulated by the {site.regulator}
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-hair py-[13px] text-small">
      <span className="text-muted">{label}</span>
      {children}
    </div>
  );
}
