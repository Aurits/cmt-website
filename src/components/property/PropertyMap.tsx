'use client';

import dynamic from 'next/dynamic';
import { cx } from '@/lib/cx';

/**
 * Leaflet touches `window` on import, so the map itself is loaded on the client only and
 * lazily — it is never part of the first payload on a phone.
 */
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-sage-soft text-body text-muted">
      Loading map
    </div>
  ),
});

export function PropertyMap({
  center,
  label,
  caption,
  zoom,
  className,
  height = 'h-[320px]',
}: {
  center: [number, number];
  label: string;
  caption?: string;
  zoom?: number;
  className?: string;
  height?: string;
}) {
  return (
    // `isolate` keeps Leaflet's own stacking (panes at z-400, controls at z-1000) inside the
    // figure. Without it the zoom buttons and markers painted over the sticky masthead (z-header)
    // and any open dropdown as the page scrolled past the map.
    <figure className={cx('isolate overflow-hidden rounded-brand border border-hair', className)}>
      <div className={cx('w-full', height)}>
        <LeafletMap center={center} label={label} zoom={zoom} />
      </div>
      {caption && (
        <figcaption className="border-t border-hair bg-white px-4 py-3 text-micro text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
