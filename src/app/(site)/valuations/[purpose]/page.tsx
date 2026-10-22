import type { Metadata } from 'next';
import { cx } from '@/lib/cx';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CTABanner } from '@/components/CTABanner';
import { ValuationRequestForm } from '@/components/forms/ValuationRequestForm';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { Plate, Section, cardClass } from '@/components/ui/Section';
import { ArrowRightIcon, CheckCircleIcon, ClockIcon } from '@/components/ui/icons';
import { PurposeIcon } from '@/components/valuations/PurposeIcon';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getTeam } from '@/lib/content';
import { assetBySlug, purposeBySlug, valuationPurposes } from '@/data/valuations';
import { site } from '@/data/site';
import type { ValuationPurposeSlug } from '@/lib/types';

export function generateStaticParams() {
  return valuationPurposes.map((purpose) => ({ purpose: purpose.slug }));
}

/**
 * "Valuation for lending" reads, because that purpose is named "For lending". The others are
 * named plainly ("Financial reporting", "Insurance"), and the same template produced "Valuation
 * financial reporting" in the browser tab and "Request a valuation insurance" on the banner. This
 * adds the "for" wherever the name does not already carry it.
 */
const forPhrase = (name: string) =>
  /^for /i.test(name) ? name.toLowerCase() : `for ${name.toLowerCase()}`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ purpose: string }>;
}): Promise<Metadata> {
  const { purpose: slug } = await params;
  const purpose = purposeBySlug[slug as ValuationPurposeSlug];
  if (!purpose) return {};
  return {
    title: `Valuation ${forPhrase(purpose.name)}`,
    description: purpose.situation,
  };
}

/**
 * The converting page.
 *
 * Someone lands here from a search like "valuation for a bank loan" — mid-problem, often under
 * time pressure. So the page opens by stating their situation back to them, and the rail carries
 * the enquiry from the first pixel. See docs/LAYOUT-SPECS.md A-04.
 */
