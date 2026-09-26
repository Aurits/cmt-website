import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { MailIcon, PhoneIcon, PinIcon, ShieldIcon } from '@/components/ui/icons';
import { categories } from '@/data/categories';
import { aboutPages, nav, site } from '@/data/site';
import { valuationPurposes } from '@/data/valuations';

const headingClass =
  'font-sans text-label font-semibold uppercase tracking-[0.12em] text-gold';

/**
 * The site footer.
 *
 * Two changes worth recording, because both were gaps rather than preferences.
 *
 * THE SOCIAL ROW MOVED TO THE MASTHEAD (Header.tsx). It sat here, at the very bottom of every
 * page, which is where a link goes when nobody expects it to be used. The utility strip already
 * carries the phone number and the email address, and a social profile is the same kind of
 * thing: a way to reach CMT. Putting all of them in one rail means there is one answer to
 * "where do I find them", at the top, before the reader has scrolled anything.
 *
 * VALUATIONS NOW HAS A COLUMN. It did not, which was the odd part: the footer gave five links
 * to property types and none at all to valuation, in the footer of a firm whose own navigation
 * and homepage both argue that it is a valuation firm first and an agency second. Every other
 * surface on the site says the same thing; this one quietly said the opposite.
 *
 * The grid is twelve columns rather than four named fractions, so a fifth column could be added
 * without re-tuning the other four by eye.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    // Footer carries the mark too, so it shares the masthead green; the gold hairline
    // separates it from whatever green CTA banner sits immediately above.
    <footer className="border-t border-gold/30 bg-green text-cream">
      <Container className="py-14 lg:py-16">
        {/* Two columns from the smallest screen, not one: stacked, the four link lists made the
            footer 1,700px on a phone, longer than most of the pages above it. The brand block
            takes the full width; the lists pair up beneath it. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-12">
          <div className="col-span-2 lg:col-span-3">
            <Image
              src="/brand/cmt-logo.png"
              alt={site.name}
              width={900}
              height={431}
              className="-ml-4 h-14 w-auto"
            />
            <p className="mt-5 max-w-[34ch] text-body leading-relaxed text-cream/75">
              Valuation and property consultancy. We put a figure on property that a bank will
              lend against.
            </p>
            {/* The standing, restated at the foot of the page. It is the claim the whole site
                rests on and it costs one line to repeat where a reader ends up. */}
            <p className="mt-6 flex items-center gap-2.5 border-t border-cream/15 pt-5 text-micro text-cream/70">
              <ShieldIcon width={16} height={16} className="shrink-0 text-gold" />
              Regulated by the {site.regulator}
            </p>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2">
            <h2 className={headingClass}>Site</h2>
            <ul className="mt-4 space-y-2.5 text-body">
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

          <div className="lg:col-span-2">
            <h2 className={headingClass}>Valuations</h2>
            {/* The purposes, not the asset classes: a visitor arrives knowing what the figure
                is for, rarely knowing which of our three asset types it falls under. Same axis
                the masthead menu and the /valuations matrix lead with. */}
            <ul className="mt-4 space-y-2.5 text-body">
              {valuationPurposes.map((purpose) => (
                <li key={purpose.slug}>
                  <Link
                    href={`/valuations/${purpose.slug}`}
                    className="text-cream/80 hover:text-gold"
                  >
                    {purpose.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className={headingClass}>Property types</h2>
            <ul className="mt-4 space-y-2.5 text-body">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link href={`/listings/${category.slug}`} className="text-cream/80 hover:text-gold">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Full width on a phone: at half width the email address broke mid-word. */}
          <div className="col-span-2 lg:col-span-3">
            <h2 className={headingClass}>Office</h2>
            <address className="mt-4 space-y-3 text-body not-italic text-cream/80">
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

        <div className="mt-12 flex flex-col gap-3 border-t border-cream/15 pt-6 text-micro text-cream/60 sm:flex-row sm:items-center sm:justify-between">
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
