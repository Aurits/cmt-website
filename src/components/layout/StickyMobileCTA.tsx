import { PhoneIcon, ShieldIcon, WhatsAppIcon } from '@/components/ui/icons';
import { getSite } from '@/lib/content';
import { whatsappHref } from '@/data/site';

/**
 * Phones only. Three taps CMT actually wants: call, WhatsApp, book a valuation.
 * Sits above the safe-area inset so it clears the iOS home bar.
 */
export async function StickyMobileCTA() {
  const info = await getSite();
  const items = [
    {
      href: info.phone.href,
      label: 'Call',
      icon: <PhoneIcon width={18} height={18} />,
      srLabel: `Call ${info.phone.display}`,
    },
    {
      href: whatsappHref(info.whatsapp, 'Hello CMT Realtors, I would like to enquire about a property.'),
      label: 'WhatsApp',
      icon: <WhatsAppIcon width={18} height={18} />,
      srLabel: info.whatsapp
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
    // A floating ink pill, the hero design's dark button at full width, clear of the screen edges.
    <div className="fixed inset-x-0 bottom-0 z-(--z-sticky) px-3 pb-[calc(env(safe-area-inset-bottom)+12px)] lg:hidden">
      <ul className="grid grid-cols-3 divide-x divide-white/12 overflow-hidden rounded-full bg-green shadow-[0_18px_40px_-12px_rgba(15,42,26,0.55)]">
        {items.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              className="flex h-14 flex-col items-center justify-center gap-1 text-[12px] font-semibold text-white active:brightness-125"
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
