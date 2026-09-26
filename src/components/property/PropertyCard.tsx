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

  /*
   * On a phone, a compact row rather than a full card.
   *
   * Stacked at full width, sixteen of these made /listings ten screens long, and a phone reader
   * scanning for price and place had to scroll past a 290px photograph and a six-cell facts grid
   * to reach the next one. Below sm the card turns sideways: photograph on the left, then price,
   * title, area and a single line of facts. The facts grid and the action row are hidden there
   * (the title's link stretches over the whole card instead), and come back from sm up.
   */
  const facts = [
    listing.beds !== undefined && `${listing.beds} bed`,
    listing.baths !== undefined && `${listing.baths} bath`,
    listing.size,
  ].filter(Boolean) as string[];

  return (
    <article
      className={cx(
        'group relative flex flex-col overflow-hidden rounded-brand border border-rule bg-paper max-sm:flex-row',
        'transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(17,52,27,0.5)]',
        className,
      )}
    >
      <Link
        href={`/properties/${listing.slug}`}
        className="relative block aspect-[4/3] overflow-hidden max-sm:aspect-auto max-sm:min-h-[136px] max-sm:w-[38%] max-sm:shrink-0"
      >
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 40vw"
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <Badge tone="category" className="absolute left-3 top-3 max-sm:hidden">
          {category.name}
        </Badge>
        <Badge tone="type" className="absolute right-3 top-3 max-sm:top-2 max-sm:right-auto max-sm:left-2">
          {listingTypeLabel(listing)}
        </Badge>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col p-5 max-sm:p-3.5">
        <p className="tnum font-display text-h3 leading-none text-green max-sm:text-h4">
          {priceWithPeriod(listing, true)}
        </p>

        {/* Provenance. Only where CMT actually valued it — see Listing.valuedOn. */}
        {listing.valuedOn && (
          <p className="mt-2 inline-flex items-center gap-2 self-start border-l-2 border-gold pl-2 text-label text-muted">
            <span className="font-medium text-green">Valued by CMT</span>
            <span className="tnum">{listing.valuedOn}</span>
          </p>
        )}

        <h3 className="mt-3 text-lead leading-snug max-sm:mt-2 max-sm:line-clamp-2 max-sm:text-body">
          {/* On a phone the title's link stretches over the whole card (its ::after), so the row
              is one tap target rather than a small link inside it. */}
          <Link
            href={`/properties/${listing.slug}`}
            className="text-ink hover:text-green max-sm:after:absolute max-sm:after:inset-0"
          >
            {listing.title}
          </Link>
        </h3>

        <p className="mt-2 flex items-center gap-1.5 text-body text-muted max-sm:mt-1 max-sm:text-micro">
          <PinIcon width={15} height={15} className="shrink-0 text-gold-deep" />
          {listing.area}, {listing.city}
        </p>

        <p className="tnum mt-auto pt-2 text-micro text-ink sm:hidden">{facts.join(' · ')}</p>
        <dl className="mt-4 grid grid-cols-2 gap-x-4 border-t border-rule pt-3 text-body max-sm:hidden">
          {specs.map((spec) => (
            <div key={spec.label} className="py-1">
              <dt className="text-label text-muted">{spec.label}</dt>
              <dd className="tnum flex items-center gap-1.5 text-ink">
                {spec.icon && <span className="text-green/70">{spec.icon}</span>}
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-rule pt-4 text-body max-sm:hidden">
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
          <span className="tnum ml-auto text-label text-muted">{listing.reference}</span>
        </div>
      </div>
    </article>
  );
}
