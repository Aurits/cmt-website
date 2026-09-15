import { Button } from '@/components/ui/Button';
import type { Testimonial } from '@/lib/types';

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col justify-between rounded-brand border border-rule bg-paper p-6">
      <blockquote className="font-display text-[1.1875rem] leading-snug text-green">
        <span aria-hidden="true" className="mr-1 text-gold">
          &ldquo;
        </span>
        {testimonial.quote}
      </blockquote>
      <figcaption className="mt-6 border-t border-rule pt-4 text-sm">
        <span className="block font-medium text-ink">{testimonial.name}</span>
        <span className="block text-muted">
          {testimonial.role ? `${testimonial.role}, ` : ''}
          {testimonial.organisation}
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Shown while `testimonials` is empty. The brief permits real, named testimonials only,
 * so rather than invent quotes this states the position and gives CMT the action.
 */
export function TestimonialsPending() {
  return (
    <div className="rounded-brand border border-dashed border-green/30 bg-cream-deep/50 p-6 sm:p-7">
      <p className="max-w-[52ch] font-display text-[1.375rem] leading-snug text-green">
        References from the banks, agencies and corporate clients CMT already works for
        will sit here.
      </p>
      <p className="mt-4 max-w-[58ch] text-[0.9375rem] leading-relaxed text-muted">
        We have left this section empty on purpose. A valuation firm&rsquo;s credibility rests
        on named references, so these need to come from real clients with their permission,
        rather than from the placeholder quotes on the current site.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button href="/about/clients" variant="outline" size="sm">
          See who we work for
        </Button>
        <Button href="/contact" variant="quiet" size="sm">
          Send us a reference to publish
        </Button>
      </div>
    </div>
  );
}
