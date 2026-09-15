import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { MailIcon, PhoneIcon, PinIcon } from '@/components/ui/icons';
import { categories } from '@/data/categories';
import { aboutPages, nav, site } from '@/data/site';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    // Footer carries the mark too, so it shares the masthead green; the gold hairline
    // separates it from whatever green CTA banner sits immediately above.
    <footer className="border-t border-gold/30 bg-green text-cream">
      <Container className="py-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Image
              src="/brand/cmt-logo.png"
              alt={site.name}
              width={900}
              height={431}
              className="-ml-4 h-14 w-auto"
            />
            <p className="mt-5 max-w-[34ch] text-sm leading-relaxed text-cream/75">
              Valuation and property consultancy in Uganda, regulated by the {site.regulator}.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-sans text-[0.9375rem] font-semibold tracking-normal text-gold">
              Site
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-cream/80 hover:text-gold">
                    {item.label}
                  </Link>
                  {/* The About sub-pages carry the firm's standing, so they are reachable from
                      every page rather than only from /about. */}
                  {item.href === '/about' && (
                    <ul className="mt-2.5 space-y-2.5 border-l border-cream/15 pl-3">
                      {aboutPages.map((page) => (
                        <li key={page.href}>
                          <Link href={page.href} className="text-cream/65 hover:text-gold">
                            {page.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-sans text-[0.9375rem] font-semibold tracking-normal text-gold">
              Property types
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link href={`/listings/${category.slug}`} className="text-cream/80 hover:text-gold">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-sans text-[0.9375rem] font-semibold tracking-normal text-gold">
              Office
            </h2>
            <address className="mt-4 space-y-3 text-sm not-italic text-cream/80">
              <p className="flex gap-3">
                <PinIcon width={16} height={16} className="mt-0.5 shrink-0 text-gold" />
                <span>
                  {site.address.building}, {site.address.line1}
                  <br />
                  {site.address.street}, {site.address.city}, {site.address.country}
                </span>
              </p>
              <p className="flex gap-3">
                <PhoneIcon width={16} height={16} className="mt-0.5 shrink-0 text-gold" />
                <a href={site.phone.href} className="tnum hover:text-gold">
                  {site.phone.display}
                </a>
              </p>
              <p className="flex gap-3">
                <MailIcon width={16} height={16} className="mt-0.5 shrink-0 text-gold" />
                <a href={`mailto:${site.email}`} className="break-all hover:text-gold">
                  {site.email}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-cream/15 pt-6 text-[0.8125rem] text-cream/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p>
            Listings shown are illustrative while the site is in build. Photography is
            licensed stock, not CMT&rsquo;s own property records.
          </p>
        </div>
      </Container>
    </footer>
  );
}
