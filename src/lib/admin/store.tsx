'use client';

import { createContext, useCallback, useContext, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import * as server from '@/lib/admin/actions';
import type {
  AdminAgent,
  AdminBlogPost,
  AdminListing,
  AdminPartner,
  AdminSiteSettings,
  AdminState,
  AdminTestimonial,
  InquiryStatus,
} from '@/lib/admin/types';

/**
 * CMS state, backed by the database.
 *
 * It used to be localStorage seeded from src/data: edits survived a reload in one browser and
 * reached nothing else, which was an honest prototype and is no longer what this is. The state
 * now arrives from the server, already loaded by (protected)/layout.tsx, and every change goes
 * through a server action that writes Postgres and revalidates whatever public page it touched.
 *
 * The context keeps the same shape it always had, so no screen changed: the methods still look
 * synchronous and still return void. What happens underneath is optimistic — local state updates
 * at once so the interface does not stall on a round trip, the action runs, and a failure puts
 * the previous state back and reports why rather than leaving the screen showing an edit that
 * was never saved.
 *
 * `ready` is now always true. It existed because localStorage could not be read during server
 * rendering, and there was a frame where the CMS knew nothing. There is no such frame any more,
 * but the screens all check it, and a flag that is always true costs nothing next to touching
 * thirteen files to remove it.
 */

function nextId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

interface AdminContextValue {
  state: AdminState;
  ready: boolean;

  upsertListing: (listing: AdminListing) => void;
  deleteListing: (slug: string) => void;
  createListingDraft: () => AdminListing;

  upsertAgent: (agent: AdminAgent) => void;
  deleteAgent: (id: string) => void;
  createAgentDraft: () => AdminAgent;

  upsertPartner: (partner: AdminPartner) => void;
  deletePartner: (id: string) => void;
  reorderPartner: (id: string, direction: 'up' | 'down') => void;
  createPartnerDraft: (groupId: string) => AdminPartner;

  upsertPost: (post: AdminBlogPost) => void;
  deletePost: (slug: string) => void;
  createPostDraft: () => AdminBlogPost;

  upsertTestimonial: (testimonial: AdminTestimonial) => void;
  deleteTestimonial: (id: string) => void;
  createTestimonialDraft: () => AdminTestimonial;

  setInquiryStatus: (id: string, status: InquiryStatus) => void;

  updateSettings: (settings: AdminSiteSettings) => void;

  /** True while a save is in flight, for anything that wants to say so. */
  saving: boolean;
  /** Set when a save failed and the local state was rolled back. */
  error: string | null;
  dismissError: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({
  initialState,
  children,
}: {
  initialState: AdminState;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [state, setState] = useState<AdminState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [saving, startTransition] = useTransition();

  /**
   * Apply a change locally, then persist it.
   *
   * The optimistic update is what keeps the CMS feeling like a tool rather than a form: the row
   * moves the moment you click. The snapshot is what makes that honest — if the write fails, the
   * screen goes back to what the database actually holds instead of showing an edit that only
   * ever existed in this tab.
   *
   * router.refresh() on success pulls the authoritative state back down, which is how a
   * server-generated id (a uuid for a brand new testimonial) replaces the placeholder the browser
   * invented.
   */
  const mutate = useCallback(
    (apply: (previous: AdminState) => AdminState, persist: () => Promise<void>) => {
      let snapshot: AdminState | null = null;
      setState((previous) => {
        snapshot = previous;
        return apply(previous);
      });
      startTransition(async () => {
        try {
          await persist();
          router.refresh();
        } catch (cause) {
          if (snapshot) setState(snapshot);
          setError(cause instanceof Error ? cause.message : 'That change could not be saved.');
        }
      });
    },
    [router],
  );

  /* ── listings ────────────────────────────────────────────────────────────────────────── */

  const upsertListing = useCallback(
    (listing: AdminListing) => {
      mutate(
        (previous) => ({
          ...previous,
          listings: previous.listings.some((item) => item.slug === listing.slug)
            ? previous.listings.map((item) => (item.slug === listing.slug ? listing : item))
            : [listing, ...previous.listings],
        }),
        () => server.saveListing(listing),
      );
    },
    [mutate],
  );

  const deleteListing = useCallback(
    (slug: string) => {
      const category = state.listings.find((item) => item.slug === slug)?.category ?? '';
      mutate(
        (previous) => ({
          ...previous,
          listings: previous.listings.filter((item) => item.slug !== slug),
        }),
        () => server.removeListing(slug, category),
      );
    },
    [mutate, state.listings],
  );

  /* ── team ────────────────────────────────────────────────────────────────────────────── */

  const upsertAgent = useCallback(
    (agent: AdminAgent) => {
      mutate(
        (previous) => ({
          ...previous,
          agents: previous.agents.some((item) => item.id === agent.id)
            ? previous.agents.map((item) => (item.id === agent.id ? agent : item))
            : [...previous.agents, agent],
        }),
        () => server.saveAgent(agent),
      );
    },
    [mutate],
  );

  const deleteAgent = useCallback(
    (id: string) => {
      mutate(
        (previous) => ({ ...previous, agents: previous.agents.filter((item) => item.id !== id) }),
        () => server.removeAgent(id),
      );
    },
    [mutate],
  );

  /* ── clients ─────────────────────────────────────────────────────────────────────────── */

  const upsertPartner = useCallback(
    (partner: AdminPartner) => {
      mutate(
        (previous) => ({
          ...previous,
          partners: previous.partners.some((item) => item.id === partner.id)
            ? previous.partners.map((item) => (item.id === partner.id ? partner : item))
            : [...previous.partners, partner],
        }),
        () => server.savePartner(partner),
      );
    },
    [mutate],
  );

  const deletePartner = useCallback(
    (id: string) => {
      mutate(
        (previous) => ({
          ...previous,
          partners: previous.partners.filter((item) => item.id !== id),
        }),
        () => server.removePartner(id),
      );
    },
    [mutate],
  );

  const reorderPartner = useCallback(
    (id: string, direction: 'up' | 'down') => {
      const subject = state.partners.find((item) => item.id === id);
      if (!subject) return;
      const siblings = state.partners
        .filter((item) => item.groupId === subject.groupId)
        .sort((a, b) => a.order - b.order);
      const index = siblings.findIndex((item) => item.id === id);
      const target = index + (direction === 'up' ? -1 : 1);
      if (target < 0 || target >= siblings.length) return;

      // Swap the order values, then persist both rows. Two writes, because order lives on the
      // row and a swap is by definition two rows changing.
      const a = { ...siblings[index], order: siblings[target].order };
      const b = { ...siblings[target], order: siblings[index].order };

      mutate(
        (previous) => ({
          ...previous,
          partners: previous.partners.map((item) =>
            item.id === a.id ? a : item.id === b.id ? b : item,
          ),
        }),
        async () => {
          await server.savePartner(a);
          await server.savePartner(b);
        },
      );
    },
    [mutate, state.partners],
  );

  /* ── blog ────────────────────────────────────────────────────────────────────────────── */

  const upsertPost = useCallback(
    (post: AdminBlogPost) => {
      const withSlug: AdminBlogPost = {
        ...post,
        slug: post.slug || slugify(post.title) || nextId('post'),
        updatedAt: new Date().toISOString(),
      };
      mutate(
        (previous) => ({
          ...previous,
          posts: previous.posts.some((item) => item.slug === withSlug.slug)
            ? previous.posts.map((item) => (item.slug === withSlug.slug ? withSlug : item))
            : [withSlug, ...previous.posts],
        }),
        () => server.savePost(withSlug),
      );
    },
    [mutate],
  );

  const deletePost = useCallback(
    (slug: string) => {
      mutate(
        (previous) => ({ ...previous, posts: previous.posts.filter((item) => item.slug !== slug) }),
        () => server.removePost(slug),
      );
    },
    [mutate],
  );

  /* ── testimonials ────────────────────────────────────────────────────────────────────── */

  const upsertTestimonial = useCallback(
    (testimonial: AdminTestimonial) => {
      mutate(
        (previous) => ({
          ...previous,
          testimonials: previous.testimonials.some((item) => item.id === testimonial.id)
            ? previous.testimonials.map((item) =>
                item.id === testimonial.id ? testimonial : item,
              )
            : [...previous.testimonials, testimonial],
        }),
        () => server.saveTestimonial(testimonial),
      );
    },
    [mutate],
  );

  const deleteTestimonial = useCallback(
    (id: string) => {
      mutate(
        (previous) => ({
          ...previous,
          testimonials: previous.testimonials.filter((item) => item.id !== id),
        }),
        () => server.removeTestimonial(id),
      );
    },
    [mutate],
  );

  /* ── enquiries and settings ──────────────────────────────────────────────────────────── */

  const setInquiryStatus = useCallback(
    (id: string, status: InquiryStatus) => {
      mutate(
        (previous) => ({
          ...previous,
          inquiries: previous.inquiries.map((item) =>
            item.id === id ? { ...item, status } : item,
          ),
        }),
        () => server.setInquiryStatus(id, status),
      );
    },
    [mutate],
  );

  const updateSettings = useCallback(
    (settings: AdminSiteSettings) => {
      mutate(
        (previous) => ({ ...previous, settings }),
        () => server.saveSettings(settings),
      );
    },
    [mutate],
  );

  /* ── drafts, which are local until saved ─────────────────────────────────────────────── */

  const createListingDraft = useCallback(
    (): AdminListing => ({
      slug: '',
      reference: '',
      title: '',
      category: 'residential',
      listingType: 'sale',
      price: 0,
      city: 'Kampala',
      area: '',
      coords: [0.3146, 32.5806],
      size: '',
      sizeLabel: 'Built area',
      tenure: 'Leasehold',
      images: [],
      summary: '',
      description: [],
      features: [],
      agentId: '',
      status: 'draft',
      updatedAt: new Date().toISOString(),
    }),
    [],
  );

  const createAgentDraft = useCallback(
    (): AdminAgent => ({
      id: '',
      name: '',
      role: '',
      rank: 'agent',
      credentialsConfirmed: false,
      sourcedFrom: 'cmt',
      assignedListings: [],
    }),
    [],
  );

  const createPartnerDraft = useCallback(
    (groupId: string): AdminPartner => ({
      id: nextId('partner'),
      groupId,
      name: '',
      order:
        Math.max(
          0,
          ...state.partners.filter((item) => item.groupId === groupId).map((item) => item.order),
        ) + 1,
      verified: false,
    }),
    [state.partners],
  );

  const createTestimonialDraft = useCallback(
    (): AdminTestimonial => ({ id: nextId('testimonial'), quote: '', name: '', organisation: '' }),
    [],
  );

  const createPostDraft = useCallback(
    (): AdminBlogPost => ({
      slug: '',
      title: '',
      finding: '',
      excerpt: '',
      body: '',
      keyFigures: [],
      tags: [],
      publishedAt: new Date().toISOString().slice(0, 10),
      status: 'draft',
      updatedAt: new Date().toISOString(),
    }),
    [],
  );

  const value = useMemo<AdminContextValue>(
    () => ({
      state,
      ready: true,
      saving,
      error,
      dismissError: () => setError(null),
      upsertListing,
      deleteListing,
      createListingDraft,
      upsertAgent,
      deleteAgent,
      createAgentDraft,
      upsertPartner,
      deletePartner,
      reorderPartner,
      createPartnerDraft,
      upsertPost,
      deletePost,
      createPostDraft,
      upsertTestimonial,
      deleteTestimonial,
      createTestimonialDraft,
      setInquiryStatus,
      updateSettings,
    }),
    [
      state, saving, error,
      upsertListing, deleteListing, createListingDraft,
      upsertAgent, deleteAgent, createAgentDraft,
      upsertPartner, deletePartner, reorderPartner, createPartnerDraft,
      upsertPost, deletePost, createPostDraft,
      upsertTestimonial, deleteTestimonial, createTestimonialDraft,
      setInquiryStatus, updateSettings,
    ],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}

export { slugify };
