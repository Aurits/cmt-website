import Image from 'next/image';
import Link from 'next/link';
import type { Category } from '@/lib/types';
import { cx } from '@/lib/cx';

/**
 * Image card with the label plate sitting on the green, so the type stays readable over
 * any photograph without a gradient wash doing the work.
 */
export function CategoryCard({
  category,
  count,
  priority = false,
  className,
}: {
  category: Category;
  count?: number;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={`/listings/${category.slug}`}
      className={cx(
        'group relative flex min-h-[190px] flex-col justify-end overflow-hidden rounded-brand border border-green/10 bg-green',
        className,
      )}
    >
      <Image
        src={category.image}
        alt={category.imageAlt}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        priority={priority}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
      {/* Only as much shading as the type needs to stay legible. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-green via-green/55 to-transparent"
      />
      <div className="relative p-5">
        <h3 className="text-h3 text-cream">{category.name}</h3>
        <p className="mt-1.5 text-micro leading-snug text-cream/80">{category.label}</p>
        {count !== undefined && (
          <p className="tnum mt-3 inline-block border-t-2 border-gold pt-2 text-micro text-gold">
            {count} {count === 1 ? 'listing' : 'listings'}
          </p>
        )}
      </div>
    </Link>
  );
}
