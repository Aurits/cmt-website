import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { cx } from '@/lib/cx';

/**
 * Closing CTA, the last thing on every page before the footer.
 *
 * Set as the hero design's report card is set (Hero.html): a white card with the 32px radius,
 * resting on a sage plate offset down and to the right, with a gold disc behind its top corner.
 * The same three layers that frame the sample report in the hero frame the page's last ask, so
 * every page opens and closes on the one shape.
 *
 * It sits on the page's paper with room underneath, then the ink footer starts with its rounded
 * top. A full-width banner directly on the footer used to merge into it (green on green) or shout
 * over it (solid gold); a card on paper does neither.
 *
 * Heading and lead on the left, the two pills on the right; stacked on a phone, where the lead is
 * dropped so the buttons stay inside the first glance.
 */
export function CTABanner({
  title,
  lead,
  primary,
  secondary,
  className,
}: {
  title: string;
  lead?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  /** Kept for callers that still pass one; the card version takes no photograph. */
  image?: string;
  imageAlt?: string;
  className?: string;
}) {
  return (
    <section className={cx('pt-4 pb-20 lg:pb-28', className)}>
      <Container>
        <div className="relative mr-[26px] mb-[26px]">
          <div aria-hidden="true" className="absolute inset-[26px_-26px_-26px_26px] rounded-(--radius-plate) bg-sage" />
          <div aria-hidden="true" className="absolute -top-[26px] -right-[26px] h-[92px] w-[92px] rounded-full bg-gold" />
          <div className="relative rounded-(--radius-card) border border-green/8 bg-white px-6 py-10 shadow-[0_28px_56px_rgba(15,42,26,0.12)] min-[601px]:px-12 lg:flex lg:items-end lg:justify-between lg:gap-12 lg:py-14">
            <div className="max-w-[40rem]">
              <p className="mb-5 flex items-center gap-3 text-[13px] font-semibold tracking-[0.16em] text-moss uppercase">
                <span aria-hidden="true" className="h-[3px] w-10 shrink-0 rounded-full bg-gold" />
                Next step
              </p>
              <h2 className="max-w-[20ch] text-h2 tracking-[-0.02em] text-balance text-green">{title}</h2>
              {lead && (
                <p className="mt-4 max-w-[52ch] text-lead leading-relaxed text-prose max-sm:hidden">{lead}</p>
              )}
            </div>
            <div className="mt-8 flex shrink-0 flex-col gap-3.5 sm:flex-row lg:mt-0">
              <Button href={primary.href} size="lg" arrow>
                {primary.label}
              </Button>
              {secondary && (
                <Button href={secondary.href} variant="outline" size="lg">
                  {secondary.label}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
