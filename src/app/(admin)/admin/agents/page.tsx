'use client';

import Link from 'next/link';
import { ConfirmButton } from '@/components/admin/ConfirmButton';
import { PencilIcon, PlusIcon } from '@/components/admin/icons';
import { StatusPill } from '@/components/admin/StatusPill';
import { Button } from '@/components/ui/Button';
import { useAdmin } from '@/lib/admin/store';

export default function AdminAgentsPage() {
  const { state, ready, deleteAgent } = useAdmin();

  if (!ready) return <p className="text-body text-muted">Loading team…</p>;

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <p className="text-body text-muted">{state.agents.length} people</p>
        <Button href="/admin/agents/new" variant="primary" size="sm">
          <PlusIcon width={16} height={16} /> Add team member
        </Button>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {state.agents.map((agent) => (
          <li key={agent.id} className="flex flex-col rounded-brand border border-rule bg-paper p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-h4 text-green">{agent.name || 'Unnamed'}</p>
                <p className="text-body text-muted">{agent.role}</p>
              </div>
              <StatusPill tone={agent.rank === 'director' ? 'positive' : 'neutral'}>
                {agent.rank}
              </StatusPill>
            </div>

            {agent.bio && <p className="mt-3 line-clamp-3 text-micro leading-relaxed text-muted">{agent.bio}</p>}

            <dl className="mt-4 grid gap-1.5 border-t border-rule pt-3 text-micro text-muted">
              {agent.phone && (
                <div className="tnum flex justify-between">
                  <dt>Phone</dt>
                  <dd className="text-ink">{agent.phone}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt>Listings</dt>
                <dd className="tnum text-ink">{agent.assignedListings.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Credentials</dt>
                <dd className="text-ink">{agent.credentialsConfirmed ? 'Confirmed' : 'Pending'}</dd>
              </div>
            </dl>

            <div className="mt-4 flex gap-2 border-t border-rule pt-4">
              <Link
                href={`/admin/agents/${agent.id}`}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-control border border-rule-strong px-3 py-2 text-micro font-medium text-muted transition-colors hover:border-green/50 hover:text-green"
              >
                <PencilIcon width={14} height={14} /> Edit
              </Link>
              <ConfirmButton onConfirm={() => deleteAgent(agent.id)} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
