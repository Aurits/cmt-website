import type { Registration } from '@/lib/types';
import { cx } from '@/lib/cx';

/**
 * The firm's standing, stated the way a valuation report states its own authority: label left,
 * value right, hairline between. It is the first thing on /about because /about is now first in
 * the navigation, and a page in that slot has to earn it in one screen rather than open on a
 * mission statement.
 *
 * UNCONFIRMED ROWS STAY. A registration we have not had confirmed renders as "pending" rather
 * than disappearing — the reader sees the shape of the claim and we do not make it. That is the
 * same posture as the empty testimonials state and the WhatsApp number: where CMT has not
 * supplied something, the UI says so instead of filling the gap. See docs/OPEN-ITEMS.md #1.
 */
export function StandingSchedule({
  registrations,
  className,
}: {
  /** The firm's registrations, one per body: `team.firmRegistrations` (src/lib/content.ts). */
  registrations: Registration[];
  className?: string;
}) {
  if (registrations.length === 0) return null;

  return (
    <dl className={className}>
      {registrations.map((registration) => (
        <div
          key={registration.authority}
          className="flex flex-col items-start gap-2 border-t border-hair py-[13px] min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between min-[420px]:gap-4"
        >
          <dt className="text-small text-green">
            {registration.authorityFull}
            <span className="mt-0.5 block text-[12.5px] text-muted">{registration.jurisdiction}</span>
          </dt>
          {/* Three states: the number once we have it; "Registered" when CMT has confirmed the
              registration but not sent the number; otherwise still awaiting confirmation. Set as
              the report card's tag: a filled pill when confirmed, an outlined one when not. */}
          <dd
            className={cx(
              'tnum shrink-0 rounded-full px-2.5 py-1 text-right text-[11px] font-semibold',
              registration.confirmed ? 'bg-tag text-tag-ink' : 'border border-chip text-muted',
            )}
          >
            {registration.confirmed ? (registration.number ?? 'Registered') : 'Awaiting confirmation'}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * The homepage hero's credential line — three marks on one row, under the CTAs.
 *
 * Returns null until at least one registration is confirmed. A hero that announces chartered
 * status the firm has not verified would be the one unverified claim on a site whose entire
 * argument is that its figures can be checked.
 */
export function CredentialLine({
  registrations,
  className,
}: {
  registrations: Registration[];
  className?: string;
}) {
  const confirmed = registrations.filter((registration) => registration.confirmed);
  if (confirmed.length === 0) return null;

  return (
    <p
      className={cx(
        'mt-7 flex flex-col gap-1 border-t border-hair pt-5 text-micro tracking-[0.06em] text-muted sm:flex-row sm:items-center sm:gap-0',
        className,
      )}
    >
      {confirmed.map((registration, index) => (
        <span key={registration.authority} className="flex items-center">
          {index > 0 && (
            <span aria-hidden="true" className="mx-4 hidden h-3 w-px bg-gold sm:block" />
          )}
          {/* A bare body name under the hero buttons read like a caption with its sentence
              missing; "Registered with the Surveyors Registration Board" says what it means. */}
          {registration.postNominals
            ? `${registration.authority} ${registration.postNominals}`
            : `Registered with the ${registration.authorityFull}`}
        </span>
      ))}
    </p>
  );
}
