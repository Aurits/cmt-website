'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { seedAdminState } from '@/lib/admin/seed';
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

const STORAGE_KEY = 'cmt-admin-state-v1';

/**
 * Frontend-only persistence for the CMS prototype.
 *
 * There is no backend this phase — see AGENTS.md / README.md — so "saving" means writing to
 * localStorage. State is seeded once from src/data/*.ts (the real static content the public
 * site renders) and every edit made in the admin session is written back here, so a reload
 * of any /admin page keeps what you changed. It never touches the public site's own render,
 * which still reads straight from src/data — this is a management surface over a copy, not a
 * live database.
 */
function loadState(): AdminState {
  if (typeof window === 'undefined') return seedAdminState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedAdminState();
    const parsed = JSON.parse(raw) as AdminState;
    // Guard against a shape left over from an earlier version of the store.
    if (!parsed.listings || !parsed.settings) return seedAdminState();
    return parsed;
  } catch {
    return seedAdminState();
  }
}

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

  resetToSeed: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AdminState>(() => seedAdminState());
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage on mount only — seeding server-side would risk a hydration
  // mismatch, since localStorage does not exist there. This is a deliberate one-time read
  // from an external store on mount, which is the case the lint rule's own guidance carves
  // out ("subscribe for updates from some external system"); there is no reactive
  // alternative for a value that only exists in the browser.
  useEffect(() => {
    // One-time read of an external store (localStorage) that cannot exist during SSR.
    setState(loadState()); // eslint-disable-line react-hooks/set-state-in-effect
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, ready]);

  const upsertListing = useCallback((listing: AdminListing) => {
    setState((prev) => {
      const exists = prev.listings.some((l) => l.slug === listing.slug);
      return {
        ...prev,
        listings: exists
          ? prev.listings.map((l) => (l.slug === listing.slug ? listing : l))
          : [listing, ...prev.listings],
      };
    });
  }, []);

  const deleteListing = useCallback((slug: string) => {
    setState((prev) => ({ ...prev, listings: prev.listings.filter((l) => l.slug !== slug) }));
  }, []);

  const createListingDraft = useCallback((): AdminListing => {
    return {
      slug: '',
      reference: `CMT-NEW-${Math.floor(1000 + Math.random() * 9000)}`,
      title: '',
      category: 'residential',
      listingType: 'sale',
      price: 0,
      city: '',
      area: '',
      coords: [0.3476, 32.5825],
      size: '',
      sizeLabel: 'Built area',
      tenure: 'Leasehold',
      images: [],
      summary: '',
      description: [],
      features: [],
      agentId: '',
      status: 'draft',
      updatedAt: new Date().toISOString().slice(0, 10),
    };
  }, []);

  const upsertAgent = useCallback((agent: AdminAgent) => {
    setState((prev) => {
      const exists = prev.agents.some((a) => a.id === agent.id);
      return {
        ...prev,
        agents: exists
          ? prev.agents.map((a) => (a.id === agent.id ? agent : a))
          : [...prev.agents, agent],
      };
    });
  }, []);

  const deleteAgent = useCallback((id: string) => {
    setState((prev) => ({ ...prev, agents: prev.agents.filter((a) => a.id !== id) }));
  }, []);

  const createAgentDraft = useCallback((): AdminAgent => {
    return {
      id: '',
      name: '',
      role: 'Property Agent',
      rank: 'agent',
      credentialsConfirmed: false,
      sourcedFrom: 'cmt',
      assignedListings: [],
    };
  }, []);

  const upsertPartner = useCallback((partner: AdminPartner) => {
    setState((prev) => {
      const exists = prev.partners.some((p) => p.id === partner.id);
      return {
        ...prev,
        partners: exists
          ? prev.partners.map((p) => (p.id === partner.id ? partner : p))
          : [...prev.partners, partner],
      };
    });
  }, []);

  const deletePartner = useCallback((id: string) => {
    setState((prev) => ({ ...prev, partners: prev.partners.filter((p) => p.id !== id) }));
  }, []);

  const reorderPartner = useCallback((id: string, direction: 'up' | 'down') => {
    setState((prev) => {
      const group = prev.partners.filter((p) => p.groupId === prev.partners.find((x) => x.id === id)?.groupId);
      const sorted = [...group].sort((a, b) => a.order - b.order);
      const index = sorted.findIndex((p) => p.id === id);
      const swapWith = direction === 'up' ? index - 1 : index + 1;
      if (swapWith < 0 || swapWith >= sorted.length) return prev;
      const a = sorted[index];
      const b = sorted[swapWith];
      const newOrders = new Map([[a.id, b.order], [b.id, a.order]]);
      return {
        ...prev,
        partners: prev.partners.map((p) => (newOrders.has(p.id) ? { ...p, order: newOrders.get(p.id)! } : p)),
      };
    });
  }, []);

  const createPartnerDraft = useCallback(
    (groupId: string): AdminPartner => {
      const maxOrder = state.partners
        .filter((p) => p.groupId === groupId)
        .reduce((max, p) => Math.max(max, p.order), -1);
      return {
        id: nextId('partner'),
        groupId,
        name: '',
        order: maxOrder + 1,
        verified: false,
      };
    },
    [state.partners],
  );

  /*
   * Keyed by slug, like listings, because /admin/blog/[id] resolves by slug and a post's
   * slug is the public URL it will live at. A blank slug is derived from the title on save, so
   * an editor never has to think about it.
   */
  const upsertPost = useCallback((post: AdminBlogPost) => {
    const withSlug: AdminBlogPost = {
      ...post,
      slug: post.slug || slugify(post.title) || nextId('note'),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => {
      const exists = prev.posts.some((i) => i.slug === withSlug.slug);
      return {
        ...prev,
        posts: exists
          ? prev.posts.map((i) => (i.slug === withSlug.slug ? withSlug : i))
          : [withSlug, ...prev.posts],
      };
    });
  }, []);

  const deletePost = useCallback((slug: string) => {
    setState((prev) => ({ ...prev, posts: prev.posts.filter((i) => i.slug !== slug) }));
  }, []);

  const createPostDraft = useCallback((): AdminBlogPost => {
    return {
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
    };
  }, []);

  const upsertTestimonial = useCallback((testimonial: AdminTestimonial) => {
    setState((prev) => {
      const exists = prev.testimonials.some((t) => t.id === testimonial.id);
      return {
        ...prev,
        testimonials: exists
          ? prev.testimonials.map((t) => (t.id === testimonial.id ? testimonial : t))
          : [...prev.testimonials, testimonial],
      };
    });
  }, []);

  const deleteTestimonial = useCallback((id: string) => {
    setState((prev) => ({ ...prev, testimonials: prev.testimonials.filter((t) => t.id !== id) }));
  }, []);

  const createTestimonialDraft = useCallback((): AdminTestimonial => {
    return { id: nextId('testimonial'), quote: '', name: '', organisation: '' };
  }, []);

  const setInquiryStatus = useCallback((id: string, status: InquiryStatus) => {
    setState((prev) => ({
      ...prev,
      inquiries: prev.inquiries.map((inquiry) => (inquiry.id === id ? { ...inquiry, status } : inquiry)),
    }));
  }, []);

  const updateSettings = useCallback((settings: AdminSiteSettings) => {
    setState((prev) => ({ ...prev, settings }));
  }, []);

  const resetToSeed = useCallback(() => {
    setState(seedAdminState());
  }, []);

  const value = useMemo<AdminContextValue>(
    () => ({
      state,
      ready,
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
      resetToSeed,
    }),
    [
      state,
      ready,
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
      resetToSeed,
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
