'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSelectField } from '@/components/admin/AdminSelectField';
import { ConfirmButton } from '@/components/admin/ConfirmButton';
import { FormSection } from '@/components/admin/FormSection';
import { SaveBar } from '@/components/admin/SaveBar';
import { ArrowDownIcon, ArrowUpIcon, PlusIcon, TrashIcon } from '@/components/admin/icons';
import { inputClass } from '@/components/forms/fields';
import { agents } from '@/data/agents';
import { useAdmin } from '@/lib/admin/store';
import type { AdminBlogPost, PostStatus } from '@/lib/admin/types';
import { cx } from '@/lib/cx';

/**
 * Writing a blog post.
 *
 * The form is ordered the way the note is read rather than the way the record is stored: the
 * finding first, because that single line is what appears in the index and is the only thing most
 * people will ever see; then the figure, because a post without one is just an opinion; then the body.
 *
 * The word count beside the excerpt is not decoration. A-07 gives that block roughly forty words
 * and the layout stops working past sixty, so the form says so while there is still time to fix
 * it rather than leaving the editor to discover it on the live page.
 */
const statusOptions: { value: PostStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-micro font-medium text-ink">{label}</span>
      {children}
      {hint && <span className="text-micro text-muted">{hint}</span>}
    </label>
  );
}

