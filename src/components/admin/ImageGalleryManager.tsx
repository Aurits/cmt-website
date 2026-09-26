'use client';

import { useRef, useState, useTransition } from 'react';
import Image from 'next/image';
import { ArrowDownIcon, ArrowUpIcon, DragHandleIcon, PlusIcon, TrashIcon } from '@/components/admin/icons';
import { AdminSelectField } from '@/components/admin/AdminSelectField';
import { inputClass } from '@/components/forms/fields';
import { stockListingImages } from '@/lib/admin/stockImages';
import { uploadImage, type UploadFolder } from '@/lib/admin/upload';
import { cx } from '@/lib/cx';

export interface GalleryImage {
  src: string;
  alt: string;
}

/**
 * Drag-and-drop gallery reordering, with two ways to add a photo: pick from the licensed stock
 * that shipped with the site, or upload one.
 *
 * Uploads are real now. They used to become an object URL that lasted until the tab closed,
 * which looked exactly like saving and was not; the file now goes to the bucket through a server
 * action and what comes back is a URL that survives a reload and works for everyone.
 *
 * The button stays disabled while a file is in flight and failures are shown rather than
 * swallowed, because the one thing worse than a slow upload is a silent one.
 */
export function ImageGalleryManager({
  images,
  onChange,
  folder = 'listings',
}: {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  /** Which prefix in the bucket these belong under. */
  folder?: UploadFolder;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [stockChoice, setStockChoice] = useState(stockListingImages[0].file);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, startUpload] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  const updateAlt = (index: number, alt: string) => {
    onChange(images.map((image, i) => (i === index ? { ...image, alt } : image)));
  };

  const removeAt = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const addStock = () => {
    const stock = stockListingImages.find((entry) => entry.file === stockChoice);
    if (!stock) return;
    onChange([...images, { src: stock.src, alt: stock.label }]);
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setUploadError(null);
    const alt = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');

    startUpload(async () => {
      const body = new FormData();
      body.set('file', file);
      body.set('folder', folder);
      const result = await uploadImage(body);
      if (result.error || !result.url) {
        setUploadError(result.error ?? 'The upload failed.');
        return;
      }
      onChange([...images, { src: result.url, alt }]);
    });
  };

  return (
    <div className="grid gap-4">
      {images.length === 0 ? (
        <p className="rounded-brand border border-dashed border-rule-strong bg-cream px-4 py-8 text-center text-body text-muted">
          No photographs yet. Add one below.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <li
              key={`${image.src}-${index}`}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (dragIndex !== null && dragIndex !== index) move(dragIndex, index);
                setDragIndex(null);
              }}
              className={cx(
                'rounded-brand border border-rule bg-cream p-2.5 transition-opacity',
                dragIndex === index && 'opacity-40',
              )}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-brand border border-rule bg-mist">
                <Image src={image.src} alt={image.alt || 'Listing photograph'} fill unoptimized className="object-cover" />
                {index === 0 && (
                  <span className="absolute left-2 top-2 rounded-control bg-green px-2 py-0.5 text-label font-medium text-cream">
                    Cover
                  </span>
                )}
                <span
                  className="absolute right-2 top-2 flex h-7 w-7 cursor-grab items-center justify-center rounded-control bg-ink/55 text-cream active:cursor-grabbing"
                  aria-hidden="true"
                >
                  <DragHandleIcon width={15} height={15} />
                </span>
              </div>

              <input
                value={image.alt}
                onChange={(event) => updateAlt(index, event.target.value)}
                placeholder="Describe this photo"
                aria-label={`Alt text for image ${index + 1}`}
                className={cx(inputClass, 'mt-2.5 !py-2 text-micro')}
              />

              <div className="mt-2 flex items-center justify-between">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, index - 1)}
                    disabled={index === 0}
                    aria-label="Move earlier"
                    className="flex h-8 w-8 items-center justify-center rounded-control border border-rule-strong text-muted transition-colors hover:border-green/50 hover:text-green disabled:opacity-30"
                  >
                    <ArrowUpIcon width={14} height={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, index + 1)}
                    disabled={index === images.length - 1}
                    aria-label="Move later"
                    className="flex h-8 w-8 items-center justify-center rounded-control border border-rule-strong text-muted transition-colors hover:border-green/50 hover:text-green disabled:opacity-30"
                  >
                    <ArrowDownIcon width={14} height={14} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  className="flex h-8 w-8 items-center justify-center rounded-control border border-rule-strong text-muted transition-colors hover:border-flag hover:text-flag"
                  aria-label="Remove image"
                >
                  <TrashIcon width={14} height={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="grid gap-3 rounded-brand border border-rule bg-cream p-4 sm:grid-cols-[1fr_auto_auto]">
        <AdminSelectField
          id="stock-image"
          label="Add from licensed stock"
          value={stockChoice}
          onChange={setStockChoice}
          options={stockListingImages.map((entry) => ({ value: entry.file, label: entry.label }))}
        />
        <div className="flex items-end">
          <button
            type="button"
            onClick={addStock}
            className="flex h-[46px] items-center gap-1.5 rounded-control border border-green/35 px-4 text-body text-green transition-colors hover:border-green hover:bg-green/8"
          >
            <PlusIcon width={16} height={16} /> Add
          </button>
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
            className="flex h-[46px] items-center gap-1.5 rounded-control border border-rule-strong px-4 text-body text-muted transition-colors hover:border-green/50 hover:text-green disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? 'Uploading…' : 'Upload from device'}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onFileChange}
            className="hidden"
          />
        </div>
      </div>

      {uploadError && (
        <p role="alert" className="border-l-[3px] border-flag bg-flag/10 px-3 py-2 text-micro text-flag">
          {uploadError}
        </p>
      )}

      <p className="text-micro text-muted">
        JPEG, PNG or WebP, up to 8MB. Uploads go straight to the site&rsquo;s image storage and are
        live as soon as the listing is saved. Photographs are served resized, so there is no need
        to shrink them first.
      </p>
    </div>
  );
}
