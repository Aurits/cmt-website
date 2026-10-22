import type { Agent, Registration } from '@/lib/types';

/**
 * The people who sign the reports.
 *
 * SOURCE. The team below comes from CMT's own staff list (docs/CMT Valuers.docx, received
 * October 2026; kept out of git because it holds personal phone numbers). That list names six
 * valuers registered with the Surveyors Registration Board, who form CMT's technical team and
 * sign every report: the two Technical Directors and four valuers. Only what belongs on a public
 * site is carried over: names, titles and the fact of registration. Personal numbers and email
 * addresses are not, and every contact on the site goes through the office.
 *
 * WHAT IS CONFIRMED, AND WHAT IS NOT. CMT has confirmed in writing that these six are registered
 * with the Board, so that registration is `confirmed: true`. It has not sent the registration
 * numbers, so `number` is unset and the site says "Registered" rather than printing one. Degrees
 * and other memberships (MRICS, FISU and so on) come from public sources CMT has not yet
 * confirmed: they stay `confirmed: false`, and `credentialsConfirmed: false` keeps the
 * qualifications list off the page. See docs/OPEN-ITEMS.md #1.
 *
 * NOTHING IS INVENTED. The four valuers' descriptions say what their role is and nothing more,
 * because we have not been told their specialisms. Add a line about each one's work when CMT
 * sends it.
 */

/** The Board registration CMT confirmed for all six signatories. Shared, so it is written once. */
const SRB: Registration = {
  authority: 'SRB',
  authorityFull: 'Surveyors Registration Board',
  jurisdiction: 'Registered to practise valuation in Uganda',
  confirmed: true,
};

/**
 * A registered valuer on the technical team. No `bio` until CMT tells us about each person's work:
 * the same sentence on four cards in a row read as a template, and the section heading above them
 * already says what a registered valuer does.
 */
const valuer = (id: string, name: string): Agent => ({
  id,
  name,
  role: 'Registered Valuer',
  rank: 'valuer',
  based: 'Kampala',
  registrations: [SRB],
  signsReports: true,
  credentialsConfirmed: false,
  sourcedFrom: 'cmt',
});

export const agents: Agent[] = [
  {
    id: 'godfrey-omondi',
    name: 'Godfrey Omondi',
    role: 'Technical Director and Partner',
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
      SRB,
      {
        authority: 'RICS',
        authorityFull: 'Royal Institution of Chartered Surveyors',
        jurisdiction: 'Chartered, and registered to practise valuation internationally',
        postNominals: 'MRICS',
        confirmed: false,
      },
      {
        authority: 'ISK',
        authorityFull: 'Institution of Surveyors of Kenya',
        jurisdiction: 'Licensed to practise in Kenya',
        confirmed: false,
      },
    ],
    signsReports: true,
    credentialsConfirmed: false,
    sourcedFrom: 'cmt',
  },
  {
    id: 'michael-oballim',
    name: 'Michael Oballim',
    role: 'Technical Director and Partner',
    rank: 'director',
    based: 'Kampala',
    bio: 'More than twenty years in valuation, agency and property management across the East African region, in both the public and private sectors.',
    qualifications: ['FISU, Fellow of the Institution of Surveyors of Uganda', 'BSc Land Management'],
    registrations: [
      SRB,
      {
        authority: 'ISU',
        authorityFull: 'Institution of Surveyors of Uganda',
        jurisdiction: 'Fellow of the institution',
        postNominals: 'FISU',
        confirmed: false,
      },
    ],
    signsReports: true,
    credentialsConfirmed: false,
    // Title now confirmed by CMT's staff list; the biography is still from a business directory.
    sourcedFrom: 'cmt',
  },
  valuer('rachel-nanyunja', 'Rachel Nanyunja'),
  // Spelled as in CMT's staff list. Her email there reads "snamujjumbi" and earlier CMT material
  // spelled it "Namujjumbi": one of the two is a typo. Asked in docs/CONTENT-NEEDED.md.
  valuer('stella-namujumbi', 'Stella Namujumbi'),
  valuer('joan-nakalanda', 'Joan Nakalanda'),
  valuer('ronald-kidega', 'Ronald Kidega'),

  // Listed as property agents on CMT's old website, but not in CMT's own staff list, so they are
  // kept off the public pages until CMT confirms either way. Records kept, not deleted: set
  // `listed` back to true and they reappear everywhere.
  {
    id: 'kanshabe-lindah',
    name: 'Kanshabe Lindah',
    role: 'Property Agent',
    rank: 'agent',
    based: 'Kampala',
    bio: 'Handles residential and commercial listings, viewings and owner instructions.',
    credentialsConfirmed: false,
    sourcedFrom: 'cmt',
    listed: false,
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
    listed: false,
  },
];

