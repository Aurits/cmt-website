'use client';

import { BlogPostForm } from '@/components/admin/BlogPostForm';
import { useAdmin } from '@/lib/admin/store';

export default function NewBlogPostPage() {
  const { ready, createPostDraft } = useAdmin();
  if (!ready) return <p className="text-body text-muted">Loading…</p>;
  return <BlogPostForm initial={createPostDraft()} isNew />;
}
