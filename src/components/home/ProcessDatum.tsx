import { valuationSteps } from '@/data/valuations';
import { cx } from '@/lib/cx';

/**
 * How an instruction runs, drawn on a datum.
 *
 * The homepage made its claim (the hero) and said what it is asked to do (the purposes), and
 * never once said what actually happens between the phone call and the report, which is the
 * question every first-time instructing client has and the one thing that justifies the fee and
 * the turnaround. This answers it in four stations.
 *
 * THE MARKERS ARE NUMBERED SQUARES ON A 2PX LINE. The first version marked each station with a
 * 14px outline triangle on a 1px hairline: correct as drafting, and nearly invisible as a page
 * graphic, so the four steps read as four loose paragraphs rather than as a sequence. A solid,
 * numbered node says "step" at a glance, carries the number the eyebrow label used to repeat, and
 * holds its own beside the section heading. Square, because every surface on the site that
 * presents something is square. Green for the working steps; gold for the fourth, the signed
 * report, because that is the one the whole process exists to produce.
 *
 * The steps are src/data/valuations.ts `valuationSteps`, the same list /valuations renders, so
 * the two pages cannot describe the method differently.
 *
 * Phone: the line turns vertical and runs down through the nodes, the text beside each one,
 * because four columns of body copy at 360px is four columns of eight words.
 */
const NODE = 44; // px: the node's side, and what the line is centred on

export function ProcessDatum() {
  return (
    <ol className="relative mt-10 grid gap-9 lg:grid-cols-4 lg:gap-8">
      {/* The datum: down through the node centres on a phone, across them from lg. */}
      <span
        aria-hidden="true"
        className="absolute top-2 bottom-2 w-[2px] bg-gold/60 lg:top-[21px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-[2px] lg:w-auto"
        style={{ left: NODE / 2 - 1 }}
      />
      {valuationSteps.map((step, index) => {
        const last = index === valuationSteps.length - 1;
        return (
          <li key={step.title} className="relative grid grid-cols-[44px_1fr] gap-x-5 lg:block">
            <span
              aria-hidden="true"
              className={cx(
                'tnum relative z-10 flex h-11 w-11 items-center justify-center font-display text-lead font-semibold',
                last ? 'bg-gold text-green' : 'bg-green text-gold',
              )}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="lg:mt-6 lg:pr-4">
              <h3 className="font-display text-h4 text-green">
                <span className="sr-only">Step {index + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-2 max-w-[34ch] text-body leading-relaxed text-muted">{step.body}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
