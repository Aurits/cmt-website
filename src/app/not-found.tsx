import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { categories } from '@/data/categories';
import { site } from '@/data/site';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <span aria-hidden="true" className="mb-5 block h-[3px] w-10 bg-gold" />
        <h1 className="max-w-[24ch] text-[clamp(2rem,4.4vw,3rem)] text-green">
          That page is not here
        </h1>
        <p className="mt-5 max-w-[54ch] text-[1.0625rem] leading-relaxed text-muted">
          The link may be from the previous version of the site, or the property may have
          been sold or let. Start from the listings, or call the office and we will point you
          to the right place.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/listings" variant="primary" size="lg">
            Browse properties
          </Button>
          <Button href={site.phone.href} variant="outline" size="lg">
            Call {site.phone.display}
          </Button>
        </div>

        <div className="mt-12 border-t border-rule pt-6">
          <h2 className="font-sans text-[0.9375rem] font-semibold text-ink">
            Or pick a property type
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <li key={category.slug}>
                <a
                  href={`/listings/${category.slug}`}
                  className="inline-block rounded-control border border-rule bg-paper px-3.5 py-2 text-[0.875rem] text-green transition-colors hover:border-green/50"
                >
                  {category.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