/** Everyone, including people kept off the public pages: for lookups by id only. */
export const agentById = Object.fromEntries(
  agents.map((agent) => [agent.id, agent]),
) as Record<string, Agent>;

/**
 * Who a visitor should contact about a property when the listing's own agent is not shown on the
 * site: the office, so a listing never points at someone the site does not show.
 */
export const officeContact: Agent = {
  id: 'office',
  name: 'CMT Realtors',
  role: 'Property enquiries, Kampala office',
  rank: 'agent',
  credentialsConfirmed: false,
  sourcedFrom: 'cmt',
};

const NUMBER_WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

/**
 * Everything the public pages derive from the team, computed from whichever list is in play.
 *
 * A function rather than module constants because the list comes from the repository: this file
 * on a machine with no database, Postgres once there is one (src/lib/content.ts). Every rule
 * below therefore applies to what staff enter in the CMS exactly as it does to the list above.
 */
export function buildTeam(all: Agent[]) {
  const byId = Object.fromEntries(all.map((agent) => [agent.id, agent])) as Record<string, Agent>;
  /** Only the people who appear on the site. Every public list starts from this. */
  const shown = all.filter((agent) => agent.listed !== false);
  /** The registered valuers who sign CMT's reports, directors first. */
  const signatories = shown.filter((agent) => agent.signsReports);

  /*
   * The firm's standing, one row per registering body, in the order they matter to a Ugandan
   * lender: the Board first. Drawn from the people's registrations rather than restated, so there
   * is one place to confirm and no chance of the two drifting apart.
   */
  const byAuthority = (authority: string) =>
    shown.flatMap((agent) => agent.registrations ?? []).find((r) => r.authority === authority);

  /*
   * Registrations grouped by body, with everyone who holds each one: what /about/credentials
   * lists. Six people share the Board registration, and six identical rows would bury the rest.
   */
  const groups = new Map<string, { registration: Registration; holders: Agent[] }>();
  for (const agent of shown) {
    for (const registration of agent.registrations ?? []) {
      const group = groups.get(registration.authority);
      if (group) group.holders.push(agent);
      else groups.set(registration.authority, { registration, holders: [agent] });
    }
  }

  return {
    byId,
    directors: shown.filter((agent) => agent.rank === 'director'),
    /** Everyone shown who is not a director: the valuers first, then any agents. */
    practitioners: shown
      .filter((agent) => agent.rank !== 'director')
      .sort((a, b) => Number(b.rank === 'valuer') - Number(a.rank === 'valuer')),
    signatories,
    /** "Six", for sentences: written out, and recounted whenever the team changes. */
    signatoryCount: NUMBER_WORDS[signatories.length] ?? String(signatories.length),
    /** The listing's own agent where they appear on the site; otherwise the office. */
    contactFor: (agentId: string): Agent => {
      const agent = byId[agentId];
      return agent && agent.listed !== false ? agent : officeContact;
    },
    firmRegistrations: ['SRB', 'RICS', 'ISK'].map(byAuthority).filter(Boolean) as Registration[],
    registrationsByBody: [...groups.values()],
  };
}

export type Team = ReturnType<typeof buildTeam>;
