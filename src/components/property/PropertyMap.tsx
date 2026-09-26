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
    <div className="flex h-full w-full items-center justify-center bg-mist text-sm text-muted">
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
    <figure className={cx('overflow-hidden rounded-brand border border-rule', className)}>
      <div className={cx('w-full', height)}>
        <LeafletMap center={center} label={label} zoom={zoom} />
      </div>
      {caption && (
        <figcaption className="border-t border-rule bg-paper px-4 py-3 text-micro text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
