'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronIcon } from '@/components/ui/icons';
import { cx } from '@/lib/cx';

/**
 * Gallery with a thumbnail strip. Motion is limited to the change the person asked for —
 * the new frame fades in, nothing else animates.
 */
export function PropertyGallery({
  images,
  note,
}: {
  images: { src: string; alt: string }[];
  note?: string;
}) {
  const [index, setIndex] = useState(0);
  const current = images[index];
  const many = images.length > 1;

  const go = (next: number) => setIndex((next + images.length) % images.length);

  return (
    <figure>
      <div className="relative aspect-[4/3] overflow-hidden rounded-brand border border-rule bg-cream-deep sm:aspect-[3/2]">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          priority
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="animate-[rise_.4s_ease-out] object-cover"
        />

        {many && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-brand bg-paper/90 text-green transition-colors hover:bg-paper"
            >
              <ChevronIcon className="rotate-180" />
              <span className="sr-only">Previous photograph</span>
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-brand bg-paper/90 text-green transition-colors hover:bg-paper"
            >
              <ChevronIcon />
              <span className="sr-only">Next photograph</span>
            </button>
            <p
              aria-live="polite"
              className="tnum absolute bottom-3 right-3 rounded-brand bg-green/90 px-2.5 py-1 text-[0.75rem] text-cream"
            >
              {index + 1} of {images.length}
            </p>
          </>
        )}
      </div>

      {many && (
        <ul className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {images.map((image, i) => (
            <li key={image.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-current={i === index}
                className={cx(
                  'relative block h-16 w-24 overflow-hidden rounded-brand border-2 transition-colors',
                  i === index ? 'border-gold' : 'border-transparent hover:border-green/40',
                )}
              >
                <Image src={image.src} alt="" fill sizes="96px" className="object-cover" />
                <span className="sr-only">{`Show photograph ${i + 1}: ${image.alt}`}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {note && (
        <figcaption className="mt-3 text-[0.8125rem] leading-relaxed text-muted">{note}</figcaption>
      )}
    </figure>
  );
}
