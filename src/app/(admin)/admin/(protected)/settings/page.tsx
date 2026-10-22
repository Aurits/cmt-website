'use client';

import { useState } from 'react';
import { FormSection } from '@/components/admin/FormSection';
import { SaveBar } from '@/components/admin/SaveBar';
import { Label, TextArea, TextField, inputClass } from '@/components/forms/fields';
import { useAdmin } from '@/lib/admin/store';
import type { AdminAgent, AdminSiteSettings } from '@/lib/admin/types';
import { clientCount } from '@/data/clients';
import { offices } from '@/data/site';
import { cx } from '@/lib/cx';

export default function AdminSettingsPage() {
  const { state, ready, updateSettings } = useAdmin();

  if (!ready) return <p className="text-body text-muted">Loading settings…</p>;

  return <SettingsForm initial={state.settings} agents={state.agents} onSave={updateSettings} />;
}

function SettingsForm({
  initial,
  agents,
  onSave,
}: {
  initial: AdminSiteSettings;
  agents: AdminAgent[];
  onSave: (settings: AdminSiteSettings) => void;
}) {
  const [draft, setDraft] = useState<AdminSiteSettings>(initial);
  const [dirty, setDirty] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const set = <K extends keyof AdminSiteSettings>(key: K, value: AdminSiteSettings[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    setJustSaved(false);
  };

  const setHour = (index: number, patch: Partial<AdminSiteSettings['hours'][number]>) => {
    set(
      'hours',
      draft.hours.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  };

  return (
    <div className="grid gap-6">
      <FormSection title="Identity">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="name"
            label="Full legal name"
            value={draft.name}
            onChange={(e) => set('name', e.target.value)}
          />
          <TextField
            id="shortName"
            label="Short name"
            value={draft.shortName}
            onChange={(e) => set('shortName', e.target.value)}
          />
        </div>
        <TextField
          id="tagline"
          label="Tagline"
          value={draft.tagline}
          onChange={(e) => set('tagline', e.target.value)}
        />
        <TextArea
          id="description"
          label="Meta description"
          value={draft.description}
          onChange={(e) => set('description', e.target.value)}
          rows={3}
        />
      </FormSection>

      <FormSection
        title="Contact"
        lead="WhatsApp needs the office mobile in international digits, e.g. 256700123456."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="phoneDisplay"
            label="Phone (displayed)"
            value={draft.phone.display}
            onChange={(e) => set('phone', { ...draft.phone, display: e.target.value })}
            placeholder="+256 414 346 344"
          />
          <TextField
            id="phoneHref"
            label="Phone (dial link)"
            value={draft.phone.href}
            onChange={(e) => set('phone', { ...draft.phone, href: e.target.value })}
            placeholder="tel:+256414346344"
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="email"
            label="Email"
            type="email"
            value={draft.email}
            onChange={(e) => set('email', e.target.value)}
          />
          <div>
            <Label htmlFor="whatsapp" optional>
              WhatsApp number (international digits)
            </Label>
            <input
              id="whatsapp"
              value={draft.whatsapp ?? ''}
              onChange={(e) => set('whatsapp', e.target.value || null)}
              className={cx(inputClass, 'tnum')}
              placeholder="256700123456"
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Kampala office (head office)">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="building"
            label="Building"
            value={draft.address.building}
            onChange={(e) => set('address', { ...draft.address, building: e.target.value })}
          />
          <TextField
            id="line1"
            label="Suite / floor"
            value={draft.address.line1}
            onChange={(e) => set('address', { ...draft.address, line1: e.target.value })}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <TextField
            id="street"
            label="Street"
            value={draft.address.street}
            onChange={(e) => set('address', { ...draft.address, street: e.target.value })}
          />
          <TextField
            id="city"
            label="City"
            value={draft.address.city}
            onChange={(e) => set('address', { ...draft.address, city: e.target.value })}
          />
          <TextField
            id="country"
            label="Country"
            value={draft.address.country}
            onChange={(e) => set('address', { ...draft.address, country: e.target.value })}
          />
        </div>
      </FormSection>

      <FormSection
        title="Nairobi office"
        lead="Kept on file for the Kenya practice. Not shown on the site until the Uganda and Kenya relationship is confirmed."
      >
        <TextArea
          id="nairobiAddress"
          label="Address"
          optional
          value={draft.nairobiAddress}
          onChange={(e) => set('nairobiAddress', e.target.value)}
          rows={2}
          placeholder="Not yet confirmed"
        />
      </FormSection>

      <FormSection title="Office hours">
        <div className="grid gap-3">
          {draft.hours.map((row, index) => (
            <div key={index} className="grid gap-3 sm:grid-cols-2">
              <TextField
                id={`hours-days-${index}`}
                label={`Row ${index + 1}, days`}
                value={row.days}
                onChange={(e) => setHour(index, { days: e.target.value })}
              />
              <TextField
                id={`hours-time-${index}`}
                label={`Row ${index + 1}, time`}
                value={row.time}
                onChange={(e) => setHour(index, { time: e.target.value })}
              />
            </div>
          ))}
        </div>
        <label className="flex items-center gap-2.5 text-body text-green">
          <input
            type="checkbox"
            checked={draft.hoursConfirmed}
            onChange={(e) => set('hoursConfirmed', e.target.checked)}
            className="h-4 w-4 rounded-[3px] border-rule-strong text-green accent-green"
          />
          Hours confirmed by CMT (removes the &ldquo;placeholder&rdquo; note on Contact)
        </label>
      </FormSection>

      {/*
        The figures on the site. Three of the four are counted from the data (offices from the
        office list, institutions from the client list, registered valuers from the team), so
        they cannot drift from the truth and are shown here read-only. Only the years figure is
        typed. The "Homepage stats" fields that used to sit here edited values the site no longer
        read, which made every change look saved and do nothing.
      */}
      <FormSection
        title="Figures on the site"
        lead="Shown under the homepage headline, on /about and in the About menu. Only the years are typed; the rest are counted."
      >
        <TextField
          id="yearsInBusiness"
          label="Years in business"
          value={draft.yearsInBusiness}
          onChange={(e) => set('yearsInBusiness', e.target.value)}
          placeholder="16+"
        />
        <dl className="grid gap-px border border-hair bg-hair sm:grid-cols-3">
          {[
            [String(offices.length), 'offices', 'From the office list in src/data/site.ts'],
            [String(clientCount), 'institutions', 'From the client list in src/data/clients.ts'],
            [
              String(agents.filter((agent) => agent.signsReports && agent.listed !== false).length),
              'registered valuers',
              'Team members marked "Registered valuer who signs reports"',
            ],
          ].map(([value, unit, source]) => (
            <div key={unit} className="bg-cream/60 p-4">
              <dt className="sr-only">{unit}</dt>
              <dd>
                <span className="tnum font-display text-[26px] leading-none font-semibold text-green">
                  {value}
                </span>{' '}
                <span className="text-small text-green">{unit}</span>
                <span className="mt-1 block text-[12px] text-muted">{source}</span>
              </dd>
            </div>
          ))}
        </dl>
      </FormSection>

      <SaveBar
        dirty={dirty}
        justSaved={justSaved}
        onSave={() => {
          onSave(draft);
          setDirty(false);
          setJustSaved(true);
        }}
        cancelHref="/admin"
      />
    </div>
  );
}
