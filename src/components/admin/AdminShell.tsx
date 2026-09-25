'use client';

import { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { SaveStatus } from '@/components/admin/SaveStatus';

/** Sidebar + top bar shell, isolated from the public Header/Footer. See (admin)/admin/layout.tsx. */
export function AdminShell({
  children,
  adminEmail,
}: {
  children: React.ReactNode;
  adminEmail: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream lg:flex">
      <AdminSidebar mobileOpen={mobileOpen} onNavigate={() => setMobileOpen(false)} />

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close admin menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-ink/50 lg:hidden"
        />
      )}

      <div className="flex min-h-screen flex-1 flex-col lg:min-w-0">
        <AdminTopbar onMenu={() => setMobileOpen(true)} adminEmail={adminEmail} />
        <main id="main" className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>

      {/* One place for "saving" and for "that did not save", wherever the change came from. */}
      <SaveStatus />
    </div>
  );
}