export function BlogPostForm({ initial, isNew }: { initial: AdminBlogPost; isNew: boolean }) {
  const router = useRouter();
  const { upsertPost, deletePost } = useAdmin();
  const [draft, setDraft] = useState<AdminBlogPost>(initial);
  const [justSaved, setJustSaved] = useState(false);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(initial), [draft, initial]);
  const set = <K extends keyof AdminBlogPost>(key: K, value: AdminBlogPost[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setJustSaved(false);
  };

  const excerptWords = draft.excerpt.trim() ? draft.excerpt.trim().split(/\s+/).length : 0;
  const excerptOver = excerptWords > 60;

  const save = () => {
    upsertPost(draft);
    setJustSaved(true);
    if (isNew) router.push('/admin/blog');
  };

  const setFigure = (index: number, patch: Partial<{ label: string; value: string }>) => {
    set(
      'keyFigures',
      draft.keyFigures.map((figure, i) => (i === index ? { ...figure, ...patch } : figure)),
    );
  };

  const moveFigure = (index: number, direction: -1 | 1) => {
    const next = [...draft.keyFigures];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    set('keyFigures', next);
  };

  return (
    <div className="grid gap-6">
      <FormSection
        title="The finding"
        lead="What this note says, in the order a reader meets it."
      >
        <Field label="Title">
          <input
            value={draft.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Kampala office rents, second half of 2026"
            className={inputClass}
          />
        </Field>

        <Field
          label="The one-line finding"
          hint="Shown against the title in the index. Say what was found, not what the note is about."
        >
          <input
            value={draft.finding}
            onChange={(e) => set('finding', e.target.value)}
            placeholder="Prime rents held, but incentives lengthened by two months."
            className={inputClass}
          />
        </Field>

        <Field
          label="Opening summary"
          hint={
            excerptOver
              ? `${excerptWords} words. The latest-note block is built for about forty and starts to break past sixty.`
              : `${excerptWords} words. Aim for about forty.`
          }
        >
          <textarea
            value={draft.excerpt}
            onChange={(e) => set('excerpt', e.target.value)}
            rows={3}
            className={cx(inputClass, 'resize-y', excerptOver && 'border-gold-deep')}
          />
        </Field>
      </FormSection>

      <FormSection
        title="The figure"
        lead="One number, pulled out large. It is what gets quoted, screenshotted and cited, and it is most of the reason to publish a note at all."
      >
        <div className="grid gap-5 sm:grid-cols-[10rem_1fr]">
          <Field label="Figure">
            <input
              value={draft.pullFigure ?? ''}
              onChange={(e) => set('pullFigure', e.target.value || undefined)}
              placeholder="12.5%"
              className={cx(inputClass, 'tnum')}
            />
          </Field>
          <Field label="What it measures">
            <input
              value={draft.pullCaption ?? ''}
              onChange={(e) => set('pullCaption', e.target.value || undefined)}
              placeholder="Prime office yield, Kampala central"
              className={inputClass}
            />
          </Field>
        </div>

        {draft.pullFigure && (
          <div className="border-l-[3px] border-gold bg-mist/50 px-4 py-3">
            <p className="text-micro text-muted">How it will read</p>
            <p className="tnum mt-1 font-display text-figure leading-none text-green">
              {draft.pullFigure}
            </p>
            {draft.pullCaption && (
              <p className="mt-1.5 text-micro text-muted">{draft.pullCaption}</p>
            )}
          </div>
        )}
      </FormSection>

      <FormSection
        title="Key figures"
        lead="The schedule that runs down the side of the post. Two to five rows reads best; more and the rail outgrows the body beside it."
      >
        {draft.keyFigures.length === 0 ? (
          <p className="text-micro text-muted">
            None yet. A post works without them, but they are what makes it citable.
          </p>
        ) : (
          <ul className="grid gap-2">
            {draft.keyFigures.map((figure, index) => (
              <li key={index} className="grid gap-2 sm:grid-cols-[1fr_9rem_auto]">
                <input
                  value={figure.label}
                  onChange={(e) => setFigure(index, { label: e.target.value })}
                  placeholder="Prime rent, per sqm"
                  className={cx(inputClass, '!py-2')}
                />
                <input
                  value={figure.value}
                  onChange={(e) => setFigure(index, { value: e.target.value })}
                  placeholder="USD 16"
                  className={cx(inputClass, 'tnum !py-2')}
                />
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveFigure(index, -1)}
                    disabled={index === 0}
                    aria-label={`Move ${figure.label || 'row'} up`}
                    className="flex h-9 w-9 items-center justify-center rounded-control border border-rule text-muted transition-colors hover:border-green/50 hover:text-green disabled:opacity-40"
                  >
                    <ArrowUpIcon width={14} height={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveFigure(index, 1)}
                    disabled={index === draft.keyFigures.length - 1}
                    aria-label={`Move ${figure.label || 'row'} down`}
                    className="flex h-9 w-9 items-center justify-center rounded-control border border-rule text-muted transition-colors hover:border-green/50 hover:text-green disabled:opacity-40"
                  >
                    <ArrowDownIcon width={14} height={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      set('keyFigures', draft.keyFigures.filter((_, i) => i !== index))
                    }
                    aria-label={`Remove ${figure.label || 'row'}`}
                    className="flex h-9 w-9 items-center justify-center rounded-control border border-rule text-muted transition-colors hover:border-flag/60 hover:text-flag"
                  >
                    <TrashIcon width={14} height={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={() => set('keyFigures', [...draft.keyFigures, { label: '', value: '' }])}
          className="flex w-fit items-center gap-1.5 rounded-control border border-green/35 px-3.5 py-2 text-micro font-medium text-green transition-colors hover:border-green hover:bg-green/8"
        >
          <PlusIcon width={14} height={14} /> Add a figure
        </button>
      </FormSection>

      <FormSection
        title="The post"
        lead="Markdown. A blank line starts a new paragraph. Keep it to what you actually saw on inspections; this is evidence, not commentary."
      >
        <textarea
          value={draft.body}
          onChange={(e) => set('body', e.target.value)}
          rows={16}
          placeholder={'What we are seeing\n\nAcross the instructions we took in the second half of the year…'}
          className={cx(inputClass, 'resize-y font-mono text-micro leading-relaxed')}
        />
      </FormSection>

      <FormSection title="Publishing" lead="Who wrote it, when it is dated, and whether it is live.">
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminSelectField
            id="post-author"
            label="Author"
            value={draft.authorId ?? ''}
            onChange={(value) => set('authorId', value || undefined)}
            options={[
              { value: '', label: 'Unattributed' },
              ...agents.map((agent) => ({ value: agent.id, label: agent.name })),
            ]}
          />
          <AdminSelectField
            id="post-status"
            label="Status"
            value={draft.status}
            onChange={(value) => set('status', value as PostStatus)}
            options={statusOptions}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Date">
            <input
              type="date"
              value={draft.publishedAt.slice(0, 10)}
              onChange={(e) => set('publishedAt', e.target.value)}
              className={cx(inputClass, 'tnum')}
            />
          </Field>
          <Field label="Tags" hint="Comma separated. Used for nothing yet; useful later.">
            <input
              value={draft.tags.join(', ')}
              onChange={(e) =>
                set(
                  'tags',
                  e.target.value
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                )
              }
              placeholder="office, kampala"
              className={inputClass}
            />
          </Field>
        </div>

        <Field
          label="Web address"
          hint={
            draft.slug
              ? `cmtrealtors.com/blog/${draft.slug}`
              : 'Left blank, this is made from the title when you save.'
          }
        >
          <input
            value={draft.slug}
            onChange={(e) => set('slug', e.target.value)}
            placeholder="kampala-office-rents-h2-2026"
            className={inputClass}
          />
        </Field>
      </FormSection>

      <SaveBar
        dirty={dirty}
        justSaved={justSaved}
        onSave={save}
        cancelHref="/admin/blog"
        extra={
          !isNew && (
            <ConfirmButton
              onConfirm={() => {
                deletePost(draft.slug);
                router.push('/admin/blog');
              }}
              label="Delete"
            />
          )
        }
      />
    </div>
  );
}
