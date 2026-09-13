import type { Agent } from '@/lib/types';

/**
 * Real, named colleagues (listed publicly on cmtrealtors.com).
 *
 * OPEN ITEMS: exact job titles and headshots need confirming with CMT. We deliberately
 * do not put a stock photograph of an unrelated person against a named colleague, so
 * AgentCard renders initials until real headshots arrive. Direct lines are not published,
 * so both cards route to the switchboard.
 */
export const agents: Agent[] = [
  {
    id: 'kanshabe-lindah',
    name: 'Kanshabe Lindah',
    role: 'Property Agent',
    bio: 'Handles residential and commercial listings, viewings and owner instructions.',
  },
  {
    id: 'waniala-andrew',
    name: 'Waniala Andrew',
    role: 'Property Agent',
    bio: 'Handles land, industrial and agricultural instructions, including title checks.',
  },
];

export const agentById = Object.fromEntries(
  agents.map((agent) => [agent.id, agent]),
) as Record<string, Agent>;
