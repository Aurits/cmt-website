import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { allPartners } from '@/data/partners';
import type { Testimonial } from '@/lib/types';
import { cx } from '@/lib/cx';

/** The client's own mark, when the organisation is one we already hold a logo for. */
function partnerLogo(organisation: string) {
  const name = organisation.trim().toLowerCase();
  return allPartners.find(
    (partner) =>
      partner.name.toLowerCase() === name || partner.shortName?.toLowerCase() === name,
  )?.logo;
}

/**
 * A client reference, set the way a reference sits on file rather than as a floating
 * compliment: the quote, then who said it and for which organisation, then, when we know it,
 * the instruction it vouches for. A quote that names the job is worth more than one that
 * does not, so `instruction` is shown as a schedule row, the same device the rest of the site
 * uses for anything that can be checked.
 *
 * `featured` is the lead reference on green; the rest sit on paper beside it.
 */
export function TestimonialCard({
  testimonial,
  featured = false,
}: {
  testimonial: Testimonial;
  featured?: boolean;
}) {
  const logo = partnerLogo(testimonial.organisation);

  return (
    <figure
      className={cx(
        'flex h-full flex-col rounded-brand border p-6 sm:p-8',
        featured ? 'border-green bg-green text-cream' : 'border-rule bg-paper',
      )}
    >
      <span
        aria-hidden="true"
        className={cx(
          'font-display text-[3.5rem] leading-[0.6]',
          featured ? 'text-gold' : 'text-gold-deep',
        )}
      >
        &ldquo;
      </span>
      <blockquote
        className={cx(
          'mt-4 font-display leading-snug',
          featured ? 'text-h3 text-cream' : 'text-h4 text-green',
        )}
      >
        {testimonial.quote}
      </blockquote>

      <figcaption className="mt-auto pt-8">
        <div
          className={cx(
            'flex items-center gap-4 border-t pt-5',
            featured ? 'border-cream/20' : 'border-rule',
          )}
        >
          {logo && (
            // White plate: these are other organisations' marks, drawn for a white ground.
            // Same reasoning as the client conveyor.
            <span className="flex h-12 w-20 shrink-0 items-center justify-center rounded-brand border border-rule bg-white px-2">
              <Image src={logo} alt="" width={120} height={48} className="max-h-8 w-auto object-contain" />
            </span>
          )}
          <span className="text-sm">
            <span className={cx('block font-medium', featured ? 'text-cream' : 'text-ink')}>
              {testimonial.name}
            </span>
            <span className={cx('block', featured ? 'text-cream/70' : 'text-muted')}>
              {testimonial.role ? `${testimonial.role}, ` : ''}
              {testimonial.organisation}
            </span>
          </span>
        </div>
        {testimonial.instruction && (
          <p
            className={cx(
              'schedule-row mt-5 text-sm',
              featured ? 'border-cream/20' : 'border-rule',
            )}
          >
            <span className={featured ? 'text-cream/60' : 'text-muted'}>Instruction</span>
            <span className={cx('tnum text-right', featured ? 'text-cream' : 'text-ink')}>
              {testimonial.instruction}
              {testimonial.year ? ` · ${testimonial.year}` : ''}
            </span>
          </p>
        )}
      </figcaption>
    </figure>
  );
}

/**
 * The references, lead first. One reads full width; with more, the lead takes the wider
 * column and the rest stack beside it, so the section is never a row of equal boxes.
 */
export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [lead, ...rest] = testimonials;
  if (!lead) return null;

  return (
    <div className={cx('grid gap-6', rest.length > 0 && 'lg:grid-cols-12')}>
      <div className={cx(rest.length > 0 && 'lg:col-span-7')}>
        <TestimonialCard testimonial={lead} featured />
      </div>
      {rest.length > 0 && (
        <div className="grid gap-6 lg:col-span-5">
          {rest.map((testimonial) => (
            <TestimonialCard key={`${testimonial.name}-${testimonial.organisation}`} testimonial={testimonial} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Shown while `testimonials` is empty. The brief permits real, named testimonials only,
 * so rather than invent quotes this states the position and gives CMT the action.
 */
export function TestimonialsPending() {
  return (
    <div className="rounded-brand border border-dashed border-green/30 bg-cream-deep/50 p-6 sm:p-7">
      <p className="max-w-[52ch] font-display text-h3 leading-snug text-green">
        References from the banks, agencies and corporate clients CMT already works for
        will sit here.
      </p>
      <p className="mt-4 max-w-[58ch] text-body leading-relaxed text-muted">
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
