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
 * Three registers: `feature` for the directors at the head of /about/people, `profile` for
 * everyone below them, `contact` for the property detail sidebar.
 *
 * Where CMT has not supplied a headshot we set the colleague's initials on the brand green — we do
 * not stand a stock photograph of an unrelated person in for a named person. In `feature` the
 * plate takes the same 4:5 portrait ratio as a real photograph would, because a square plate
 * sitting in a row of portraits is the tell that a picture is missing.
 *
 * Qualifications render only once `credentialsConfirmed` is true. Name and role are public record;
 * a professional qualification is a claim about a person's standing and is theirs to confirm.
 * See docs/OPEN-ITEMS.md #1.
 */
export function AgentCard({
  agent,
  variant = 'profile',
  propertyReference,
  className,
}: {
  agent: Agent;
  variant?: 'feature' | 'profile' | 'contact';
  propertyReference?: string;
  className?: string;
}) {
  const phoneHref = agent.phone ? `tel:${agent.phone.replace(/\s+/g, '')}` : site.phone.href;
  const phoneDisplay = agent.phone ?? site.phone.display;
  const emailHref = `mailto:${agent.email ?? site.email}`;
  const message = propertyReference
    ? `Hello CMT Realtors, I am interested in property ${propertyReference}.`
    : `Hello CMT Realtors, I would like to speak to ${agent.name}.`;
  const feature = variant === 'feature';

  return (
    <div
      className={cx(
        'flex flex-col border border-rule bg-paper',
        variant === 'contact' ? 'p-5' : 'p-6',
        className,
      )}
    >
      {feature ? (
        <>
          {/* 4:3, not 4:5. A portrait tile forced the directors' grid to be capped at 820px or
              each card would stand over 700px tall, which left a blank third of the page beside
              them. Landscape lets two directors fill the full width at a sensible height, and a
              headshot still crops well to it from the top. */}
          <div className="relative aspect-[4/3] w-full overflow-hidden border border-rule bg-green">
            {agent.photo ? (
              <Image
                src={agent.photo}
                alt={agent.name}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-top"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex h-full w-full items-center justify-center font-display text-stat text-cream"
              >
                {initials(agent.name)}
              </span>
            )}
          </div>
          <p className="mt-5 font-display text-h3 leading-tight text-green">{agent.name}</p>
          <p className="mt-1 text-body text-muted">{agent.role}</p>
          {agent.based && (
            <p className="mt-0.5 text-micro text-muted">{agent.based}</p>
          )}
        </>
      ) : (
        <div className="flex items-center gap-4">
          {agent.photo ? (
            <Image
              src={agent.photo}
              alt={agent.name}
              width={120}
              height={120}
              className="h-16 w-16 object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex h-16 w-16 shrink-0 items-center justify-center bg-green font-display text-xl text-cream"
            >
              {initials(agent.name)}
            </span>
          )}
          <div>
            <p className="font-display text-h4 leading-tight text-green">{agent.name}</p>
            <p className="mt-1 text-micro text-muted">{agent.role}</p>
          </div>
        </div>
      )}

      {agent.bio && variant !== 'contact' && (
        <p className="mt-4 text-body leading-relaxed text-muted">{agent.bio}</p>
      )}

      {/* Credentials, gated: the whole block appears once they are confirmed, and not before.
          The unconfirmed branch used to print "awaiting confirmation from Godfrey", an internal
          status in a visitor's space; the open item lives in docs/CONTENT-NEEDED.md. */}
      {agent.credentialsConfirmed &&
        agent.qualifications &&
        agent.qualifications.length > 0 &&
        variant !== 'contact' && (
        <div className="mt-5 border-t border-rule pt-4">
          <p className="text-label uppercase tracking-[0.1em] text-muted">Qualifications</p>
          <ul className="mt-2.5 space-y-1.5">
            {agent.qualifications.map((qualification) => (
              <li key={qualification} className="flex gap-2.5 text-body text-ink">
                <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 bg-gold" />
                {qualification}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        className={cx(
          'space-y-px border-t border-rule pt-4 text-body',
          feature ? 'mt-5' : 'mt-5',
        )}
      >
        <a href={phoneHref} className="flex items-center gap-3 py-1.5 text-ink hover:text-green">
          <PhoneIcon width={16} height={16} className="text-green/70" />
          <span className="tnum">{phoneDisplay}</span>
        </a>
        {/* Only once there is a number to message. Without one this row used to read
            "WhatsApp (number pending)", which told a visitor the site was unfinished and gave them
            nothing to act on; phone and email above and below are both real. */}
        {site.whatsapp && (
          <a
            href={whatsappHref(message)}
            className="flex items-center gap-3 py-1.5 text-ink hover:text-green"
          >
            <WhatsAppIcon width={16} height={16} className="text-green/70" />
            WhatsApp
          </a>
        )}
        <a href={emailHref} className="flex items-center gap-3 py-1.5 text-ink hover:text-green">
          <MailIcon width={16} height={16} className="text-green/70" />
          <span className="break-all">{agent.email ?? site.email}</span>
        </a>
      </div>
    </div>
  );
}
