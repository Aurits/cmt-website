'use client';

import { useMemo, useState } from 'react';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Select } from '@/components/ui/Select';
import { categories } from '@/data/categories';
import { formatPriceShort } from '@/lib/format';
import type { CategorySlug, Listing, ListingType } from '@/lib/types';
import { cx } from '@/lib/cx';

type Sort = 'featured' | 'price-asc' | 'price-desc';

export interface ExplorerDefaults {
  type?: ListingType | 'any';
  category?: CategorySlug | 'any';
  city?: string;
}

/**
 * Filter, sort and pagination over the mock stock. Everything runs client-side against
 * the static data — no requests, which is also how it will behave once the real API
 * arrives behind the same shape.
 *
 * Price thresholds follow the selected transaction: monthly rents and sale prices are
 * orders of magnitude apart, so one shared ladder would be useless for both.
 */
export function ListingsExplorer({
  listings,
  cities,
  lockedCategory,
  defaults,
  perPage = 9,
}: {
  listings: Listing[];
  /** Every town with stock, not only those in `listings`, so a category page offers the same list. */
  cities: string[];
  lockedCategory?: CategorySlug;
  defaults?: ExplorerDefaults;
  perPage?: number;
}) {
  const [category, setCategory] = useState<CategorySlug | 'any'>(defaults?.category ?? 'any');
  const [type, setType] = useState<ListingType | 'any'>(defaults?.type ?? 'any');
  const [city, setCity] = useState<string>(defaults?.city ?? 'any');
  const [maxPrice, setMaxPrice] = useState<number | 'any'>('any');
  const [beds, setBeds] = useState<number | 'any'>('any');
  const [sort, setSort] = useState<Sort>('featured');
  const [page, setPage] = useState(1);
  const [moreOpen, setMoreOpen] = useState(false);

  const priceLadder =
    type === 'rent'
      ? [2_000_000, 5_000_000, 10_000_000, 15_000_000]
      : type === 'sale'
        ? [500_000_000, 1_000_000_000, 3_000_000_000, 7_000_000_000]
        : [5_000_000, 100_000_000, 500_000_000, 1_000_000_000, 7_000_000_000];

  const filtered = useMemo(() => {
    const result = listings.filter((listing) => {
      if (lockedCategory && listing.category !== lockedCategory) return false;
      if (!lockedCategory && category !== 'any' && listing.category !== category) return false;
      if (type !== 'any' && listing.listingType !== type) return false;
      if (city !== 'any' && listing.city !== city) return false;
      if (maxPrice !== 'any' && listing.price > maxPrice) return false;
      if (beds !== 'any' && (listing.beds ?? 0) < beds) return false;
      return true;
    });

    return result.sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });
  }, [listings, lockedCategory, category, type, city, maxPrice, beds, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  /** Any filter change returns you to the first page of results. */
  function change<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  const resetAll = () => {
    setCategory(lockedCategory ?? 'any');
    setType('any');
    setCity('any');
    setMaxPrice('any');
    setBeds('any');
    setSort('featured');
    setPage(1);
  };

  /** How many of the tier-two filters are set — shown on the disclosure so nothing hides. */
  const extraCount = [maxPrice !== 'any', beds !== 'any'].filter(Boolean).length;

  const filtersApplied =
    (!lockedCategory && category !== 'any') ||
    type !== 'any' ||
    city !== 'any' ||
    maxPrice !== 'any' ||
    beds !== 'any';

  return (
    <div>
      {/*
        Two tiers. The three filters that actually narrow a search stay visible; price and
        bedrooms sit behind a disclosure that carries a count, so nothing is hidden silently.
        Five dropdowns in a row was a wall in front of the stock.
      */}
      <div className="rounded-(--radius-card) border border-green/8 bg-white p-5 sm:p-6">
        <div
          className={cx(
            'grid gap-4 sm:grid-cols-2',
            lockedCategory ? 'lg:grid-cols-[1fr_1fr_auto]' : 'lg:grid-cols-[1fr_1fr_1fr_auto]',
          )}
        >
          {!lockedCategory && (
            <Field label="Property type" id="filter-category">
              <Select
                id="filter-category"
                value={category}
                onChange={(next) => change(setCategory)(next as CategorySlug | 'any')}
                options={[
                  { value: 'any', label: 'All types' },
                  ...categories.map((item) => ({
                    value: item.slug,
                    label: item.name,
                    hint: String(listings.filter((entry) => entry.category === item.slug).length),
                  })),
                ]}
              />
            </Field>
          )}

          <Field label="Buying or renting" id="filter-transaction">
            <Select
              id="filter-transaction"
              value={type}
              onChange={(next) => {
                change(setType)(next as ListingType | 'any');
                setMaxPrice('any');
              }}
              options={[
                { value: 'any', label: 'Buy or rent' },
                { value: 'sale', label: 'For sale' },
                { value: 'rent', label: 'To let' },
              ]}
            />
          </Field>

          <Field label="Location" id="filter-city">
            <Select
              id="filter-city"
              value={city}
              onChange={change(setCity)}
              options={[
                { value: 'any', label: 'All locations' },
                ...cities.map((name) => ({ value: name, label: name })),
              ]}
            />
          </Field>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => setMoreOpen((open) => !open)}
              aria-expanded={moreOpen}
              aria-controls="more-filters"
              className="flex min-h-[46px] w-full items-center justify-between gap-3 rounded-full border border-green/25 px-5 py-2.5 text-body font-medium text-green transition-colors hover:bg-green/6 lg:w-auto"
            >
              More filters
              {extraCount > 0 && (
                <span className="tnum rounded-full bg-green px-2 py-0.5 text-[12px] text-white">
                  {extraCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div
          id="more-filters"
          hidden={!moreOpen}
          className="mt-5 grid gap-4 border-t border-hair pt-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          <Field label="Price up to" id="filter-price">
            <Select
              id="filter-price"
              value={String(maxPrice)}
              onChange={(next) => change(setMaxPrice)(next === 'any' ? 'any' : Number(next))}
              options={[
                { value: 'any', label: 'Any price' },
                ...priceLadder.map((value) => ({
                  value: String(value),
                  label: `${formatPriceShort(value)}${type === 'rent' ? ' a month' : ''}`,
                })),
              ]}
            />
          </Field>

          <Field label="Bedrooms" id="filter-beds">
            <Select
              id="filter-beds"
              value={String(beds)}
              onChange={(next) => change(setBeds)(next === 'any' ? 'any' : Number(next))}
              options={[
                { value: 'any', label: 'Any' },
                ...[1, 2, 3, 4, 5].map((value) => ({
                  value: String(value),
                  label: `${value} or more`,
                })),
              ]}
            />
          </Field>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 border-b border-green/12 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className="text-body text-muted">
          <span className="tnum font-semibold text-green">{filtered.length}</span>{' '}
          {filtered.length === 1 ? 'property' : 'properties'}
          {filtersApplied && (
            <>
              {' '}
              match your filters.{' '}
              <button
                type="button"
                onClick={resetAll}
                className="text-green underline decoration-gold decoration-2 underline-offset-4"
              >
                Clear filters
              </button>
            </>
          )}
        </p>

        <div className="flex items-center gap-2.5 text-body text-muted">
          <label htmlFor="filter-sort" className="shrink-0">
            Sort by
          </label>
          <Select
            id="filter-sort"
            size="sm"
            tone="paper"
            className="w-[210px]"
            value={sort}
            onChange={(next) => change(setSort)(next as Sort)}
            options={[
              { value: 'featured', label: 'Featured first' },
              { value: 'price-asc', label: 'Price, lowest first' },
              { value: 'price-desc', label: 'Price, highest first' },
            ]}
          />
        </div>
      </div>

      {/* The results heading. Hidden, because the count and the filters above already say what
          this is; present, because the cards are h3s and a screen reader jumping by heading
          should land on a section, not go straight from the page title to the first card. */}
      <h2 className="sr-only">Properties</h2>
      {visible.length > 0 ? (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((listing, index) => (
            <li key={listing.slug} className="flex">
              <PropertyCard listing={listing} priority={index < 3} className="w-full" />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-(--radius-card) bg-sage-soft p-10 text-center">
          <p className="font-display text-h3 font-semibold text-green">
            Nothing on our books matches that yet
          </p>
          <p className="mx-auto mt-3 max-w-[46ch] text-body leading-relaxed text-muted">
            Widen the filters, or tell us what you are looking for and we will call you when
            something comes in.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={resetAll}
              className="min-h-12 rounded-full bg-green px-6 text-body font-semibold text-white hover:brightness-125"
            >
              Clear filters
            </button>
            <a
              href="/contact"
              className="inline-flex min-h-12 items-center rounded-full border border-green/30 px-6 text-body font-semibold text-green hover:bg-green/6"
            >
              Register a requirement
            </a>
          </div>
        </div>
      )}

      {pageCount > 1 && (
        <nav aria-label="Listing pages" className="mt-10 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={pagerClass}
          >
            Previous
          </button>
          <ul className="flex items-center gap-1">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((number) => (
              <li key={number}>
                <button
                  type="button"
                  onClick={() => setPage(number)}
                  aria-current={number === currentPage ? 'page' : undefined}
                  className={cx(
                    'tnum h-11 w-11 rounded-full border text-body font-medium',
                    number === currentPage
                      ? 'border-green bg-green text-white'
                      : 'border-green/20 bg-white text-green hover:bg-green/6',
                  )}
                >
                  {number}
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setPage(Math.min(pageCount, currentPage + 1))}
            disabled={currentPage === pageCount}
            className={pagerClass}
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}

const pagerClass =
  'min-h-11 rounded-full border border-green/20 bg-white px-5 text-body font-medium text-green hover:bg-green/6 disabled:cursor-not-allowed disabled:opacity-45';

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-micro text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}
