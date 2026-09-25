import { firmRegistrations } from '@/data/agents';
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
export function StandingSchedule({ className }: { className?: string }) {
  if (firmRegistrations.length === 0) return null;

  return (
    <dl className={cx('max-w-[560px]', className)}>
      {firmRegistrations.map((registration) => (
        <div
          key={registration.authority}
          className="flex items-baseline justify-between gap-5 border-t border-cream/20 py-3"
        >
          <dt className="text-body text-cream/85">
            {registration.authorityFull}
            <span className="mt-0.5 block text-micro text-cream/70">
              {registration.jurisdiction}
            </span>
          </dt>
          <dd
            className={cx(
              'tnum shrink-0 text-right text-body',
              registration.confirmed ? 'text-cream' : 'text-cream/70',
            )}
          >
            {registration.confirmed && registration.number
              ? registration.number
              : '— pending'}
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
export function CredentialLine({ className }: { className?: string }) {
  const confirmed = firmRegistrations.filter((registration) => registration.confirmed);
  if (confirmed.length === 0) return null;

  return (
    <p
      className={cx(
        'mt-7 flex flex-col gap-1 border-t border-rule pt-5 text-micro tracking-[0.06em] text-muted sm:flex-row sm:items-center sm:gap-0',
        className,
      )}
    >
      {confirmed.map((registration, index) => (
        <span key={registration.authority} className="flex items-center">
          {index > 0 && (
            <span aria-hidden="true" className="mx-4 hidden h-3 w-px bg-gold sm:block" />
          )}
          {registration.postNominals
            ? `${registration.authority} ${registration.postNominals}`
            : registration.authorityFull}
        </span>
      ))}
    </p>
  );
}
