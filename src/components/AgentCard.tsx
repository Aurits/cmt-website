import Image from 'next/image';
import { getSite } from '@/lib/content';
import { MailIcon, PhoneIcon, WhatsAppIcon } from '@/components/ui/icons';
import { whatsappHref } from '@/data/site';
import type { Agent } from '@/lib/types';
import { cx } from '@/lib/cx';

function initials(name: string) {
  // An organisation whose name starts with an acronym ("CMT Realtors", the office contact) is
  // marked by the acronym, not by "CR".
  const [first] = name.split(' ');
  if (/^[A-Z]{2,4}$/.test(first)) return first;
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
 * Where CMT has not supplied a headshot we set the colleague's initials as a monogram: we do not
 * stand a stock photograph of an unrelated person in for a named person. The monogram is small and
 * quiet (green initials on stone, a gold rule under them) at every size. In `feature` it used to
 * fill a 4:3 photo plate in solid green, which put two 300px green squares holding two letters
 * each at the head of /about and /about/people, the heaviest shapes on either page. The plate
 * now appears only when there is a photograph to put in it.
 *
 * Qualifications render only once `credentialsConfirmed` is true. Name and role are public record;
 * a professional qualification is a claim about a person's standing and is theirs to confirm.
 * See docs/open-items.md #1.
 */
export async function AgentCard({
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
  const info = await getSite();
  const phoneHref = agent.phone ? `tel:${agent.phone.replace(/\s+/g, '')}` : info.phone.href;
  const phoneDisplay = agent.phone ?? info.phone.display;
  const emailHref = `mailto:${agent.email ?? info.email}`;
  const message = propertyReference
    ? `Hello CMT Realtors, I am interested in property ${propertyReference}.`
    : `Hello CMT Realtors, I would like to speak to ${agent.name}.`;
  const feature = variant === 'feature';

  return (
    <div
      className={cx(
        'flex flex-col rounded-(--radius-card) border border-green/8 bg-white',
        variant === 'contact' ? 'p-6' : 'p-7',
        className,
      )}
    >
      {feature && agent.photo ? (
        <>
          {/* 4:3, not 4:5. A portrait tile forced the directors' grid to be capped at 820px or
              each card would stand over 700px tall, which left a blank third of the page beside
              them. Landscape lets two directors fill the full width at a sensible height, and a
              headshot still crops well to it from the top. */}
          {/* 2:1 on a phone: a 4:3 tile holding only initials was a 250px green square per
              director. A top-cropped headshot still reads at 2:1. */}
          <div className="relative aspect-[2/1] w-full overflow-hidden rounded-[20px] bg-sage-soft sm:aspect-[4/3]">
            <Image
              src={agent.photo}
              alt={agent.name}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover object-top"
            />
          </div>
          <p className="mt-5 font-display text-h3 leading-tight text-green">{agent.name}</p>
          <p className="mt-1 text-body text-muted">{agent.role}</p>
          {agent.based && (
            <p className="mt-0.5 text-micro text-muted">{agent.based}</p>
          )}
        </>
      ) : (
        <div className={cx('flex items-center', feature ? 'gap-5' : 'gap-4')}>
          {agent.photo ? (
            <Image
              src={agent.photo}
              alt={agent.name}
              width={120}
              height={120}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className={cx(
                'flex shrink-0 items-center justify-center rounded-full bg-sage-soft font-display font-semibold text-green ring-2 ring-gold ring-offset-2 ring-offset-white',
                feature ? 'h-20 w-20 text-figure' : 'h-16 w-16 text-xl',
              )}
            >
              {initials(agent.name)}
            </span>
          )}
          <div>
            <p className={cx('font-display leading-tight text-green', feature ? 'text-h3' : 'text-h4')}>
              {agent.name}
            </p>
            <p className={cx('mt-1 text-muted', feature ? 'text-body' : 'text-micro')}>{agent.role}</p>
            {feature && agent.based && <p className="mt-0.5 text-micro text-muted">{agent.based}</p>}
          </div>
        </div>
      )}

      {agent.bio && variant !== 'contact' && (
        <p className="mt-4 text-body leading-relaxed text-muted">{agent.bio}</p>
      )}

      {/* Credentials, gated: the whole block appears once they are confirmed, and not before.
          The unconfirmed branch used to print "awaiting confirmation from Godfrey", an internal
          status in a visitor's space; the open item lives in docs/content-needed.md. */}
      {agent.credentialsConfirmed &&
        agent.qualifications &&
        agent.qualifications.length > 0 &&
        variant !== 'contact' && (
        <div className="mt-5 border-t border-hair pt-4">
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

      {/*
        Contact rows only where they say something new: on the office card a property page shows,
        or for someone with their own number or email. On the team pages every card used to repeat
        the same office line and inbox, six times over.
      */}
      {(variant === 'contact' || agent.phone || agent.email) && (
        <div
          className={cx(
            'space-y-px border-t border-hair pt-4 text-body',
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
          {info.whatsapp && (
            <a
              href={whatsappHref(info.whatsapp, message)}
              className="flex items-center gap-3 py-1.5 text-ink hover:text-green"
            >
              <WhatsAppIcon width={16} height={16} className="text-green/70" />
              WhatsApp
            </a>
          )}
          <a href={emailHref} className="flex items-center gap-3 py-1.5 text-ink hover:text-green">
            <MailIcon width={16} height={16} className="text-green/70" />
            <span className="break-all">{agent.email ?? info.email}</span>
          </a>
        </div>
      )}
    </div>
  );
}
