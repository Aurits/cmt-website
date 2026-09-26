import { OfficePanel } from '@/components/contact/OfficePanel';
import { PropertyMap } from '@/components/property/PropertyMap';
import { Container } from '@/components/ui/Container';
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
export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageHeader
        title="Talk to a valuer"
        lead="Tell us what you need valued, listed or advised on. Enquiries reach a valuer the same working day."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      />

      <section className="py-12 lg:py-16">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>{children}</div>
          <OfficePanel />
        </Container>
      </section>

      <section className="pb-12 lg:pb-16">
        <Container>
          <SectionHeading
            title="Finding us"
            lead={`${site.address.building} sits on ${site.address.street} in the city centre, a short walk from the main taxi park.`}
          />
          <PropertyMap
            className="mt-8"
            center={site.address.coords}
            label={`${site.name}, ${site.address.building}, ${site.address.street}`}
            zoom={16}
            height="h-[380px]"
            caption={`${site.address.building}, ${site.address.line1}. Pin is placed at street level from the published address and is not a surveyed position.`}
          />
        </Container>
      </section>
    </>
  );
}
