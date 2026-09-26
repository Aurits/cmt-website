import Link from 'next/link';
import { Container } from '@/components/ui/Container';

/**
 * Interior page opener: solid green band so every page below the homepage starts from
 * the brand rather than from a photograph competing with the headline.
 */
export function PageHeader({
  title,
  lead,
  leadShort,
  breadcrumbs,
  children,
}: {
  title: string;
  lead?: string;
  /** The lead on a phone; see SectionHeading and "THE MOBILE SYSTEM" in globals.css. */
  leadShort?: string;
  breadcrumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-green text-cream">
      {/* py-9 on a phone: the green header was 330px of the first screen before any content. */}
      <Container className="py-9 sm:py-12 lg:py-16">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-5 sm:mb-6">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-micro text-cream/70">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.label} className="flex items-center gap-2">
                  {index > 0 && (
                    <span aria-hidden="true" className="text-cream/40">
                      /
                    </span>
                  )}
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-gold">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-cream">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <span aria-hidden="true" className="mb-5 block h-[3px] w-10 bg-gold" />
        <h1 className="max-w-[30ch] text-h1 text-cream">{title}</h1>
        {lead && (
          <p className="mt-5 max-w-[62ch] text-lead leading-relaxed text-cream/80">
            {leadShort ? (
              <>
                <span className="sm:hidden">{leadShort}</span>
                <span className="max-sm:hidden">{lead}</span>
              </>
            ) : (
              lead
            )}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </section>
  );
}
