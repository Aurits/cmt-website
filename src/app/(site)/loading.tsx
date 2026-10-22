import { Container } from '@/components/ui/Container';

/**
 * What a visitor sees the instant they click, while a page that renders on request (the listings
 * with their filters, a property, the contact forms) is fetched. Without it the old page simply
 * sat there until the new one arrived, which reads as a click that did nothing.
 *
 * A quiet outline of the page in the hero design's shapes (the eyebrow rule, a headline, a lead,
 * two cards) pulsing on the paper, so the swap to the real page is a fill-in rather than a jump.
 * Static pages arrive prebuilt and never show it.
 */
export default function Loading() {
  return (
    <Container className="pt-8 pb-24 min-[961px]:pt-12" aria-busy="true">
      <span className="sr-only" role="status">
        Loading the page
      </span>
      <div aria-hidden="true" className="animate-pulse">
        <span className="block h-[3px] w-10 rounded-full bg-gold" />
        <span className="mt-6 block h-10 w-[min(36rem,90%)] rounded-full bg-green/10" />
        <span className="mt-3 block h-10 w-[min(24rem,70%)] rounded-full bg-green/10" />
        <span className="mt-8 block h-4 w-[min(32rem,85%)] rounded-full bg-green/8" />
        <span className="mt-3 block h-4 w-[min(28rem,75%)] rounded-full bg-green/8" />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <span key={i} className="block h-56 rounded-(--radius-card) bg-white" />
          ))}
        </div>
      </div>
    </Container>
  );
}
