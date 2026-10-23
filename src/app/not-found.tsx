import { Header } from '@/components/layout/Header';
import { getSite } from '@/lib/content';
import { Footer } from '@/components/layout/Footer';
import { StickyMobileCTA } from '@/components/layout/StickyMobileCTA';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { categories } from '@/data/categories';
import { SiteProvider } from '@/components/SiteProvider';
import { getNavFacts } from '@/lib/content';

export const metadata = { title: 'Page not found' };

/**
 * The one route outside both the (site) and (admin) route groups, so it renders before
 * either layout resolves — a truly unmatched URL (a typo, an old link) has no group to
 * inherit chrome from. Header and Footer are imported directly here rather than relied on
 * from a layout, so a 404 still looks like the rest of the site instead of a bare page.
 */
export default async function NotFound() {
  const info = await getSite();
  const facts = await getNavFacts();

  return (
    <SiteProvider value={info}>
      <div className="flex min-h-screen flex-col">
        <Header facts={facts} />
        <main className="flex-1 py-20 lg:py-28">
          <Container>
            <p className="mb-[22px] flex items-center gap-3 text-[13px] font-semibold tracking-[0.16em] text-moss uppercase">
              <span aria-hidden="true" className="h-[3px] w-10 shrink-0 rounded-full bg-gold" />
              Page not found
            </p>
            <h1 className="max-w-[24ch] text-h1 tracking-[-0.02em] text-green">
              That page is not here
            </h1>
            <p className="mt-6 max-w-[560px] text-hero-lead leading-[1.6] text-prose">
              The link may be from the previous version of the site, or the property may have been
              sold or let. Start from the listings, or call the office and we will point you to the
              right place.
            </p>

            <div className="mt-[38px] flex flex-col gap-3.5 sm:flex-row">
              <Button href="/listings" size="lg" arrow>
                Browse properties
              </Button>
              <Button href={info.phone.href} variant="outline" size="lg">
                Call {info.phone.display}
              </Button>
            </div>

            <div className="mt-14 border-t border-green/14 pt-8">
              <h2 className="font-sans text-[13px] font-semibold tracking-[0.16em] text-moss uppercase">
                Or pick a property type
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <a
                      href={`/listings/${category.slug}`}
                      className="inline-flex min-h-11 items-center rounded-full border border-green/12 bg-white/70 px-5 text-small font-medium text-green transition-colors hover:bg-white"
                    >
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </main>
        <Footer />
        <StickyMobileCTA />
      </div>
    </SiteProvider>
  );
}
