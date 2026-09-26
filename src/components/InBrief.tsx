import Link from 'next/link';
import { ChevronIcon } from '@/components/ui/icons';
import { advisoryServices } from '@/data/advisory';
import { kenyaOffices, site, ugandaOffices } from '@/data/site';
import { valuationPurposes } from '@/data/valuations';

// A serial comma only where an item carries its own "and" ("tax and litigation"), or the last
// two items run together.
const list = (items: string[]) => {
  if (items.length < 2) return items.join('');
  const joiner = items.some((item) => item.includes(' and ')) ? ', and ' : ' and ';
  return `${items.slice(0, -1).join(', ')}${joiner}${items.at(-1)}`;
};

const words = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const count = (n: number) => words[n] ?? String(n);

const kenyaHead = kenyaOffices.find((office) => office.role === 'Head office')?.city;

/**
 * Four plain statements: who we are, where we work, what we do, what we provide. Every clause
 * is assembled from the data the rest of the site renders (offices, valuation purposes,
 * advisory services), so the summary cannot drift from the pages it summarises.
 *
 * Kenya is described as a linked practice, not as part of one regional firm, until
 * `site.regionConfirmed` says otherwise (docs/OPEN-ITEMS.md #2).
 */
const statements = [
  {
    label: 'Who we are',
    body: `${site.name} is a valuation and property consultancy, regulated by the ${site.regulator} and valuing property for ${site.yearsInBusiness} years.`,
    link: { label: 'About us', href: '/about' },
  },
  {
    label: 'Where we work',
    body: `From offices in ${list(ugandaOffices.map((office) => office.city))}${
      kenyaHead
        ? site.regionConfirmed
          ? `, and across Kenya from ${kenyaHead}`
          : `, with a linked practice in Kenya based in ${kenyaHead}`
        : ''
    }.`,
    link: { label: 'Our offices', href: '/about/offices' },
  },
  {
    label: 'What we do',
    body: 'We put a defensible figure on property. Banks lend against it, auditors rely on it, and public bodies use it to assess compensation.',
    link: { label: 'Valuations', href: '/valuations' },
  },
  {
    label: 'What we provide',
    body: `We value property for ${list(valuationPurposes.map((purpose) => purpose.name.replace(/^For /, '').toLowerCase()))}. We also offer ${count(advisoryServices.length)} kinds of property advice, and we sell and let property.`,
    link: { label: 'Advisory', href: '/advisory' },
  },
];

/**
 * Set as a four-column schedule: numbered like the nav menus, ruled like the rest of the site,
 * one row on a desktop so it adds a line to the page rather than a section. Stacks to two
 * columns, then one.
 */
export function InBrief({ className }: { className?: string }) {
  return (
    <dl className={`grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 ${className ?? ''}`}>
      {statements.map((statement, index) => (
        <div key={statement.label} className="flex flex-col border-t border-rule pt-4">
          <dt className="flex items-baseline gap-3">
            {/* Gold display numerals, like every other numbered list on the site (the homepage
                reasons, the advisory index, the history on About); this was the one set in small
                grey label type. */}
            <span className="tnum font-display text-lead text-gold-deep">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="font-display text-h4 text-green">{statement.label}</span>
          </dt>
          <dd className="mt-2 flex flex-1 flex-col">
            <p className="text-body leading-relaxed text-muted">{statement.body}</p>
            <Link
              href={statement.link.href}
              className="group mt-auto flex items-center gap-1 pt-4 text-sm font-medium text-green"
            >
              <span className="underline decoration-gold decoration-2 underline-offset-4">
                {statement.link.label}
              </span>
              <ChevronIcon
                width={14}
                height={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </dd>
        </div>
      ))}
    </dl>
  );
}
