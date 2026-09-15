'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { valuationAssets, valuationPurposes, purposeCovers, LEAD } from '@/data/valuations';
import type { ValuationAssetSlug, ValuationPurposeSlug } from '@/lib/types';
import { cx } from '@/lib/cx';

/**
 * The instruction matrix.
 *
 * CMT's offer has two axes — what is being valued, and what the figure is for — and every
 * competitor in this market flattens them into a bullet list. As a grid it is instantly legible,
 * it does the visitor's filing for them, and it cannot be copied by a firm without the same depth
 * of service. See LAYOUT-SPECS.md A-03.
 *
 * Three things are deliberate:
 *
 * ONE DOM, TWO LAYOUTS. Below `md` the same elements reflow to a stacked list — each purpose
 * becomes a heading with its available assets as rows beneath it — rather than scrolling
 * sideways. A horizontally scrolling matrix on a phone is a matrix nobody reads, and rendering a
 * second copy of the markup for small screens would duplicate every link for a screen reader.
 * The column headers are hidden below `md` and each cell carries its own asset name instead, so
 * the stacked version reads as complete sentences rather than orphaned ticks.
 *
 * CELLS ARE LINKS, NOT STATE. There is no filter to manage and nothing to hydrate before the page
 * works: every filled cell is an anchor to a real route. The crosshair below is decoration on top
 * of that, so a failed bundle costs the page nothing.
 *
 * INERT CELLS ARE PRESENT, NOT HIDDEN. A combination CMT does not offer renders as a dash rather
 * than a gap, because a matrix with holes in it states the scope honestly and a matrix with rows
 * of different lengths just looks broken.
 */

type Cursor = { purpose: ValuationPurposeSlug; asset: ValuationAssetSlug } | null;

export function ValuationMatrix() {
  const [cursor, setCursor] = useState<Cursor>(null);
  const cellRefs = useRef(new Map<string, HTMLAnchorElement>());

  const key = (p: ValuationPurposeSlug, a: ValuationAssetSlug) => `${p}|${a}`;

  /**
   * Arrow keys move between cells, skipping the inert ones — landing focus on a combination we do
   * not offer would be a dead end. Roving tabindex keeps the whole grid to a single tab stop.
   */
  const onKeyDown = (
    event: React.KeyboardEvent,
    purposeIndex: number,
    assetIndex: number,
  ) => {
    const deltas: Record<string, [number, number]> = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    };
    const delta = deltas[event.key];
    if (!delta) return;
    event.preventDefault();

    let [row, col] = [purposeIndex, assetIndex];
    // Walk in the chosen direction until we find a live cell or run out of grid.
    for (let step = 0; step < 8; step += 1) {
      row += delta[0];
      col += delta[1];
      const purpose = valuationPurposes[row];
      const asset = valuationAssets[col];
      if (!purpose || !asset) return;
      if (!purposeCovers(purpose, asset.slug)) continue;
      const node = cellRefs.current.get(key(purpose.slug, asset.slug));
      node?.focus();
      setCursor({ purpose: purpose.slug, asset: asset.slug });
      return;
    }
  };

  const rowLit = (p: ValuationPurposeSlug) => cursor?.purpose === p;
  const colLit = (a: ValuationAssetSlug) => cursor?.asset === a;

  return (
    <div
      role="grid"
      aria-label="Valuation services by purpose and asset class"
      onMouseLeave={() => setCursor(null)}
      className={cx(
        'grid gap-px bg-rule',
        // One column on a phone; the corner cell plus three asset columns from md.
        'grid-cols-1 md:grid-cols-[minmax(11rem,1fr)_repeat(3,1fr)]',
      )}
    >
      {/* Header row — hidden entirely below md, where each cell names its own asset instead. */}
      <div role="row" className="contents">
        <div
          role="columnheader"
          aria-hidden="true"
          className="hidden bg-cream-deep/60 px-4 py-3 font-sans text-[0.75rem] uppercase tracking-[0.12em] text-muted md:block"
        >
          Purpose / asset
        </div>
        {valuationAssets.map((asset) => (
          <div
            key={asset.slug}
            role="columnheader"
            className={cx(
              'hidden px-4 py-3 text-[0.8125rem] leading-snug transition-colors duration-150 md:block',
              colLit(asset.slug) ? 'bg-gold/20 text-green' : 'bg-green text-cream',
            )}
          >
            {asset.short}
          </div>
        ))}
      </div>

      {valuationPurposes.map((purpose, purposeIndex) => (
        <div role="row" key={purpose.slug} className="contents">
          <div
            role="rowheader"
            className={cx(
              'px-4 py-3 transition-colors duration-150',
              rowLit(purpose.slug) ? 'bg-gold/20' : 'bg-cream-deep/60',
            )}
          >
            <span className="font-display text-[1.0625rem] text-green">{purpose.name}</span>
            <span className="mt-0.5 block text-[0.8125rem] text-muted md:hidden">
              {purpose.turnaround}
            </span>
          </div>

          {valuationAssets.map((asset, assetIndex) => {
            const covered = purposeCovers(purpose, asset.slug);
            const isLead = LEAD.purpose === purpose.slug && LEAD.asset === asset.slug;

            if (!covered) {
              return (
                <div
                  key={asset.slug}
                  role="gridcell"
                  className="flex min-h-[3.5rem] items-center gap-3 bg-cream-deep/25 px-4 py-3 text-muted md:min-h-[4.5rem] md:justify-center"
                >
                  <span className="text-[0.8125rem] md:hidden">{asset.short}</span>
                  <span aria-hidden="true" className="md:mx-auto">
                    &mdash;
                  </span>
                  <span className="sr-only">Not offered for {asset.name}</span>
                </div>
              );
            }

            return (
              <Link
                key={asset.slug}
                ref={(node) => {
                  if (node) cellRefs.current.set(key(purpose.slug, asset.slug), node);
                  else cellRefs.current.delete(key(purpose.slug, asset.slug));
                }}
                role="gridcell"
                href={`/valuations/${purpose.slug}#${asset.slug}`}
                tabIndex={purposeIndex === 0 && assetIndex === 0 ? 0 : -1}
                onMouseEnter={() => setCursor({ purpose: purpose.slug, asset: asset.slug })}
                onFocus={() => setCursor({ purpose: purpose.slug, asset: asset.slug })}
                onKeyDown={(event) => onKeyDown(event, purposeIndex, assetIndex)}
                className={cx(
                  'flex min-h-[3.5rem] flex-col justify-center gap-1 px-4 py-3 transition-colors duration-150 md:min-h-[4.5rem]',
                  isLead ? 'bg-green text-cream' : 'bg-paper text-ink hover:bg-green/8',
                )}
              >
                <span className={cx('text-[0.8125rem] md:hidden', isLead ? 'text-cream/75' : 'text-muted')}>
                  {asset.short}
                </span>
                <span className="text-[0.875rem] font-medium">
                  {isLead ? 'Our largest line' : 'We value this'}
                </span>
                <span
                  className={cx(
                    'text-[0.75rem]',
                    isLead ? 'text-gold' : 'text-muted',
                  )}
                >
                  {purpose.turnaround}
                </span>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}
