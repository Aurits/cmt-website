'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AgentForm } from '@/components/admin/AgentForm';
import { useAdmin } from '@/lib/admin/store';

export default function EditAgentPage() {
  const { id } = useParams<{ id: string }>();
  const { state, ready } = useAdmin();

  if (!ready) return <p className="text-body text-muted">Loading team member…</p>;

  const agent = state.agents.find((a) => a.id === id);
  if (!agent) {
    return (
      <div className="rounded-brand border border-rule bg-paper p-8 text-center">
        <p className="text-body text-ink">No team member found for &ldquo;{id}&rdquo;.</p>
        <Link
          href="/admin/agents"
          className="mt-3 inline-block text-body text-green underline decoration-gold decoration-2 underline-offset-4"
        >
          Back to the team
        </Link>
      </div>
    );
  }

  return <AgentForm initial={agent} isNew={false} key={agent.id} />;
}
