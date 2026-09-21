'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { DataTable, type DataTableColumn } from '@/components/admin/DataTable';
import { FilterTabs } from '@/components/admin/FilterTabs';
import { NotesIcon, PlusIcon } from '@/components/admin/icons';
import { StatusPill, type PillTone } from '@/components/admin/StatusPill';
import { agentById } from '@/data/agents';
import { useAdmin } from '@/lib/admin/store';
import type { AdminBlogPost, PostStatus } from '@/lib/admin/types';

const statusMeta: Record<PostStatus, { label: string; tone: PillTone }> = {
  published: { label: 'Published', tone: 'positive' },
  draft: { label: 'Draft', tone: 'neutral' },
  archived: { label: 'Archived', tone: 'muted' },
};

/**
 * The blog.
 *
 * The columns are the index row from docs/LAYOUT-SPECS.md A-07, date, title, finding, figure —
 * so what an editor sorts here is what a reader scans on the public page. The figure column
 * earns its place by being the thing most often missing: a post without one is just an opinion.
 */
export default function AdminBlogPostsPage() {
  const { state, ready } = useAdmin();
  const [status, setStatus] = useState<'all' | PostStatus>('all');

  const filtered = useMemo(
    () => state.posts.filter((note) => status === 'all' || note.status === status),
    [state.posts, status],
  );

  const columns: DataTableColumn<AdminBlogPost>[] = [
    {
      key: 'date',
      header: 'Date',
      sortValue: (row) => row.publishedAt,
      render: (row) => <span className="tnum text-micro text-muted">{row.publishedAt.slice(0, 10)}</span>,
    },
    {
      key: 'title',
      header: 'Post',
      sortValue: (row) => row.title,
      render: (row) => (
        <Link href={`/admin/blog/${row.slug}`} className="block max-w-[46ch]">
          <span className="block font-medium text-ink hover:text-green">
            {row.title || 'Untitled post'}
          </span>
          <span className="mt-0.5 block text-micro leading-snug text-muted">
            {row.finding || 'No finding written yet'}
          </span>
        </Link>
      ),
    },
    {
      key: 'figure',
      header: 'Figure',
      align: 'right',
      sortValue: (row) => row.pullFigure ?? '',
      render: (row) =>
        row.pullFigure ? (
          <span className="tnum font-display text-h4 text-green">{row.pullFigure}</span>
        ) : (
          <span className="text-micro text-muted">none</span>
        ),
    },
    {
      key: 'author',
      header: 'Author',
      render: (row) => (
        <span className="text-body text-ink">
          {row.authorId ? agentById[row.authorId]?.name ?? row.authorId : 'Unattributed'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'right',
      sortValue: (row) => row.status,
      render: (row) => (
        <StatusPill tone={statusMeta[row.status].tone}>{statusMeta[row.status].label}</StatusPill>
      ),
    },
  ];

  if (!ready) return <p className="text-body text-muted">Loading posts…</p>;

  const published = state.posts.filter((note) => note.status === 'published').length;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-[62ch] text-body text-muted">
          {published === 0
            ? 'Nothing published yet, so the blog stays out of the site navigation. Publishing the first post puts it there.'
            : `${published} post${published === 1 ? '' : 's'} live on the site.`}
        </p>
        <Link
          href="/admin/blog/new"
          className="flex shrink-0 items-center gap-1.5 rounded-control border border-green/35 px-3.5 py-2 text-micro font-medium text-green transition-colors hover:border-green hover:bg-green/8"
        >
          <PlusIcon width={14} height={14} /> Write a post
        </Link>
      </div>

      <FilterTabs
        value={status}
        onChange={(value) => setStatus(value as 'all' | PostStatus)}
        tabs={[
          { value: 'all', label: 'All', count: state.posts.length },
          { value: 'published', label: 'Published', count: published },
          {
            value: 'draft',
            label: 'Drafts',
            count: state.posts.filter((n) => n.status === 'draft').length,
          },
          {
            value: 'archived',
            label: 'Archived',
            count: state.posts.filter((n) => n.status === 'archived').length,
          },
        ]}
      />

      {state.posts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-brand border border-dashed border-rule-strong bg-paper px-6 py-14 text-center">
          <NotesIcon width={28} height={28} className="text-gold-deep" />
          <p className="max-w-[54ch] text-body text-muted">
            Nothing published yet. A few posts a year is enough: what rents did, what banks are
            lending against, which corridors absorbed stock. Write from instructions you actually
            took, and give each one a number worth quoting.
          </p>
          <Link
            href="/admin/blog/new"
            className="mt-1 text-micro font-medium text-green underline decoration-gold decoration-2 underline-offset-4"
          >
            Write the first one
          </Link>
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={filtered}
          getRowKey={(row) => row.slug}
          emptyMessage="No posts match that filter."
        />
      )}
    </div>
  );
}
