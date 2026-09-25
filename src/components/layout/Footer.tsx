import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  TikTokIcon,
  WhatsAppIcon,
  XIcon,
  YouTubeIcon,
} from '@/components/ui/icons';
import { categories } from '@/data/categories';
import { aboutPages, nav, site, whatsappHref } from '@/data/site';

/**
 * WhatsApp always links: without a number it routes to /contact#whatsapp, like every other
 * WhatsApp CTA. The rest link only once site.social holds a real profile URL.
 */
const socialLinks = [
  { label: 'Facebook', href: site.social.facebook, Icon: FacebookIcon },
  { label: 'X', href: site.social.x, Icon: XIcon },
  { label: 'Instagram', href: site.social.instagram, Icon: InstagramIcon },
  { label: 'LinkedIn', href: site.social.linkedin, Icon: LinkedInIcon },
  { label: 'YouTube', href: site.social.youtube, Icon: YouTubeIcon },
  { label: 'TikTok', href: site.social.tiktok, Icon: TikTokIcon },
  {
    label: 'WhatsApp',
    href: whatsappHref('Hello CMT Realtors, I have a property enquiry.'),
    Icon: WhatsAppIcon,
  },
];

// 44px on touch screens, the minimum comfortable tap target; 36px from sm up, where a pointer
// does the aiming and the row should not shout.
const socialClass =
  'flex h-11 w-11 items-center justify-center rounded-control border border-cream/25 text-cream/85 sm:h-9 sm:w-9';

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
            <ul aria-label="Follow CMT Realtors" className="mt-6 flex flex-wrap gap-2">
              {socialLinks.map(({ label, href, Icon }) => (
                <li key={label}>
                  {href ? (
                    <a
                      href={href}
                      aria-label={label}
                      title={label}
                      {...(href.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
                      className={`${socialClass} transition-colors hover:border-gold hover:text-gold`}
                    >
                      <Icon width={16} height={16} />
                    </a>
                  ) : (
                    <span
                      title={`${label} (link coming soon)`}
                      className={`${socialClass} cursor-default opacity-40`}
                    >
                      <Icon width={16} height={16} />
                      <span className="sr-only">{label}, link coming soon</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-sans text-label font-semibold uppercase tracking-[0.12em] text-gold">
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
            <h2 className="font-sans text-label font-semibold uppercase tracking-[0.12em] text-gold">
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
            <h2 className="font-sans text-label font-semibold uppercase tracking-[0.12em] text-gold">
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
