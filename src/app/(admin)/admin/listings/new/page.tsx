'use client';

import { ListingForm } from '@/components/admin/ListingForm';
import { useAdmin } from '@/lib/admin/store';

export default function NewListingPage() {
  const { createListingDraft } = useAdmin();
  return <ListingForm initial={createListingDraft()} isNew />;
}
