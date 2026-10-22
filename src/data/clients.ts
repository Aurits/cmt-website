/**
 * Every institution CMT values for, as text.
 *
 * SOURCE. CMT's own list of current clients (docs/cmt-valuers.docx, received October 2026), which
 * says CMT "has done valuations and is in the panel of" each of them. That is CMT's claim about
 * its own work, so the site words it the same way and no stronger.
 *
 * WHY A SEPARATE FILE FROM partners.ts. partners.ts holds the 14 institutions whose logos we have
 * and may show. This is the full list, shown as names, so the site can say how many institutions
 * really instruct CMT without waiting for 40 more logo files. A name in text makes a smaller claim
 * than a logo does, and needs no artwork.
 *
 * NAMES. Written as each organisation writes its own name (Ecobank, dfcu, TotalEnergies), which is
 * what a reader recognises. Where CMT's list differed, the change is noted below so CMT can check it:
 *   "National Water and Sewerage Cooperation"  ->  Corporation
 *   "Eco Bank" -> Ecobank          "Vision fund" -> VisionFund Uganda
 *   "Total Energies" -> TotalEnergies    "Kobil (Rubis)" -> Rubis Energy (formerly Kobil)
 *   "Shell Uganda/Vivo Energy Uganda" -> Vivo Energy Uganda (Shell)
 *   "Micro finance Support Centre" -> Microfinance Support Centre
 *
 * HELD BACK until CMT says what they stand for: "PLC", "HCH" and "EFC – MDI". Publishing an
 * abbreviation a reader cannot place adds nothing, and guessing at it would put a name on the site
 * CMT never gave us. Asked in docs/content-needed.md.
 */

export interface ClientGroup {
  name: string;
  clients: string[];
}

export const clientGroups: ClientGroup[] = [
  {
    name: 'Banks and financial institutions',
    clients: [
      'Bank of Uganda',
      'Absa Bank Uganda',
      'ABC Capital Bank',
      'African Development Bank',
      'Bank of Africa',
      'Bank of India',
      'Cairo Bank Uganda',
      'Centenary Bank',
      'dfcu Bank',
      'Diamond Trust Bank',
      'Ecobank',
      'Exim Bank',
      'Finance Trust Bank',
      'Guaranty Trust Bank Uganda',
      'Housing Finance Bank',
      'I&M Bank',
      'KCB Bank Uganda',
      'NCBA',
      'Opportunity Bank',
      'Pearl Bank',
      'Pride Bank',
      'Salaam Bank',
      'Stanbic Bank Uganda',
      'Standard Chartered Bank',
      'Tropical Bank',
      'Uganda Development Bank',
      'United Bank for Africa',
    ],
  },
  {
    name: 'Microfinance, credit unions and SACCOs',
    clients: [
      'BRAC Uganda',
      'CPA SACCO',
      'ECLOF Uganda',
      'FINCA Uganda',
      'Letshego',
      'Microfinance Support Centre',
      'UN Federal Credit Union',
      'Uganda National Bureau of Standards SACCO',
      'VisionFund Uganda',
    ],
  },
  {
    name: 'Government and public bodies',
    clients: [
      'Office of the Attorney General',
      'Uganda Communications Commission',
      'National Water and Sewerage Corporation',
      'Arua District Local Government',
      'Tororo District Local Government',
    ],
  },
  {
    name: 'Energy, insurance and companies',
    clients: [
      'TotalEnergies',
      'Vivo Energy Uganda (Shell)',
      'Rubis Energy (formerly Kobil)',
      'Mogas',
      'Pax Insurance',
      'Rapid Advisory',
    ],
  },
  {
    name: 'Development, faith and community',
    clients: [
      'Plan International Uganda',
      'Uganda Episcopal Conference',
      'Watoto Church',
      'Uganda Cricket Oval',
    ],
  },
];

/** Counted, never typed: the number on the homepage is always the length of this list. */
export const clientCount = clientGroups.reduce((sum, group) => sum + group.clients.length, 0);

/** How the count reads in a sentence: "more than 50", never a figure CMT has not given us. */
export const clientCountLabel = `more than ${Math.floor(clientCount / 10) * 10}`;
