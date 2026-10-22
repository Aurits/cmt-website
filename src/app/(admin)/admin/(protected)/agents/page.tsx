'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ConfirmButton } from '@/components/admin/ConfirmButton';
import { PencilIcon, PlusIcon } from '@/components/admin/icons';
import { PageToolbar, softButtonClass } from '@/components/admin/PageToolbar';
import { StatusPill } from '@/components/admin/StatusPill';
import { Button } from '@/components/ui/Button';
import { useAdmin } from '@/lib/admin/store';

const rankLabel = { director: 'Director', valuer: 'Valuer', agent: 'Agent' } as const;
const rankOrder = { director: 0, valuer: 1, agent: 2 } as const;

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || '?'
  );
}

/**
 * The team, as cards: directors first, then valuers, then agents. Each card says what the public
 * site does with the person (shown or hidden, signs reports or not), because those two switches
 * decide what /about/people and /valuations print, and an editor should not have to open the
 * form to find out.
 */
export default function AdminAgentsPage() {
  const { state, ready, deleteAgent } = useAdmin();
  const [query, setQuery] = useState('');

  const people = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...state.agents]
      .filter((agent) => !q || [agent.name, agent.role].some((v) => v?.toLowerCase().includes(q)))
      .sort((a, b) => rankOrder[a.rank] - rankOrder[b.rank]);
  }, [state.agents, query]);

  if (!ready) return <p className="text-body text-muted">Loading team…</p>;

  const shown = state.agents.filter((agent) => agent.listed !== false).length;
  const signatories = state.agents.filter((agent) => agent.signsReports).length;

  return (
    <div className="grid gap-5">
      <PageToolbar
        summary={
          <>
            <span className="font-semibold text-green">{state.agents.length}</span> people, {shown}{' '}
            shown on the site, {signatories} sign reports
          </>
        }
        search={query}
        onSearch={setQuery}
        searchLabel="Search name or role"
        action={
          <Button href="/admin/agents/new" size="sm">
            <PlusIcon width={16} height={16} /> Add team member
          </Button>
        }
      />

      {people.length === 0 ? (
        <p className="border border-green/10 bg-white px-5 py-10 text-center text-body text-muted">
          {query ? `Nobody matches "${query.trim()}".` : 'No team members yet.'}
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {people.map((agent) => (
            <li key={agent.id} className="flex flex-col border border-green/10 bg-white p-5">
              <div className="flex items-start gap-3.5">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-tag font-display text-[15px] font-semibold text-green"
                >
                  {initials(agent.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-[17px] font-semibold text-green">
                    {agent.name || 'Unnamed'}
                  </p>
                  <p className="text-small text-muted">{agent.role}</p>
                </div>
                <StatusPill tone={agent.rank === 'director' ? 'positive' : 'neutral'}>
                  {rankLabel[agent.rank]}
                </StatusPill>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {agent.listed === false ? (
                  <StatusPill tone="muted">Hidden from the site</StatusPill>
                ) : (
                  <StatusPill tone="positive">Shown on the site</StatusPill>
                )}
                {agent.signsReports && <StatusPill tone="attention">Signs reports</StatusPill>}
              </div>

              {agent.bio && (
                <p className="mt-3 line-clamp-3 text-small leading-relaxed text-muted">
                  {agent.bio}
                </p>
              )}

              <dl className="mt-4 grid gap-1.5 border-t border-hair pt-3 text-small text-muted">
                {agent.phone && (
                  <div className="tnum flex justify-between">
                    <dt>Phone</dt>
                    <dd className="text-green">{agent.phone}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt>Listings</dt>
                  <dd className="tnum text-green">{agent.assignedListings.length}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Credentials</dt>
                  <dd className="text-green">
                    {agent.credentialsConfirmed ? 'Confirmed' : 'Awaiting confirmation'}
                  </dd>
                </div>
              </dl>

              <div className="mt-auto flex gap-2 pt-4">
                <Link
                  href={`/admin/agents/${agent.id}`}
                  className={`${softButtonClass} flex-1 justify-center`}
                >
                  <PencilIcon width={14} height={14} /> Edit
                </Link>
                <ConfirmButton onConfirm={() => deleteAgent(agent.id)} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
