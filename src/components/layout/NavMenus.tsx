import Image from 'next/image';
import Link from 'next/link';
import { ChevronIcon } from '@/components/ui/icons';
import { advisoryServices } from '@/data/advisory';
import { categories } from '@/data/categories';
import { listings, listingsByCategory } from '@/data/listings';
import { offices, site, stats } from '@/data/site';
import { assetBySlug, valuationPurposes } from '@/data/valuations';

export type NavMenuKey = 'about' | 'valuations' | 'advisory' | 'properties';

type MenuLink = { label: string; href: string };

type ScheduleRow = MenuLink & {
  /** One line under the name: what the destination is, or who it is for. */
  note: string;
  /** Right-hand column, set in tabular numerals. Omitted where the data has no honest figure. */
  figure?: string;
};

type Feature =
  | { kind: 'photo'; image: string; eyebrow: string; lead: string; cta: MenuLink }
  | { kind: 'ledger'; eyebrow: string; cta: MenuLink };

export type NavMenu = {
  intro: { eyebrow: string; title: string; lead: string; actions?: MenuLink[]; more: MenuLink };
  schedule: { caption: string; figureCaption?: string; rows: ScheduleRow[] };
  feature: Feature;
};

/**
 * One grammar for every section menu, so the masthead behaves the same wherever you open it.
 *
 * Each menu is a preview of its section, not a list of links into it: the intro is the landing
 * page's own heading and lead, the schedule is where you can go inside the section, and the
 * feature is the single next step. Every phrase and figure is taken from the page or data file
 * it points at, so the menu promises exactly what the click delivers, and changes when they do.
 *
 * The figure column only appears where there is a real figure: listing counts for Properties,
 * turnaround for Valuations. Advisory is scoped per engagement and About is a set of pages, so
 * neither is given a number to fill the column.
 */
export const navMenus: Record<NavMenuKey, NavMenu> = {
  about: {
    intro: {
      eyebrow: 'About',
      title: 'A figure is only worth the name on it',
      lead: `Valuation and property consultancy in Uganda and Kenya, regulated by the ${site.regulator}.`,
      more: { label: 'About CMT', href: '/about' },
    },
    schedule: {
      caption: 'Contents',
      rows: [
        { label: 'Our people', href: '/about/people', note: 'The people who sign the reports' },
        { label: 'Credentials', href: '/about/credentials', note: 'A named valuer on every report' },
        { label: 'Offices', href: '/about/offices', note: `${offices.length} offices, two countries` },
        { label: 'Our clients', href: '/about/clients', note: 'The institutions that instruct us' },
      ],
    },
    feature: {
      kind: 'ledger',
      eyebrow: 'The ledger',
      cta: { label: 'See our credentials', href: '/about/credentials' },
    },
  },

  valuations: {
    intro: {
      eyebrow: 'Valuations',
      title: 'What do you need valued, and what for?',
      lead: 'Property, plant and machinery, and business valuations, across Uganda and Kenya.',
      more: { label: 'See the valuation matrix', href: '/valuations' },
    },
    schedule: {
      caption: 'Purpose',
      figureCaption: 'Working days',
      rows: valuationPurposes.map((purpose) => {
        const days = purpose.turnaround.replace(/\s*working days$/, '');
        return {
          label: purpose.name,
          href: `/valuations/${purpose.slug}`,
          note: purpose.assets.map((asset) => assetBySlug[asset].short).join(' · '),
          // "Scoped per instruction" is the honest figure for compensation work.
          figure: /\d/.test(days) ? days : 'Scoped',
        };
      }),
    },
    feature: {
      kind: 'photo',
      image: '/images/services/valuation.jpg',
      eyebrow: 'Need one now?',
      lead: 'Tell us the asset and the purpose. We reply the same working day.',
      cta: { label: 'Request a valuation', href: '/contact/request-a-valuation' },
    },
  },

  advisory: {
    intro: {
      eyebrow: 'Advisory',
      title: 'Advice before you commit',
      lead: 'Everything that is not a valuation report, scoped in writing before it starts.',
      more: { label: 'All advisory services', href: '/advisory' },
    },
    schedule: {
      caption: 'Service',
      rows: advisoryServices.map((service) => ({
        label: service.name,
        href: `/advisory#${service.slug}`,
        note: `For ${service.audience.charAt(0).toLowerCase()}${service.audience.slice(1)}`,
      })),
    },
    feature: {
      kind: 'photo',
      image: '/images/services/consultancy.jpg',
      eyebrow: 'Weighing a decision?',
      lead: 'The fee and the deliverable are agreed up front, not discovered later.',
      cta: { label: 'Talk to an adviser', href: '/contact' },
    },
  },

  properties: {
    intro: {
      eyebrow: 'Properties',
      title: 'Property on our books',
      lead: `${listings.length} instructions across five property classes and four cities.`,
      actions: [
        { label: 'For sale', href: '/listings?type=sale' },
        { label: 'To let', href: '/listings?type=rent' },
      ],
      more: { label: 'View all properties', href: '/listings' },
    },
    schedule: {
      caption: 'Schedule of property',
      figureCaption: 'Listed',
      rows: categories.map((category) => ({
        label: category.name,
        href: `/listings/${category.slug}`,
        note: category.label,
        figure: String(listingsByCategory(category.slug).length),
      })),
    },
    feature: {
      kind: 'photo',
      image: '/images/listings/res-villa-pool.jpg',
      eyebrow: 'Own a property?',
      // The listings page's own CTA line, so the promise is made once, in the same words.
      lead: 'We value it first, then price it from evidence.',
      cta: { label: 'List with us', href: '/contact/list-a-property' },
    },
  },
};

