import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CTABanner } from '@/components/CTABanner';
import { ValuationRequestForm } from '@/components/forms/ValuationRequestForm';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { agents } from '@/data/agents';
import { assetBySlug, purposeBySlug, valuationPurposes } from '@/data/valuations';
import { site } from '@/data/site';
import type { ValuationPurposeSlug } from '@/lib/types';

export function generateStaticParams() {
  return valuationPurposes.map((purpose) => ({ purpose: purpose.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ purpose: string }>;
}): Promise<Metadata> {
  const { purpose: slug } = await params;
  const purpose = purposeBySlug[slug as ValuationPurposeSlug];
  if (!purpose) return {};
  return {
    title: `Valuation ${purpose.name.toLowerCase()}`,
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
  const signatory = agents[0];

  return (
    <>
      {/* Header. The situation sentence does more work than the rest of the page. */}
      <section className="bg-green text-cream">
        <Container className="py-12 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-micro text-cream/70">
              <li>
                <Link href="/" className="hover:text-gold">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-cream/40">
                /
              </li>
              <li>
                <Link href="/valuations" className="hover:text-gold">
                  Valuations
                </Link>
              </li>
              <li aria-hidden="true" className="text-cream/40">
                /
              </li>
              <li aria-current="page" className="text-cream">
                {purpose.name}
              </li>
            </ol>
          </nav>

          <span aria-hidden="true" className="mb-5 block h-[3px] w-10 bg-gold" />
          <h1 className="max-w-[24ch] text-h1 text-cream">
            Valuation {purpose.name.toLowerCase()}
          </h1>
          <p className="mt-5 max-w-[42ch] font-display text-subhead leading-snug text-cream/90">
            {purpose.situation}
          </p>
        </Container>
      </section>

      <section className="py-12 lg:py-16">
        <Container className="grid gap-10 lg:grid-cols-[1.55fr_1fr] lg:gap-12">
          <div>
            <h2 className="text-h3 text-green">What the figure is based on</h2>
            <p className="mt-3 max-w-[62ch] text-body leading-relaxed text-muted">
              These are terms of art, and which one applies changes the number. We state the basis on
              the first page of every report rather than leaving you to infer it.
            </p>
            <dl className="mt-6">
              {purpose.basis.map((entry) => (
                <div key={entry.term} className="border-t border-rule py-4">
                  <dt className="font-display text-lead text-green">{entry.term}</dt>
                  <dd className="mt-1.5 max-w-[62ch] text-body leading-relaxed text-muted">
                    {entry.meaning}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-10">
              <h2 className="text-h3 text-green">What you receive</h2>
              <dl className="mt-4">
                {purpose.deliverables.map((item) => (
                  <dd key={item} className="schedule-row text-body text-ink">
                    <span>{item}</span>
                  </dd>
                ))}
              </dl>
            </div>

            <div className="mt-10">
              <h2 className="text-h3 text-green">Which assets we value for this</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {purpose.assets.map((assetSlug) => {
                  const asset = assetBySlug[assetSlug];
                  return (
                    <li
                      key={asset.slug}
                      id={asset.slug}
                      className="scroll-mt-32 border border-rule bg-paper p-5"
                    >
                      <h3 className="font-display text-lead text-green">{asset.name}</h3>
                      <p className="mt-2 text-body leading-relaxed text-muted">
                        {asset.description}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/*
            The rail. Sticky from lg only — a sticky rail on a phone eats the viewport, so below
            lg it simply falls to the foot of the column in normal document order.
          */}
          <aside className="lg:sticky lg:top-[calc(var(--header-h)+16px)] lg:self-start">
            <div className="border border-rule border-t-2 border-t-gold bg-paper p-5">
              <p className="text-micro text-muted">Typical turnaround</p>
              <p className="tnum mt-1 font-display text-figure leading-none text-green">
                {purpose.turnaround}
              </p>
              <p className="mt-2 text-micro leading-relaxed text-muted">
                From the date of inspection, not the date of instruction. The gap between the two is
                usually access.
              </p>

              <div className="mt-5 border-t border-rule pt-5">
                <h2 className="text-h4 text-green">Request this valuation</h2>
                <div className="mt-4">
                  {/* Purpose is locked: the page you are on has already answered that question. */}
                  <ValuationRequestForm lockedPurpose={purpose.slug} compact />
                </div>
              </div>
            </div>

            <div className="mt-6 border border-green/25 bg-green/8 p-5">
              <h2 className="font-display text-h4 text-green">Who would sign it</h2>
              <p className="mt-2 text-body leading-relaxed text-muted">
                A registered valuer practising under the {site.regulator}
                {signatory ? `, currently ${signatory.name} for work of this kind` : ''}. The report
                carries their name, and they answer for the figure if it is questioned.
              </p>
            </div>
          </aside>
        </Container>
      </section>

      {/* Related purposes, as an index rather than cards. */}
      <section className="bg-cream-deep/45 py-12 lg:py-16">
        <Container>
          <SectionHeading
            title="The other reasons people instruct us"
            lead="The same inspection can serve more than one purpose. If you need two, say so at instruction and we scope it once."
          />
          <ul className="mt-8 border-t border-rule">
            {others.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/valuations/${item.slug}`}
                  className="group flex flex-col gap-1 border-b border-rule py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                >
                  <span className="font-display text-lead text-green group-hover:text-gold-deep">
                    {item.name}
                  </span>
                  <span className="max-w-[52ch] text-body leading-snug text-muted">
                    {item.situation}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-7">
            <Button href="/valuations" variant="quiet">
              Back to the full matrix
            </Button>
          </div>
        </Container>
      </section>

      <CTABanner
        title={`Request a valuation ${purpose.name.toLowerCase()}`}
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
