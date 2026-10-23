import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Plate } from '@/components/ui/Section';
import { valuationSteps } from '@/data/valuations';
import { cx } from '@/lib/cx';

/**
 * How a valuation runs, in four steps: one sage plate holding four white cards, each numbered in
 * a disc, the last disc gold because the signed report is the deliverable. Used on the homepage
 * and on /valuations, from the same data (src/data/valuations.ts `valuationSteps`), so the two
 * pages cannot describe the method differently or draw it two ways.
 */
export function ProcessSteps({ title = 'From instruction to signed report' }: { title?: string }) {
  return (
    <Plate>
      <Reveal>
        <SectionHeading
          eyebrow="How it runs"
          title={title}
          lead="Four steps. We tell you at the start which of them could affect your deadline."
        />
      </Reveal>
      {/* A swipe rail on a phone ("THE MOBILE SYSTEM" in globals.css): stacked, the four cards
          were a screen and a half; side by side they are one card tall. */}
      <ol className="rail mt-10 sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {valuationSteps.map((step, index) => {
          const last = index === valuationSteps.length - 1;
          return (
            <Reveal as="li" key={step.title} delay={index * 80} className="flex">
              <div className="flex w-full flex-col rounded-[24px] bg-white p-6">
                <span
                  aria-hidden="true"
                  className={cx(
                    'tnum flex h-10 w-10 items-center justify-center rounded-full font-display text-[15px] font-semibold',
                    last ? 'bg-gold text-green' : 'bg-green text-white',
                  )}
                >
                  {index + 1}
                </span>
                <h3 className="mt-5 font-display text-lead font-semibold text-green">{step.title}</h3>
                <p className="mt-2 text-small leading-relaxed text-muted">{step.body}</p>
              </div>
            </Reveal>
          );
        })}
      </ol>
    </Plate>
  );
}
