import { valuationSteps } from '@/data/valuations';

/**
 * How an instruction runs, drawn on a datum.
 *
 * The homepage made its claim (the hero) and said what it is asked to do (the purposes), and
 * never once said what actually happens between the phone call and the report, which is the
 * question every first-time instructing client has and the one thing that justifies the fee and
 * the turnaround. This answers it in four stations.
 *
 * It is drawn in the hero's language rather than as a row of cards: one gold line running the
 * width of the section, and each step marked on it with the same inverted-triangle level mark the
 * hero uses for ±0.00. The hero's datum is where the building stands; this one is where the work
 * does. Reusing the mark is what makes the two read as one drawing set rather than two ideas.
 *
 * The steps are src/data/valuations.ts `valuationSteps`, the same list /valuations renders, so
 * the two pages cannot describe the method differently.
 *
 * Phone: the line turns vertical and runs down the left, stations stacked along it, because four
 * columns of body copy at 360px is four columns of eight words.
 */
export function ProcessDatum() {
  return (
    <ol className="relative mt-10 grid gap-9 pl-9 lg:grid-cols-4 lg:gap-8 lg:pt-9 lg:pl-0">
      {/* The datum: vertical down the left on a phone, horizontal across the top from lg. */}
      <span
        aria-hidden="true"
        className="absolute top-1 bottom-1 left-[7px] w-[2px] bg-gold lg:top-[7px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-[2px] lg:w-auto"
      />
      {valuationSteps.map((step, index) => (
        <li key={step.title} className="relative">
          {/* The level mark: a station on the line. Filled on the last step, which is the
              one the whole process exists to produce. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 16 14"
            className="absolute top-0.5 -left-9 h-3.5 w-4 lg:-top-9 lg:left-0"
          >
            <path
              d="M1 1 H15 L8 13 Z"
              fill={index === valuationSteps.length - 1 ? 'var(--color-gold)' : 'var(--color-paper)'}
              stroke="var(--color-gold-deep)"
              strokeWidth={1.4}
              strokeLinejoin="round"
            />
          </svg>
          <p className="tnum text-label font-semibold tracking-[0.12em] text-gold-deep uppercase">
            Step {String(index + 1).padStart(2, '0')}
          </p>
          <h3 className="mt-2 font-display text-h4 text-green">{step.title}</h3>
          <p className="mt-2 max-w-[34ch] text-body leading-relaxed text-muted">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
