import { PhoneIcon, ShieldIcon, WhatsAppIcon } from '@/components/ui/icons';
import { site, whatsappHref } from '@/data/site';

/**
 * Phones only. Three taps CMT actually wants: call, WhatsApp, book a valuation.
 * Sits above the safe-area inset so it clears the iOS home bar.
 */
export function StickyMobileCTA() {
  const items = [
    {
      href: site.phone.href,
      label: 'Call',
      icon: <PhoneIcon width={18} height={18} />,
      srLabel: `Call ${site.phone.display}`,
    },
    {
      href: whatsappHref('Hello CMT Realtors, I would like to enquire about a property.'),
      label: 'WhatsApp',
      icon: <WhatsAppIcon width={18} height={18} />,
      srLabel: site.whatsapp
        ? 'Message us on WhatsApp'
        : 'WhatsApp number pending. Opens the contact page',
    },
    {
      href: '/contact/request-a-valuation',
      label: 'Valuation',
      icon: <ShieldIcon width={18} height={18} />,
      srLabel: 'Request a valuation',
    },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gold/40 bg-green pb-[env(safe-area-inset-bottom)] lg:hidden">
      <ul className="grid grid-cols-3 divide-x divide-cream/15">
        {items.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              className="flex h-14 flex-col items-center justify-center gap-1 text-label text-cream active:brightness-125"
            >
              <span className="text-gold">{item.icon}</span>
              <span>{item.label}</span>
              <span className="sr-only">{item.srLabel}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
