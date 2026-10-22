'use client';

import { use } from 'react';
import Link from 'next/link';
import { BlogPostForm } from '@/components/admin/BlogPostForm';
import { useAdmin } from '@/lib/admin/store';

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { state, ready } = useAdmin();

  if (!ready) return <p className="text-body text-muted">Loading…</p>;

  const post = state.posts.find((i) => i.slug === id);
  if (!post) {
    return (
      <div className="border border-green/10 bg-white p-8 text-center">
        <p className="text-body text-muted">
          No post with that address.{' '}
          <Link href="/admin/blog" className="text-green underline decoration-gold decoration-2 underline-offset-4">
            Back to the blog
          </Link>
        </p>
      </div>
    );
  }

  return <BlogPostForm initial={post} isNew={false} key={post.slug} />;
}
