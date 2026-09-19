'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AdminSelectField } from '@/components/admin/AdminSelectField';
import { ConfirmButton } from '@/components/admin/ConfirmButton';
import { FormSection } from '@/components/admin/FormSection';
import { SaveBar } from '@/components/admin/SaveBar';
import { Label, TextArea, TextField, inputClass } from '@/components/forms/fields';
import { useAdmin, slugify } from '@/lib/admin/store';
import type { AdminAgent } from '@/lib/admin/types';
import { cx } from '@/lib/cx';

const rankOptions = [
  { value: 'director', label: 'Director' },
  { value: 'valuer', label: 'Valuer' },
  { value: 'agent', label: 'Property agent' },
];
const sourceOptions = [
  { value: 'cmt', label: 'Published by CMT' },
  { value: 'directory', label: 'Third-party directory (unconfirmed)' },
];

export function AgentForm({ initial, isNew }: { initial: AdminAgent; isNew: boolean }) {
  const router = useRouter();
  const { state, upsertAgent, deleteAgent } = useAdmin();
  const [draft, setDraft] = useState<AdminAgent>(initial);
  const [dirty, setDirty] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [idTouched, setIdTouched] = useState(!isNew);

  const set = <K extends keyof AdminAgent>(key: K, value: AdminAgent[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    setJustSaved(false);
  };

  const handleNameChange = (name: string) => {
    setDraft((prev) => ({ ...prev, name, id: idTouched ? prev.id : slugify(name) }));
    setDirty(true);
    setJustSaved(false);
  };

  const toggleListing = (slug: string) => {
    const has = draft.assignedListings.includes(slug);
    set(
      'assignedListings',
      has ? draft.assignedListings.filter((s) => s !== slug) : [...draft.assignedListings, slug],
    );
  };

  const handleSave = () => {
    const finalId = draft.id || slugify(draft.name) || `agent-${Date.now()}`;
    const toSave: AdminAgent = { ...draft, id: finalId };
    upsertAgent(toSave);
    setDraft(toSave);
    setDirty(false);
    setJustSaved(true);
    setIdTouched(true);
    if (isNew) router.replace(`/admin/agents/${finalId}`);
  };

  return (
    <div className="grid gap-6">
      <FormSection title="Profile">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField id="name" label="Full name" value={draft.name} onChange={(e) => handleNameChange(e.target.value)} />
          <TextField id="role" label="Job title" value={draft.role} onChange={(e) => set('role', e.target.value)} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminSelectField
            id="rank"
            label="Rank"
            value={draft.rank}
            onChange={(v) => set('rank', v as AdminAgent['rank'])}
            options={rankOptions}
          />
          <TextField
            id="based"
            label="Based in"
            optional
            value={draft.based ?? ''}
            onChange={(e) => set('based', e.target.value || undefined)}
            placeholder="Kampala"
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="phone"
            label="Phone"
            type="tel"
            optional
            value={draft.phone ?? ''}
            onChange={(e) => set('phone', e.target.value || undefined)}
          />
          <TextField
            id="email"
            label="Email"
            type="email"
            optional
            value={draft.email ?? ''}
            onChange={(e) => set('email', e.target.value || undefined)}
          />
        </div>
        <TextArea
          id="bio"
          label="Bio"
          optional
          rows={4}
          value={draft.bio ?? ''}
          onChange={(e) => set('bio', e.target.value || undefined)}
        />
      </FormSection>

      <FormSection title="Credentials" lead="Names and roles render regardless. Confirm before publishing a professional credential.">
        <div>
          <Label htmlFor="qualifications" optional>
            Qualifications (one per line)
          </Label>
          <textarea
            id="qualifications"
            rows={3}
            value={(draft.qualifications ?? []).join('\n')}
            onChange={(e) => set('qualifications', e.target.value.split('\n').filter(Boolean))}
            className={cx(inputClass, 'resize-y')}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminSelectField
            id="sourcedFrom"
            label="Source of these facts"
            value={draft.sourcedFrom}
            onChange={(v) => set('sourcedFrom', v as AdminAgent['sourcedFrom'])}
            options={sourceOptions}
          />
          <label className="flex items-center gap-2.5 self-end pb-3 text-body text-ink">
            <input
              type="checkbox"
              checked={draft.credentialsConfirmed}
              onChange={(e) => set('credentialsConfirmed', e.target.checked)}
              className="h-4 w-4 rounded-[3px] border-rule-strong text-green accent-green"
            />
            Credentials confirmed by this person
          </label>
        </div>
      </FormSection>

      <FormSection title="Assigned listings" lead="Which instructions this person handles.">
        {state.listings.length === 0 ? (
          <p className="text-body text-muted">No listings yet.</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {state.listings.map((listing) => (
              <li key={listing.slug}>
                <label className="flex items-center gap-2.5 text-body text-ink">
                  <input
                    type="checkbox"
                    checked={draft.assignedListings.includes(listing.slug)}
                    onChange={() => toggleListing(listing.slug)}
                    className="h-4 w-4 rounded-[3px] border-rule-strong text-green accent-green"
                  />
                  {listing.title || listing.reference}
                </label>
              </li>
            ))}
          </ul>
        )}
      </FormSection>

      <SaveBar
        dirty={dirty}
        justSaved={justSaved}
        onSave={handleSave}
        cancelHref="/admin/agents"
        extra={
          !isNew && (
            <ConfirmButton
              label="Delete"
              onConfirm={() => {
                deleteAgent(draft.id);
                router.push('/admin/agents');
              }}
            />
          )
        }
      />
    </div>
  );
}
