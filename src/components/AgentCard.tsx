import Image from 'next/image';
import { MailIcon, PhoneIcon, WhatsAppIcon } from '@/components/ui/icons';
import { site, whatsappHref } from '@/data/site';
import type { Agent } from '@/lib/types';
import { cx } from '@/lib/cx';

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('');
}

/**
 * Two registers: `profile` for the team section, `contact` for the property detail
 * sidebar. Where CMT has not supplied a headshot we set the colleague's initials on the
 * brand green — we do not stand a stock photograph of an unrelated person in for a
 * named person.
 */
export function AgentCard({
  agent,
  variant = 'profile',
  propertyReference,
  className,
}: {
  agent: Agent;
  variant?: 'profile' | 'contact';
  propertyReference?: string;
  className?: string;
}) {
  const phoneHref = agent.phone ? `tel:${agent.phone.replace(/\s+/g, '')}` : site.phone.href;
  const phoneDisplay = agent.phone ?? site.phone.display;
  const emailHref = `mailto:${agent.email ?? site.email}`;
  const message = propertyReference
    ? `Hello CMT Realtors, I am interested in property ${propertyReference}.`
    : `Hello CMT Realtors, I would like to speak to ${agent.name}.`;

  return (
    <div
      className={cx(
        'flex flex-col rounded-[2px] border border-rule bg-paper',
        variant === 'contact' ? 'p-5' : 'p-6',
        className,
      )}
    >
      <div className="flex items-center gap-4">
        {agent.photo ? (
          <Image
            src={agent.photo}
            alt={agent.name}
            width={120}
            height={120}
            className="h-16 w-16 rounded-[2px] object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[2px] bg-green font-display text-xl text-cream"
          >
            {initials(agent.name)}
          </span>
        )}
        <div>
          <p className="font-display text-[1.1875rem] leading-tight text-green">{agent.name}</p>
          <p className="mt-1 text-[0.8125rem] text-muted">{agent.role}</p>
        </div>
      </div>

      {agent.bio && variant === 'profile' && (
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">{agent.bio}</p>
      )}

      <div className="mt-5 space-y-px border-t border-rule pt-4 text-[0.9375rem]">
        <a href={phoneHref} className="flex items-center gap-3 py-1.5 text-ink hover:text-green">
          <PhoneIcon width={16} height={16} className="text-green/70" />
          <span className="tnum">{phoneDisplay}</span>
        </a>
        <a
          href={whatsappHref(message)}
          className="flex items-center gap-3 py-1.5 text-ink hover:text-green"
        >
          <WhatsAppIcon width={16} height={16} className="text-green/70" />
          WhatsApp
          {!site.whatsapp && <span className="text-[0.75rem] text-muted">(number pending)</span>}
        </a>
        <a href={emailHref} className="flex items-center gap-3 py-1.5 text-ink hover:text-green">
          <MailIcon width={16} height={16} className="text-green/70" />
          <span className="break-all">{agent.email ?? site.email}</span>
        </a>
      </div>
    </div>
  );
}