export default async function ValuationPurposePage({
  params,
}: {
  params: Promise<{ purpose: string }>;
}) {
  const { purpose: slug } = await params;
  const purpose = purposeBySlug[slug as ValuationPurposeSlug];
  if (!purpose) notFound();

  const others = valuationPurposes.filter((item) => item.slug !== purpose.slug);
  const { signatoryCount } = await getTeam();

  return (
    <>
      {/* Header. The situation sentence does more work than the rest of the page. */}
      <PageHeader
        title={`Valuation ${forPhrase(purpose.name)}`}
        eyebrow="Valuations"
        lead={purpose.situation}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Valuations', href: '/valuations' },
          { label: purpose.name },
        ]}
      />

      <Section containerClassName="grid gap-10 lg:grid-cols-[1.55fr_1fr] lg:gap-12">
        <div className="grid content-start gap-5">
          <div className={cx(cardClass, 'p-6 sm:p-8')}>
            <h2 className="font-display text-h3 font-semibold text-green">What the figure is based on</h2>
            <p className="mt-3 max-w-[62ch] text-small leading-relaxed text-prose">
              Each basis gives a different figure for the same property. We agree which one applies
              before we start, and state it on the first page of the report.
            </p>
            <dl className="mt-5">
              {purpose.basis.map((entry) => (
                <div key={entry.term} className="border-t border-hair py-4">
                  <dt className="font-display text-lead font-semibold text-green">{entry.term}</dt>
                  <dd className="mt-1 max-w-[62ch] text-small leading-relaxed text-muted">
                    {entry.meaning}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className={cx(cardClass, 'p-6 sm:p-8')}>
            <h2 className="font-display text-h3 font-semibold text-green">What you receive</h2>
            <ul className="mt-5">
              {purpose.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-3 border-t border-hair py-3 text-small text-green">
                  <CheckCircleIcon width={18} height={18} className="mt-px shrink-0 text-moss" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4">
            <h2 className="font-display text-h3 font-semibold text-green">Which assets we value for this</h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {purpose.assets.map((assetSlug) => {
                const asset = assetBySlug[assetSlug];
                return (
                  <li key={asset.slug} id={asset.slug} className="scroll-mt-32 rounded-[24px] bg-sage-soft p-6">
                    <h3 className="font-display text-lead font-semibold text-green">{asset.name}</h3>
                    <p className="mt-2 text-small leading-relaxed text-muted">{asset.description}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/*
          The rail. Sticky from lg only: a sticky rail on a phone eats the viewport, so below lg it
          simply falls to the foot of the column in normal document order.
        */}
        <aside className="lg:sticky lg:top-[calc(var(--header-h)+16px)] lg:self-start">
          <div className={cx(cardClass, 'p-6 shadow-[0_28px_56px_-28px_rgba(15,42,26,0.25)] sm:p-7')}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[12px] font-semibold tracking-[0.14em] text-moss uppercase">
                  Typical turnaround
                </p>
                <p className="tnum mt-2 font-display text-figure leading-none font-semibold text-green">
                  {purpose.turnaround}
                </p>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold text-green">
                <ClockIcon width={20} height={20} />
              </span>
            </div>
            {/* Only for a turnaround in days; "Scoped per instruction" needs no explaining. */}
            {/\d/.test(purpose.turnaround) && (
              <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
                Counted from the inspection, not from the first call. The time between the two
                usually depends on getting access to the property.
              </p>
            )}

            <div className="mt-6 border-t border-hair pt-6">
              <h2 className="font-display text-h4 font-semibold text-green">Request this valuation</h2>
              <div className="mt-4">
                {/* Purpose is locked: the page you are on has already answered that question. */}
                <ValuationRequestForm lockedPurpose={purpose.slug} compact />
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-[24px] bg-sage-soft p-6">
            <h2 className="font-display text-h4 font-semibold text-green">Who would sign it</h2>
            <p className="mt-2 text-small leading-relaxed text-prose">
              One of our {signatoryCount.toLowerCase()} valuers registered with the{' '}
              {site.regulator}. Their name goes on the report, and they answer for the figure if it
              is ever questioned.
            </p>
          </div>
        </aside>
      </Section>

      {/* Related purposes: white rows on a sage plate, each with the gold arrow disc. */}
      <Section>
        <Plate>
          <SectionHeading
            eyebrow="Other purposes"
            title="The other reasons people instruct us"
            lead="The same inspection can serve more than one purpose. If you need two, say so at instruction and we scope it once."
          />
          <ul className="mt-10 grid gap-3">
            {others.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/valuations/${item.slug}`}
                  className="group flex items-center gap-5 rounded-[20px] bg-white p-5 transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(15,42,26,0.35)]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage-soft text-green">
                    <PurposeIcon slug={item.slug} width={20} height={20} />
                  </span>
                  <span className="min-w-0 flex-1 sm:flex sm:items-baseline sm:justify-between sm:gap-8">
                    <span className="block font-display text-lead font-semibold text-green">{item.name}</span>
                    <span className="mt-1 block max-w-[52ch] text-small leading-snug text-muted max-sm:hidden sm:mt-0">
                      {item.situation}
                    </span>
                  </span>
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-green transition-transform group-hover:translate-x-0.5">
                    <ArrowRightIcon width={16} height={16} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button href="/valuations" variant="outline">
              See all valuation services
            </Button>
          </div>
        </Plate>
      </Section>

      <CTABanner
        title={`Request a valuation ${forPhrase(purpose.name)}`}
        lead="Tell us what needs valuing and when you need the report. You speak to a valuer, not a call centre."
        primary={{
          label: 'Request a valuation',
          href: `/contact/request-a-valuation?purpose=${purpose.slug}`,
        }}
        secondary={{ label: 'All valuation services', href: '/valuations' }}
      />
    </>
  );
}
