import Link from 'next/link';
import { Container } from '@/components/ui/Container';

/**
 * Interior page opener, in the hero design's voice (Hero.html): on the paper, a small
 * breadcrumb trail, the eyebrow (a 40px gold rule and the section's name in moss capitals), the
 * title in Fraunces, and the lead at the hero's 19px in the prose colour. No band and no rule
 * under it: the page simply continues on the same ground, as the homepage does under its hero.
 *
 * The eyebrow defaults to the section the page sits in (the first crumb after Home), so a page
 * says where it is without repeating its own title.
 */
export function PageHeader({
  title,
  eyebrow,
  lead,
  leadShort,
  breadcrumbs,
  children,
}: {
  title: string;
  eyebrow?: string;
  lead?: string;
  /** The lead on a phone; see SectionHeading and "THE MOBILE SYSTEM" in globals.css. */
  leadShort?: string;
  breadcrumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
}) {
  const label = eyebrow ?? breadcrumbs?.[1]?.label ?? title;

  return (
    <section>
      <Container className="pt-8 pb-12 min-[961px]:pt-12 lg:pb-16">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.label} className="flex items-center gap-2">
                  {index > 0 && (
                    <span aria-hidden="true" className="text-chip">
                      /
                    </span>
                  )}
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-green">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-green">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <p className="mb-[22px] flex items-center gap-3 text-[13px] font-semibold tracking-[0.16em] text-moss uppercase">
          <span aria-hidden="true" className="h-[3px] w-10 shrink-0 rounded-full bg-gold" />
          {label}
        </p>
        <h1 className="max-w-[24ch] text-h1 tracking-[-0.02em] text-balance text-green">{title}</h1>
        {lead && (
          <p className="mt-6 max-w-[620px] text-hero-lead leading-[1.6] text-prose">
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
