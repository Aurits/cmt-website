'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';
import { ChevronIcon, PinIcon } from '@/components/ui/icons';
import { categoryBySlug } from '@/data/categories';
import { listingTypeLabel, priceWithPeriod } from '@/lib/format';
import type { Listing } from '@/lib/types';
import { cx } from '@/lib/cx';

const INTERVAL = 6500;

/**
 * Full-bleed property carousel — the immersive moment on the homepage.
 *
 * Frames cross-fade and the active photograph drifts slowly (the .carousel-frame
 * animation), which is what makes a still image feel inhabited. Everything about that is
 * suppressed under prefers-reduced-motion, where it becomes a plain image swap.
 *
 * Auto-advance is a courtesy, not a demand: it stops on hover, on keyboard focus anywhere
 * inside, when the tab is hidden, and permanently the moment someone uses a control —
 * a carousel that keeps yanking the frame away from a reader is worse than a static one.
 */
export function FeaturedCarousel({ listings }: { listings: Listing[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tookControl, setTookControl] = useState(false);
  const region = useRef<HTMLDivElement>(null);

  const count = listings.length;
  const go = useCallback(
    (next: number, manual = false) => {
      if (manual) setTookControl(true);
      setIndex((next + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (paused || tookControl || count < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((current) => (current + 1) % count);
    }, INTERVAL);
    return () => window.clearInterval(timer);
  }, [paused, tookControl, count]);

  // Arrow keys move between frames when focus is inside the carousel.
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(index + 1, true);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(index - 1, true);
    }
  };

  if (count === 0) return null;

  return (
    <section
      ref={region}
      aria-roledescription="carousel"
      aria-label="Featured property"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="relative isolate w-full overflow-hidden bg-green"
      style={{ height: 'clamp(520px, 76vh, 760px)' }}
    >
      {listings.map((listing, i) => {
        const category = categoryBySlug[listing.category];
        const [cover] = listing.images;
        const active = i === index;

        return (
          <div
            key={listing.slug}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}: ${listing.title}`}
            aria-hidden={!active}
            className={cx(
              'absolute inset-0 transition-opacity duration-700 ease-out',
              active ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
          >
            <div className="absolute inset-0 overflow-hidden">
              <Image
                // Re-keyed on each activation so the drift restarts with the frame.
                key={active ? `${listing.slug}-on` : `${listing.slug}-off`}
                src={cover.src}
                alt={cover.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className={cx('object-cover', active && 'carousel-frame')}
              />
            </div>

            {/*
              Scrim: only as much as the type needs. Heavy in the lower-left corner where
              the headline and price sit, and clearing quickly across the rest so the
              photograph is still the thing you are looking at.
            */}
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-green via-green/35 to-transparent"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-green/85 via-green/20 to-transparent"
            />

            <Container className="relative flex h-full flex-col justify-end pb-24 pt-20 sm:pb-28">
              <div className="max-w-[46ch]">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="type">{listingTypeLabel(listing)}</Badge>
                  <Badge tone="categoryOnDark">{category.name}</Badge>
                </div>

                <h2 className="mt-5 text-h1 text-cream">
                  <Link
                    href={`/properties/${listing.slug}`}
                    tabIndex={active ? 0 : -1}
                    className="hover:text-gold"
                  >
                    {listing.title}
                  </Link>
                </h2>

                <p className="mt-3 flex items-center gap-2 text-body text-cream/85">
                  <PinIcon width={16} height={16} className="text-gold" />
                  {listing.area}, {listing.city}
                </p>

                <p className="tnum mt-5 font-display text-h2 leading-none text-gold">
                  {priceWithPeriod(listing)}
                </p>

                <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-cream/20 pt-4">
                  {[
                    listing.beds !== undefined && { label: 'Beds', value: String(listing.beds) },
                    listing.baths !== undefined && { label: 'Baths', value: String(listing.baths) },
                    { label: listing.sizeLabel, value: listing.size },
                    { label: 'Tenure', value: listing.tenure },
                  ]
                    .filter(Boolean)
                    .map((spec) => {
                      const item = spec as { label: string; value: string };
                      return (
                        <div key={item.label}>
                          <dt className="text-label text-cream/65">{item.label}</dt>
                          <dd className="tnum text-body text-cream">{item.value}</dd>
                        </div>
                      );
                    })}
                </dl>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/properties/${listing.slug}`}
                    tabIndex={active ? 0 : -1}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-control bg-gold px-6 py-3.5 text-base font-medium text-green transition-colors hover:bg-gold-deep hover:text-cream"
                  >
                    View this property
                  </Link>
                  <Link
                    href={`/properties/${listing.slug}#enquire`}
                    tabIndex={active ? 0 : -1}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-control border border-cream/45 px-6 py-3.5 text-base text-cream transition-colors hover:border-gold hover:text-gold"
                  >
                    Contact the agent
                  </Link>
                </div>
              </div>
            </Container>
          </div>
        );
      })}

      {/* Controls sit above the frames, in the bottom strip. */}
      <Container className="pointer-events-none absolute inset-x-0 bottom-0 z-10 pb-6">
        <div className="pointer-events-auto flex items-center justify-between gap-6">
          <ol className="flex items-center gap-2">
            {listings.map((listing, i) => (
              <li key={listing.slug}>
                <button
                  type="button"
                  onClick={() => go(i, true)}
                  aria-current={i === index ? 'true' : undefined}
                  className={cx(
                    'h-[3px] transition-all duration-300',
                    i === index ? 'w-10 bg-gold' : 'w-5 bg-cream/40 hover:bg-cream/70',
                  )}
                >
                  <span className="sr-only">{`Show property ${i + 1}: ${listing.title}`}</span>
                </button>
              </li>
            ))}
          </ol>

          <div className="flex items-center gap-2">
            <p className="tnum mr-2 text-micro text-cream/70" aria-live="polite">
              {index + 1} / {count}
            </p>
            <button
              type="button"
              onClick={() => go(index - 1, true)}
              className="flex h-11 w-11 items-center justify-center rounded-control border border-cream/35 text-cream transition-colors hover:border-gold hover:text-gold"
            >
              <ChevronIcon className="rotate-180" />
              <span className="sr-only">Previous property</span>
            </button>
            <button
              type="button"
              onClick={() => go(index + 1, true)}
              className="flex h-11 w-11 items-center justify-center rounded-control border border-cream/35 text-cream transition-colors hover:border-gold hover:text-gold"
            >
              <ChevronIcon />
              <span className="sr-only">Next property</span>
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
