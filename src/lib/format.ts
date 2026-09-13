import type { Listing } from './types';

/*
 * Grouped digits with an explicit UGX prefix.
 *
 * Deliberately not Intl.NumberFormat, for two reasons. Its currency style renders UGX as
 * the "USh" symbol, while Ugandan property is advertised and valued in "UGX". And these
 * helpers run inside client components (PropertyCard is rendered by ListingsExplorer), so
 * they execute on the server and again in the browser: Intl's locale data is not
 * guaranteed to be identical in Node and in every browser, which makes locale-dependent
 * formatting a documented cause of hydration mismatches. Plain grouping is deterministic
 * everywhere.
 */
function group(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** UGX 450,000,000 — full precision, for detail pages and key-facts panels. */
export function formatPrice(value: number): string {
  return `UGX ${group(value)}`;
}

/** UGX 450M / UGX 2.5B — compact, for cards where the price is the headline. */
export function formatPriceShort(value: number): string {
  if (value >= 1_000_000_000) {
    const b = value / 1_000_000_000;
    return `UGX ${b % 1 === 0 ? b : b.toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `UGX ${m % 1 === 0 ? m : m.toFixed(1)}M`;
  }
  return formatPrice(value);
}

export function priceWithPeriod(listing: Listing, compact = false): string {
  const base = compact ? formatPriceShort(listing.price) : formatPrice(listing.price);
  return listing.rentPeriod ? `${base}/month` : base;
}

export function listingTypeLabel(listing: Listing): string {
  return listing.listingType === 'rent' ? 'To let' : 'For sale';
}
