import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { AreaIcon, BathIcon, BedIcon, PinIcon } from '@/components/ui/icons';
import { categoryBySlug } from '@/data/categories';
import { listingTypeLabel, priceWithPeriod } from '@/lib/format';
import type { Listing } from '@/lib/types';
import { cx } from '@/lib/cx';

/**
 * The price leads, because that is what a buyer scans for; the specification below it is
 * set as a valuation schedule (label over figure) rather than a row of icons and numbers.
 * Both CTAs the brief asks for are on every card.
 */
export function PropertyCard({
  listing,
  priority = false,
  className,
}: {
  listing: Listing;
  priority?: boolean;
  className?: string;
}) {
  const category = categoryBySlug[listing.category];
  const [cover] = listing.images;

  const specs = [
    listing.beds !== undefined && {
      label: 'Beds',
      value: String(listing.beds),
      icon: <BedIcon width={15} height={15} />,
    },
    listing.baths !== undefined && {
      label: 'Baths',
      value: String(listing.baths),
      icon: <BathIcon width={15} height={15} />,
    },
    { label: listing.sizeLabel, value: listing.size, icon: <AreaIcon width={15} height={15} /> },
    { label: 'Tenure', value: listing.tenure, icon: null },
  ].filter(Boolean) as { label: string; value: string; icon: React.ReactNode }[];

  return (
    <article
      className={cx(
        'group flex flex-col overflow-hidden rounded-brand border border-rule bg-paper',
        'transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(27,54,28,0.5)]',
        className,
      )}
    >
      <Link href={`/properties/${listing.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <Badge tone="category" className="absolute left-3 top-3">
          {category.name}
        </Badge>
        <Badge tone="type" className="absolute right-3 top-3">
          {listingTypeLabel(listing)}
        </Badge>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="tnum font-display text-[1.5rem] leading-none text-green">
          {priceWithPeriod(listing, true)}
        </p>

        {/* Provenance. Only where CMT actually valued it — see Listing.valuedOn. */}
        {listing.valuedOn && (
          <p className="mt-2 inline-flex items-center gap-2 self-start border-l-2 border-gold pl-2 text-[0.75rem] text-muted">
            <span className="font-medium text-green">Valued by CMT</span>
            <span className="tnum">{listing.valuedOn}</span>
          </p>
        )}

        <h3 className="mt-3 text-[1.0625rem] leading-snug">
          <Link href={`/properties/${listing.slug}`} className="text-ink hover:text-green">
            {listing.title}
          </Link>
        </h3>

        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
          <PinIcon width={15} height={15} className="shrink-0 text-gold-deep" />
          {listing.area}, {listing.city}
        </p>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 border-t border-rule pt-3 text-sm">
          {specs.map((spec) => (
            <div key={spec.label} className="py-1">
              <dt className="text-[0.75rem] text-muted">{spec.label}</dt>
              <dd className="tnum flex items-center gap-1.5 text-ink">
                {spec.icon && <span className="text-green/70">{spec.icon}</span>}
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-rule pt-4 text-[0.875rem]">
          <Link
            href={`/properties/${listing.slug}`}
            className="font-medium text-green underline decoration-gold decoration-2 underline-offset-4 hover:text-gold-deep"
          >
            View details
          </Link>
          <Link
            href={`/properties/${listing.slug}#enquire`}
            className="text-muted hover:text-green"
          >
            Contact agent
          </Link>
          <span className="tnum ml-auto text-[0.75rem] text-muted/80">{listing.reference}</span>
        </div>
      </div>
    </article>
  );
}