const labelClass = 'font-sans text-label font-semibold uppercase tracking-[0.12em]';

/**
 * The panel itself: three columns in the order a visitor decides (what this is, where to go,
 * what to do next). The schedule is set as a valuation schedule (`schedule-row`, the site's
 * structural motif): numbered, ruled, figures in tabular numerals, because that is how CMT sets
 * things out in a report, and it is what makes these a valuer's menus rather than a template's.
 *
 * It spans the page's content width, sharing its edges with the logo and the header CTA, and
 * hangs from the masthead's gold hairline, which serves as its top rule. PillNav positions it.
 *
 * Its floating corners take --radius-overlay (see globals.css): the menu belongs to the pill nav
 * that opened it, not to the page. The feature tile nests one size down.
 *
 * The panel is a cream surface inside the green masthead, so it resets the focus ring to green
 * (see :focus-visible in globals.css); the feature, a green surface, takes gold, drawn inset.
 */
export function NavMenuPanel({
  menu,
  id,
  onNavigate,
}: {
  menu: NavMenu;
  id: string;
  onNavigate: () => void;
}) {
  const { intro, schedule, feature } = menu;

  return (
    <div
      id={id}
      className="grid grid-cols-12 gap-8 rounded-b-overlay border border-t-0 border-rule bg-cream p-8 text-ink shadow-[0_28px_56px_-24px_rgba(10,30,15,0.5)] [--focus-ring:var(--color-green)] xl:gap-10"
    >
      <div className="col-span-3 flex flex-col">
        <p className={`${labelClass} text-muted`}>{intro.eyebrow}</p>
        <p className="mt-3 font-display text-h4 leading-tight text-green">{intro.title}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">{intro.lead}</p>
        {intro.actions && (
          <div className="mt-5 flex gap-2">
            {intro.actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                onClick={onNavigate}
                className="rounded-control border border-rule-strong px-3.5 py-1.5 text-sm text-green transition-colors hover:border-green hover:bg-green hover:text-cream"
              >
                {action.label}
              </Link>
            ))}
          </div>
        )}
        <Link
          href={intro.more.href}
          onClick={onNavigate}
          className="group mt-auto flex items-center gap-1 pt-6 text-sm font-medium text-green"
        >
          <span className="underline decoration-gold decoration-2 underline-offset-4">
            {intro.more.label}
          </span>
          <ChevronIcon
            width={14}
            height={14}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      <div className="col-span-5">
        <div className="flex items-baseline justify-between pb-2">
          <p className={`${labelClass} text-muted`}>{schedule.caption}</p>
          {schedule.figureCaption && (
            <p className={`${labelClass} text-muted`}>{schedule.figureCaption}</p>
          )}
        </div>
        <ol className="border-b border-rule">
          {schedule.rows.map((row, index) => (
            <li key={row.href}>
              <Link href={row.href} onClick={onNavigate} className="group schedule-row items-center">
                <span className="flex items-baseline gap-4">
                  <span className="tnum w-5 shrink-0 text-label text-muted">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <span className="block font-display text-body text-green transition-colors group-hover:text-gold-deep">
                      {row.label}
                    </span>
                    <span className="block text-micro text-muted">{row.note}</span>
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  {row.figure && (
                    <span className="tnum whitespace-nowrap text-body text-ink">{row.figure}</span>
                  )}
                  <ChevronIcon
                    width={14}
                    height={14}
                    className="-translate-x-1 text-gold-deep opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>

      <FeatureTile feature={feature} onNavigate={onNavigate} />
    </div>
  );
}

const featureClass =
  'group relative col-span-4 flex min-h-[300px] flex-col overflow-hidden rounded-[calc(var(--radius-overlay)-0.25rem)] p-6 text-cream [--focus-ring:var(--color-gold)] focus-visible:outline-offset-[-4px]';

function FeatureCta({ feature }: { feature: Feature }) {
  return (
    <span className="relative">
      <span className={`${labelClass} text-gold`}>{feature.eyebrow}</span>
      <span className="mt-1 flex items-center gap-1.5 font-display text-h4 leading-tight">
        {feature.cta.label}
        <ChevronIcon width={18} height={18} className="transition-transform group-hover:translate-x-1" />
      </span>
      {feature.kind === 'photo' && (
        <span className="mt-1.5 block text-sm leading-snug text-cream/80">{feature.lead}</span>
      )}
    </span>
  );
}

/**
 * The right-hand column. Usually a photograph fading into the masthead green; for About, the
 * firm's figures instead, set as the same ledger the homepage stats strip uses, because standing
 * is what that section sells and a stock photograph would only decorate it.
 */
function FeatureTile({ feature, onNavigate }: { feature: Feature; onNavigate: () => void }) {
  if (feature.kind === 'ledger') {
    return (
      <Link
        href={feature.cta.href}
        onClick={onNavigate}
        className={`${featureClass} justify-between gap-8 bg-green`}
      >
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
          {stats.map((stat) => (
            <div key={stat.unit} className="border-t border-cream/20 pt-3">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="flex items-baseline gap-1.5">
                <span className="tnum font-display text-h3 leading-none text-gold">{stat.value}</span>
                <span className="text-sm text-cream/80">{stat.unit}</span>
              </dd>
            </div>
          ))}
        </dl>
        <FeatureCta feature={feature} />
      </Link>
    );
  }

  return (
    <Link href={feature.cta.href} onClick={onNavigate} className={`${featureClass} justify-end`}>
      <Image
        src={feature.image}
        alt=""
        fill
        sizes="400px"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-green via-green/55 to-transparent"
      />
      <FeatureCta feature={feature} />
    </Link>
  );
}
