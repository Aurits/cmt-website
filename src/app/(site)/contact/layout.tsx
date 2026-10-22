import { OfficePanel } from '@/components/contact/OfficePanel';
import { getSite } from '@/lib/content';
import { PropertyMap } from '@/components/property/PropertyMap';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { site } from '@/data/site';

/**
 * Shared chrome for the three contact intents.
 *
 * Header, office panel and map are identical whichever door you came through, so they live here
 * and each route owns only its heading, its form and its own metadata. Keeping the tabs inside
 * the page (rather than here) lets each one mark itself current without the layout having to know
 * the route.
 */
export default async function ContactLayout({ children }: { children: React.ReactNode }) {
  const info = await getSite();
  return (
    <>
      <PageHeader
        title="Talk to a valuer"
        lead="Tell us what you need valued, listed or advised on. Enquiries reach a valuer the same working day."
        eyebrow="Contact"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      />

      <Section containerClassName="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        {/* The form sits on a white card, as the hero's report card sits on the paper. */}
        <div className="rounded-(--radius-card) border border-green/8 bg-white p-5 shadow-[0_28px_56px_-28px_rgba(15,42,26,0.25)] sm:p-8">
          {children}
        </div>
        <OfficePanel />
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Visit us"
          title="Finding us"
          lead={`${info.address.building} sits on ${info.address.street} in the city centre, a short walk from the main taxi park.`}
        />
        <PropertyMap
          className="mt-8"
          center={info.address.coords}
          label={`${site.name}, ${info.address.building}, ${info.address.street}`}
          zoom={16}
          height="h-[380px]"
          caption={`${info.address.building}, ${info.address.line1}. Pin is placed at street level from the published address and is not a surveyed position.`}
        />
      </Section>
    </>
  );
}
