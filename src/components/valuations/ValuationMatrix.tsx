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
 * of service. See docs/LAYOUT-SPECS.md A-03.
 *
 * Three things are deliberate:
 *
 * TWO LAYOUTS, ONLY ONE EVER ON SCREEN. From `md` up it is the grid. Below `md` it is a compact
 * list, one row per purpose: the name, the turnaround once, and the asset types it covers.
 *
 * This replaced an earlier choice, one DOM reflowed into a stacked list, which on a phone
 * rendered all fifteen purpose-and-asset cells in a column, repeated "We value this" and the
 * same turnaround three times per purpose, and ran to about 1,900px: more than two screens to
 * read five facts. The turnaround is per purpose, not per cell, so the phone list loses nothing.
 * The two layouts are `hidden` at each other's breakpoints (display:none), so a screen reader
 * only ever meets one of them and nothing is duplicated.
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
    <>
    {/* Phone: one row per purpose. */}
    <ul className="border-t border-rule md:hidden">
      {valuationPurposes.map((purpose) => {
        const covered = valuationAssets.filter((asset) => purposeCovers(purpose, asset.slug));
        const isLeadRow = LEAD.purpose === purpose.slug;
        return (
          <li key={purpose.slug} className="border-b border-rule">
            <Link
              href={`/valuations/${purpose.slug}`}
              className="group flex items-start justify-between gap-4 py-4"
            >
              <span className="min-w-0">
                <span className="flex items-center gap-2 font-display text-lead text-green">
                  {purpose.name}
                  {isLeadRow && (
                    <span className="bg-gold px-1.5 py-0.5 font-sans text-label font-semibold text-green">
                      Most asked
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-micro text-muted">
                  {covered.map((asset) => asset.short).join(' · ')}
                </span>
              </span>
              <span className="tnum shrink-0 pt-1 text-right text-micro text-ink">
                {purpose.turnaround.replace(' working days', '')}
                <span className="block text-label text-muted">
                  {/\d/.test(purpose.turnaround) ? 'working days' : ''}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>

    <div
      role="grid"
      aria-label="Valuation services by purpose and asset class"
      onMouseLeave={() => setCursor(null)}
      className={cx(
        'grid gap-px bg-rule max-md:hidden',
        // One column on a phone; the corner cell plus three asset columns from md.
        'grid-cols-1 md:grid-cols-[minmax(11rem,1fr)_repeat(3,1fr)]',
      )}
    >
      {/* Header row — hidden entirely below md, where each cell names its own asset instead. */}
      <div role="row" className="contents">
        <div
          role="columnheader"
          aria-hidden="true"
          className="hidden bg-mist px-4 py-3 font-sans text-label uppercase tracking-[0.12em] text-muted md:block"
        >
          Purpose / asset
        </div>
        {valuationAssets.map((asset) => (
          <div
            key={asset.slug}
            role="columnheader"
            className={cx(
              'hidden px-4 py-3 text-micro leading-snug transition-colors duration-150 md:block',
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
              rowLit(purpose.slug) ? 'bg-gold/20' : 'bg-mist',
            )}
          >
            <span className="font-display text-lead text-green">{purpose.name}</span>
            <span className="mt-0.5 block text-micro text-muted md:hidden">
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
                  className="flex min-h-[3.5rem] items-center gap-3 bg-mist/50 px-4 py-3 text-muted md:min-h-[4.5rem] md:justify-center"
                >
                  <span className="text-micro md:hidden">{asset.short}</span>
                  {/* Said in words rather than as a dash: a dash in a table asks the reader to
                      guess whether it means "no", "not yet" or "not known". */}
                  <span aria-hidden="true" className="text-micro md:mx-auto">
                    Not offered
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
                <span className={cx('text-micro md:hidden', isLead ? 'text-cream/75' : 'text-muted')}>
                  {asset.short}
                </span>
                <span className="text-body font-medium">
                  {isLead ? 'Our largest line' : 'We value this'}
                </span>
                <span
                  className={cx(
                    'text-label',
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
    </>
  );
}
