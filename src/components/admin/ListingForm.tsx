'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AdminSelectField } from '@/components/admin/AdminSelectField';
import { ConfirmButton } from '@/components/admin/ConfirmButton';
import { FormSection } from '@/components/admin/FormSection';
import { ImageGalleryManager } from '@/components/admin/ImageGalleryManager';
import { SaveBar } from '@/components/admin/SaveBar';
import { Label, TextArea, TextField, inputClass } from '@/components/forms/fields';
import { categories } from '@/data/categories';
import { useAdmin, slugify } from '@/lib/admin/store';
import type { AdminListing } from '@/lib/admin/types';
import { cx } from '@/lib/cx';

const tenureOptions = ['Freehold', 'Leasehold', 'Mailo', 'Customary'].map((v) => ({ value: v, label: v }));
const sizeLabelOptions = ['Built area', 'Floor area', 'Land area', 'Plot size'].map((v) => ({
  value: v,
  label: v,
}));
const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];
const listingTypeOptions = [
  { value: 'sale', label: 'For sale' },
  { value: 'rent', label: 'To let' },
];

export function ListingForm({ initial, isNew }: { initial: AdminListing; isNew: boolean }) {
  const router = useRouter();
  const { state, upsertListing, deleteListing } = useAdmin();
  const [draft, setDraft] = useState<AdminListing>(initial);
  const [dirty, setDirty] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [slugTouched, setSlugTouched] = useState(!isNew);

  const set = <K extends keyof AdminListing>(key: K, value: AdminListing[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    setJustSaved(false);
  };

  const handleTitleChange = (title: string) => {
    setDraft((prev) => ({
      ...prev,
      title,
      slug: slugTouched ? prev.slug : slugify(title),
    }));
    setDirty(true);
    setJustSaved(false);
  };

  const handleSave = () => {
    const finalSlug = draft.slug || slugify(draft.title) || `listing-${Date.now()}`;
    const toSave: AdminListing = {
      ...draft,
      slug: finalSlug,
      rentPeriod: draft.listingType === 'rent' ? 'month' : undefined,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    upsertListing(toSave);
    setDraft(toSave);
    setDirty(false);
    setJustSaved(true);
    setSlugTouched(true);
    if (isNew) router.replace(`/admin/listings/${finalSlug}`);
  };

  return (
    <div className="grid gap-6">
      <FormSection title="Basic details">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="title"
            label="Title"
            value={draft.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Four-bedroom villa with pool, Kololo"
          />
          <div>
            <Label htmlFor="slug">
              Slug <span className="ml-1.5 text-micro text-muted">(used in the property URL)</span>
            </Label>
            <input
              id="slug"
              value={draft.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set('slug', slugify(e.target.value));
              }}
              className={cx(inputClass, 'tnum')}
              placeholder="kololo-four-bedroom-villa"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <Label htmlFor="reference">Reference</Label>
            <input id="reference" value={draft.reference} readOnly className={cx(inputClass, 'tnum bg-mist/50 text-muted')} />
          </div>
          <div>
            <Label htmlFor="price">Price (UGX)</Label>
            <input
              id="price"
              type="number"
              min={0}
              value={draft.price || ''}
              onChange={(e) => set('price', Number(e.target.value) || 0)}
              className={cx(inputClass, 'tnum')}
              placeholder="2800000000"
            />
          </div>
          <AdminSelectField
            id="listingType"
            label="Sale or let"
            value={draft.listingType}
            onChange={(v) => set('listingType', v as AdminListing['listingType'])}
            options={listingTypeOptions}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <AdminSelectField
            id="category"
            label="Category"
            value={draft.category}
            onChange={(v) => set('category', v as AdminListing['category'])}
            options={categories.map((c) => ({ value: c.slug, label: c.name }))}
          />
          <AdminSelectField
            id="status"
            label="Status"
            value={draft.status}
            onChange={(v) => set('status', v as AdminListing['status'])}
            options={statusOptions}
          />
        </div>
      </FormSection>

      <FormSection title="Specifications">
        <div className="grid gap-5 sm:grid-cols-4">
          <div>
            <Label htmlFor="beds" optional>
              Beds
            </Label>
            <input
              id="beds"
              type="number"
              min={0}
              value={draft.beds ?? ''}
              onChange={(e) => set('beds', e.target.value === '' ? undefined : Number(e.target.value))}
              className={cx(inputClass, 'tnum')}
            />
          </div>
          <div>
            <Label htmlFor="baths" optional>
              Baths
            </Label>
            <input
              id="baths"
              type="number"
              min={0}
              value={draft.baths ?? ''}
              onChange={(e) => set('baths', e.target.value === '' ? undefined : Number(e.target.value))}
              className={cx(inputClass, 'tnum')}
            />
          </div>
          <TextField
            id="size"
            label="Size"
            value={draft.size}
            onChange={(e) => set('size', e.target.value)}
            placeholder="420 sqm / 25 decimals"
          />
          <AdminSelectField
            id="sizeLabel"
            label="Size is"
            value={draft.sizeLabel}
            onChange={(v) => set('sizeLabel', v as AdminListing['sizeLabel'])}
            options={sizeLabelOptions}
          />
        </div>
        <AdminSelectField
          id="tenure"
          label="Tenure"
          value={draft.tenure}
          onChange={(v) => set('tenure', v as AdminListing['tenure'])}
          options={tenureOptions}
        />
      </FormSection>

      <FormSection title="Neighborhood & location">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField id="city" label="City / town" value={draft.city} onChange={(e) => set('city', e.target.value)} />
          <TextField id="area" label="Area / neighbourhood" value={draft.area} onChange={(e) => set('area', e.target.value)} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="lat" optional>
              Latitude
            </Label>
            <input
              id="lat"
              type="number"
              step="any"
              value={draft.coords[0]}
              onChange={(e) => set('coords', [Number(e.target.value), draft.coords[1]])}
              className={cx(inputClass, 'tnum')}
            />
          </div>
          <div>
            <Label htmlFor="lng" optional>
              Longitude
            </Label>
            <input
              id="lng"
              type="number"
              step="any"
              value={draft.coords[1]}
              onChange={(e) => set('coords', [draft.coords[0], Number(e.target.value)])}
              className={cx(inputClass, 'tnum')}
            />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminSelectField
            id="agentId"
            label="Assigned agent"
            value={draft.agentId}
            onChange={(v) => set('agentId', v)}
            options={[{ value: '', label: 'Unassigned' }, ...state.agents.map((a) => ({ value: a.id, label: a.name }))]}
          />
          <TextField
            id="valuedOn"
            label="Valued by CMT on"
            optional
            value={draft.valuedOn ?? ''}
            onChange={(e) => set('valuedOn', e.target.value || undefined)}
            placeholder="Mar 2026"
          />
        </div>
        <label className="flex items-center gap-2.5 text-body text-ink">
          <input
            type="checkbox"
            checked={Boolean(draft.featured)}
            onChange={(e) => set('featured', e.target.checked)}
            className="h-4 w-4 rounded-[3px] border-rule-strong text-green accent-green"
          />
          Feature on the homepage carousel
        </label>
      </FormSection>

      <FormSection title="Description">
        <TextArea
          id="summary"
          label="Summary"
          value={draft.summary}
          onChange={(e) => set('summary', e.target.value)}
          rows={2}
        />
        <div>
          <Label htmlFor="description">Full description</Label>
          <textarea
            id="description"
            value={draft.description.join('\n\n')}
            onChange={(e) => set('description', e.target.value.split(/\n{2,}/).filter(Boolean))}
            rows={6}
            className={cx(inputClass, 'resize-y')}
            placeholder={'One paragraph per blank line.'}
          />
        </div>
        <div>
          <Label htmlFor="features">Key features</Label>
          <textarea
            id="features"
            value={draft.features.join('\n')}
            onChange={(e) => set('features', e.target.value.split('\n').filter(Boolean))}
            rows={4}
            className={cx(inputClass, 'resize-y')}
            placeholder={'One feature per line'}
          />
        </div>
      </FormSection>

      <FormSection title="Photographs" lead="Drag to reorder, the first image is the cover.">
        <ImageGalleryManager images={draft.images} onChange={(images) => set('images', images)} />
      </FormSection>

      <SaveBar
        dirty={dirty}
        justSaved={justSaved}
        onSave={handleSave}
        cancelHref="/admin/listings"
        extra={
          !isNew && (
            <ConfirmButton
              label="Delete listing"
              onConfirm={() => {
                deleteListing(draft.slug);
                router.push('/admin/listings');
              }}
            />
          )
        }
      />
    </div>
  );
}
