import type { Agent } from '@/lib/types';

/**
 * The people who sign the reports.
 *
 * CREDENTIALS ARE NOT PUBLISHED UNVERIFIED. Every entry below carries
 * `credentialsConfirmed: false`, which is what gates the post-nominals and the registration
 * numbers everywhere they appear — the standing schedule on /about, the credential line in the
 * homepage hero, the cards on /about/people. Names and roles render regardless, because who
 * directs a company is a matter of public record; a professional qualification is a claim about a
 * person's standing and belongs to them to confirm. Flip the flag per person and everything
 * switches on at once. See OPEN-ITEMS.md #1.
 *
 * `sourcedFrom` records how we know. 'cmt' means the firm publishes it on cmtrealtors.com or
 * cmtrealtors.co.ke. 'directory' means a third-party business directory — good enough to know who
 * to ask about, not good enough to publish as fact. /about/people says so on the page rather than
 * presenting the two as equivalent.
 *
 * The prototype previously listed only the two property agents. The credibility of a valuation
 * practice sits with the directors, and they were nowhere on the site.
 */
export const agents: Agent[] = [
  {
    id: 'godfrey-omondi',
    name: 'Godfrey Omondi',
    role: 'Director and Principal Consultant',
    rank: 'director',
    based: 'Kenya and Uganda',
    bio: 'Leads valuation and consultancy across both practices. More than twenty years in East African real estate, covering valuation, property and facilities management, life-cycle costing, site acquisition and investment performance analysis.',
    qualifications: [
      'MRICS, chartered valuation surveyor',
      'MSc Real Estate (United Kingdom, distinction)',
      'BA Land Economics, University of Nairobi',
      'Postgraduate Certificate in Corporate Governance',
    ],
    registrations: [
      {
        authority: 'RICS',
        authorityFull: 'Royal Institution of Chartered Surveyors',
        jurisdiction: 'Chartered, and registered to practise valuation internationally',
        postNominals: 'MRICS',
        confirmed: false,
      },
      {
        authority: 'SRB',
        authorityFull: 'Surveyors Registration Board',
        jurisdiction: 'Licensed to practise in Uganda',
        confirmed: false,
      },
      {
        authority: 'ISK',
        authorityFull: 'Institution of Surveyors of Kenya',
        jurisdiction: 'Licensed to practise in Kenya',
        confirmed: false,
      },
    ],
    credentialsConfirmed: false,
    sourcedFrom: 'cmt',
  },
  {
    id: 'michael-oballim',
    name: 'Michael Oballim',
    role: 'Director',
    rank: 'director',
    based: 'Kampala',
    bio: 'More than twenty years in valuation, agency and property management across the East African region, in both the public and private sectors.',
    qualifications: ['FISU, Fellow of the Institution of Surveyors of Uganda', 'BSc Land Management'],
    registrations: [
      {
        authority: 'ISU',
        authorityFull: 'Institution of Surveyors of Uganda',
        jurisdiction: 'Fellow of the institution',
        postNominals: 'FISU',
        confirmed: false,
      },
    ],
    credentialsConfirmed: false,
    sourcedFrom: 'directory',
  },
  {
    id: 'kanshabe-lindah',
    name: 'Kanshabe Lindah',
    role: 'Property Agent',
    rank: 'agent',
    based: 'Kampala',
    bio: 'Handles residential and commercial listings, viewings and owner instructions.',
    credentialsConfirmed: false,
    sourcedFrom: 'cmt',
  },
  {
    id: 'waniala-andrew',
    name: 'Waniala Andrew',
    role: 'Property Agent',
    rank: 'agent',
    based: 'Kampala',
    bio: 'Handles land, industrial and agricultural instructions, including title checks.',
    credentialsConfirmed: false,
    sourcedFrom: 'cmt',
  },
];

export const agentById = Object.fromEntries(
  agents.map((agent) => [agent.id, agent]),
) as Record<string, Agent>;

export const directors = agents.filter((agent) => agent.rank === 'director');
export const practitioners = agents.filter((agent) => agent.rank !== 'director');

/** True once anyone's credentials are confirmed — gates the standing schedule and hero line. */
export const anyCredentialsConfirmed = agents.some((agent) => agent.credentialsConfirmed);

/**
 * The firm's standing, as three rows. Drawn from the directors' registrations rather than
 * restated, so there is one place to confirm and no chance of the two drifting apart.
 */
export const firmRegistrations = [
  agents
    .flatMap((agent) => agent.registrations ?? [])
    .find((registration) => registration.authority === 'RICS'),
  agents
    .flatMap((agent) => agent.registrations ?? [])
    .find((registration) => registration.authority === 'SRB'),
  agents
    .flatMap((agent) => agent.registrations ?? [])
    .find((registration) => registration.authority === 'ISK'),
].filter(Boolean) as NonNullable<Agent['registrations']>;
