'use client';

import { AgentForm } from '@/components/admin/AgentForm';
import { useAdmin } from '@/lib/admin/store';

export default function NewAgentPage() {
  const { createAgentDraft } = useAdmin();
  return <AgentForm initial={createAgentDraft()} isNew />;
}
