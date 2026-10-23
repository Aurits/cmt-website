'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { SaveStatus } from '@/components/admin/SaveStatus';

/*
 * Whether the desktop sidebar is folded to its icon rail, remembered in this browser.
 *
 * Read through useSyncExternalStore so the server renders it open (it cannot see localStorage)
 * and the browser switches to the saved choice without a hydration mismatch. Storage can be
 * blocked (private windows, strict settings), so every access is guarded and the toggle still
 * works for the session through local state.
 */
const COLLAPSE_KEY = 'cmt-admin-sidebar-collapsed';
const COLLAPSE_EVENT = 'cmt-admin-sidebar';

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(COLLAPSE_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(COLLAPSE_EVENT, onChange);
  };
}

function readCollapsed(): boolean {
  try {
    return window.localStorage.getItem(COLLAPSE_KEY) === '1';
  } catch {
    return false;
  }
}

/** Sidebar + top bar shell, isolated from the public Header/Footer. See (admin)/admin/layout.tsx. */
export function AdminShell({
  children,
  adminEmail,
}: {
  children: React.ReactNode;
  adminEmail: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // While the phone menu is open: Escape closes it, and the page behind does not scroll.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);
  const stored = useSyncExternalStore(subscribe, readCollapsed, () => false);
  const [override, setOverride] = useState<boolean | null>(null);
  const collapsed = override ?? stored;

  const toggleCollapsed = () => {
    const next = !collapsed;
    setOverride(next);
    try {
      window.localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0');
      window.dispatchEvent(new Event(COLLAPSE_EVENT));
    } catch {
      // Storage blocked: the choice holds for this visit only.
    }
  };

  return (
    // .admin-sharp squares the major cards and panels for the whole CMS (globals.css), as the
    // admin design does; buttons, search, tabs and tags stay rounded.
    <div className="admin-sharp min-h-screen bg-cream lg:flex">
      <AdminSidebar
        mobileOpen={mobileOpen}
        onNavigate={() => setMobileOpen(false)}
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
      />

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close admin menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-green/50 lg:hidden"
        />
      )}

      <div className="flex min-h-screen flex-1 flex-col lg:min-w-0">
        <AdminTopbar onMenu={() => setMobileOpen(true)} adminEmail={adminEmail} />
        <main id="main" className="flex-1 px-4 py-6 sm:px-6 lg:px-7 lg:py-7">
          {children}
        </main>
      </div>

      {/* One place for "saving" and for "that did not save", wherever the change came from. */}
      <SaveStatus />
    </div>
  );
}
