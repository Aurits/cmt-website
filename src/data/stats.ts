import { clientCount } from './clients';
import { offices, site } from './site';

/*
 * The ledger: the four figures under the homepage headline and on /about.
 *
 * In its own file, not in site.ts, because two of the four are counted from other data files (the
 * client list and the registered valuers) and site.ts must stay free of value imports:
 * scripts/seed.mjs loads src/data straight into Node, which can only do that while those files
 * import nothing but types. This file is never seeded, so it may import what it likes. Relative
 * imports, not "@/", so it would still load under plain Node if that ever changes.
 */
/**
 * `institutions` counts CMT's full client list (src/data/clients.ts), shown as names on
 * /about/clients, not the 14 logos in the belt; the belt is captioned as a selection.
 * `registered valuers` counts the people marked `signsReports`, passed in because the team comes
 * from the repository (src/lib/content.ts).
 */
export function buildStats(signatoryTotal: number, yearsInBusiness: string = site.yearsInBusiness) {
  return [
    { value: yearsInBusiness, unit: 'years', label: 'Valuing property in East Africa' },
    {
      value: String(offices.length),
      unit: 'offices',
      // Counted from `offices`, not written out, so it stays true when an office opens. Kenya is
      // named as the linked practice it is until site.regionConfirmed says otherwise
      // (docs/OPEN-ITEMS.md #2), the same wording InBrief uses.
      label: `${offices.filter((o) => o.country === 'Uganda').length} in Uganda, ${
        offices.filter((o) => o.country === 'Kenya').length
      } ${site.regionConfirmed ? 'in Kenya' : 'with our linked Kenya practice'}`,
    },
    // Both counted from the data, never typed: they change when the lists do.
    {
      value: String(clientCount),
      unit: 'institutions',
      label: 'Banks, public bodies and companies that instruct us',
    },
    {
      value: String(signatoryTotal),
      unit: 'registered valuers',
      label: 'With the Surveyors Registration Board, signing every report',
    },
  ];
}

export type Stat = ReturnType<typeof buildStats>[number];
