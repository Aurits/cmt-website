import Link from 'next/link';
import { getSite } from '@/lib/content';
import { Container } from '@/components/ui/Container';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  ShieldIcon,
  TikTokIcon,
  XIcon,
  YouTubeIcon,
} from '@/components/ui/icons';
import { Wordmark } from '@/components/layout/Wordmark';
import { categories } from '@/data/categories';
import { aboutPages, nav, site } from '@/data/site';
import { valuationPurposes } from '@/data/valuations';

// font-sans: headings take the display serif site-wide, and these are labels, not headings.
const headingClass = 'font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-gold';
const linkClass = 'text-white/75 transition-colors hover:text-gold';

/*
 * Where to follow CMT. An account with no URL yet still shows, dimmed and labelled, rather than
 * disappearing: where CMT has not supplied something, the UI says so. Paste a URL into
 * site.social and the icon goes live. See docs/open-items.md #13.
 */
const socialLinks = [
  { label: 'Facebook', href: site.social.facebook, Icon: FacebookIcon },
  { label: 'X', href: site.social.x, Icon: XIcon },
  { label: 'Instagram', href: site.social.instagram, Icon: InstagramIcon },
  { label: 'LinkedIn', href: site.social.linkedin, Icon: LinkedInIcon },
  { label: 'YouTube', href: site.social.youtube, Icon: YouTubeIcon },
  { label: 'TikTok', href: site.social.tiktok, Icon: TikTokIcon },
];

/**
 * The site footer, in the hero design's language (Hero.html): the ink of its utility strip, its
 * rounds and its gold.
 *
 * It is one ink band whose top corners are rounded at the design's plate radius (40px), so the
 * page above appears to rest on it, the way the report card rests on its back plate in the hero.
 * Inside: the light wordmark with the one-line description and the regulator as a pill, then
 * four columns (valuations first, because the firm is a valuation firm first), then the social
 * accounts as round buttons, the same 44px circle as the masthead's WhatsApp button.
 *
 * Phones get two columns, not one: stacked, the lists made the footer longer than most pages.
 * Site and Property types are hidden there, since the menu one tap away lists every page; they
 * stay in the markup, so they are still crawled.
 */
export async function Footer() {
  const info = await getSite();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-cream">
      <div className="rounded-t-(--radius-plate) bg-green text-white">
        <Container className="pt-16 pb-8 lg:pt-20">
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-8 lg:grid-cols-12">
            <div className="col-span-2 lg:col-span-3">
              <Link href="/" aria-label={`${site.name}, home`} className="inline-block">
                <Wordmark tone="light" />
              </Link>
              <p className="mt-6 max-w-[34ch] text-body leading-relaxed text-white/75">
                Property valuation and advisory in Uganda. We put a figure on property that a
                bank will lend against.
              </p>
              <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[13px] text-white/85">
                <ShieldIcon width={16} height={16} className="shrink-0 text-gold" />
                Regulated by the {site.regulator}
              </p>
            </div>

            <div className="max-sm:col-span-2 lg:col-span-2">
              <h2 className={headingClass}>Valuations</h2>
              <ul className="mt-5 space-y-3 text-body">
                {valuationPurposes.map((purpose) => (
                  <li key={purpose.slug}>
                    <Link href={`/valuations/${purpose.slug}`} className={linkClass}>
                      {purpose.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="max-sm:hidden lg:col-span-2">
              <h2 className={headingClass}>Property types</h2>
              <ul className="mt-5 space-y-3 text-body">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link href={`/listings/${category.slug}`} className={linkClass}>
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <nav aria-label="Footer" className="max-sm:hidden lg:col-span-2">
              <h2 className={headingClass}>Company</h2>
              <ul className="mt-5 space-y-3 text-body">
                {nav
                  .filter((item) => item.href !== '/')
                  .map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className={linkClass}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                {aboutPages.map((page) => (
                  <li key={page.href}>
                    <Link href={page.href} className={linkClass}>
                      {page.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Full width on a phone: at half width the email address broke mid-word. */}
            <div className="col-span-2 lg:col-span-3">
              <h2 className={headingClass}>Office</h2>
              <address className="mt-5 space-y-3.5 text-body not-italic text-white/75">
                <p className="flex gap-3">
                  <PinIcon width={16} height={16} className="mt-1 shrink-0 text-gold" />
                  <span>
                    {info.address.building}, {info.address.line1}, {info.address.street},{' '}
                    {info.address.city}
                  </span>
                </p>
                <p className="flex gap-3">
                  <PhoneIcon width={16} height={16} className="mt-1 shrink-0 text-gold" />
                  <a href={info.phone.href} className="tnum hover:text-gold">
                    {info.phone.display}
                  </a>
                </p>
                <p className="flex gap-3">
                  <MailIcon width={16} height={16} className="mt-1 shrink-0 text-gold" />
                  <a href={`mailto:${info.email}`} className="break-all hover:text-gold">
                    {info.email}
                  </a>
                </p>
              </address>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-6 border-t border-white/12 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <ul aria-label="Follow CMT Realtors" className="flex flex-wrap gap-2">
              {socialLinks.map(({ label, href, Icon }) => (
                <li key={label}>
                  {href ? (
                    <a
                      href={href}
                      aria-label={label}
                      title={label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/85 transition-colors hover:border-gold hover:text-gold"
                    >
                      <Icon width={16} height={16} />
                    </a>
                  ) : (
                    <span
                      title={`${label} (link coming soon)`}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/35"
                    >
                      <Icon width={16} height={16} />
                      <span className="sr-only">{label}, link coming soon</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <div className="text-[13px] text-white/60 sm:text-right">
              <p>
                © {year} {site.name}. All rights reserved.
              </p>
              <p className="mt-1 max-w-[62ch]">
                Listings shown are illustrative while the site is in build. Photography is
                licensed stock, not CMT&rsquo;s own property records.
              </p>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
