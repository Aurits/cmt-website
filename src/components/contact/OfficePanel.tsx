import { Button } from '@/components/ui/Button';
import { getSite } from '@/lib/content';
import { ClockIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from '@/components/ui/icons';
import { kenyaOffices, ugandaOffices, whatsappHref } from '@/data/site';

/**
 * The office card that sits beside every contact form. Uganda expanded, Kenya as a collapsed
 * summary linking through — nine offices listed in full here would bury the one you are actually
 * trying to reach.
 */
export async function OfficePanel() {
  const info = await getSite();
  return (
    <div>
      <div className="rounded-(--radius-card) border border-green/8 bg-white p-6 sm:p-7">
        <h2 className="font-display text-h3 font-semibold text-green">Our office</h2>

        <address className="mt-5 space-y-4 text-body not-italic">
          <p className="flex gap-3.5">
            <PinIcon width={18} height={18} className="mt-0.5 shrink-0 text-moss" />
            <span className="text-ink">
              {info.address.building}
              <br />
              {info.address.line1}
              <br />
              {info.address.street}, {info.address.city}, {info.address.country}
            </span>
          </p>
          <p className="flex gap-3.5">
            <PhoneIcon width={18} height={18} className="mt-0.5 shrink-0 text-moss" />
            <a href={info.phone.href} className="tnum text-ink hover:text-green">
              {info.phone.display}
            </a>
          </p>
          <p className="flex gap-3.5">
            <MailIcon width={18} height={18} className="mt-0.5 shrink-0 text-moss" />
            <a href={`mailto:${info.email}`} className="break-all text-ink hover:text-green">
              {info.email}
            </a>
          </p>
        </address>

        <div id="whatsapp" className="mt-6 scroll-mt-32 border-t border-hair pt-5">
          <h3 className="flex items-center gap-2.5 font-display text-lead font-semibold text-green">
            <WhatsAppIcon width={18} height={18} className="text-moss" />
            WhatsApp
          </h3>
          {info.whatsapp ? (
            <div className="mt-3">
              <Button href={whatsappHref(info.whatsapp)} variant="primary" size="sm">
                Open a WhatsApp chat
              </Button>
            </div>
          ) : (
            <p className="mt-2 max-w-[46ch] text-body leading-relaxed text-muted">
              WhatsApp is not available on our office line yet. Please call or email instead, and
              we will reply the same working day.
            </p>
          )}
        </div>

        <div className="mt-6 border-t border-hair pt-5">
          <h3 className="flex items-center gap-2.5 font-display text-lead font-semibold text-green">
            <ClockIcon width={18} height={18} className="text-moss" />
            Office hours
          </h3>
          <dl className="mt-3">
            {info.hours.map((entry) => (
              <div key={entry.days} className="schedule-row text-body">
                <dt className="text-muted">{entry.days}</dt>
                <dd className="tnum text-ink">{entry.time}</dd>
              </div>
            ))}
          </dl>
          {!info.hoursConfirmed && (
            <p className="mt-3 text-micro leading-relaxed text-muted">
              {/* Addressed to the visitor. It used to read "Hours shown are a placeholder and
                  need confirming by CMT", a note to the client printed on the public page. The
                  open item itself lives in docs/content-needed.md. */}
              Please call ahead to confirm opening hours before you visit.
            </p>
          )}
        </div>
      </div>

      {/* The other offices, briefly. */}
      <div className="mt-5 rounded-[24px] bg-sage-soft p-6 sm:p-7">
        <h2 className="font-display text-h4 font-semibold text-green">Elsewhere</h2>
        <dl className="mt-4">
          <div className="schedule-row text-body">
            <dt className="text-muted">Uganda</dt>
            <dd className="text-right text-ink">
              {ugandaOffices.map((office) => office.city).join(', ')}
            </dd>
          </div>
          <div className="schedule-row text-body">
            <dt className="text-muted">Kenya</dt>
            <dd className="text-right text-ink">
              {kenyaOffices.map((office) => office.city).join(', ')}
            </dd>
          </div>
        </dl>
        <div className="mt-4">
          <Button href="/about/offices" variant="quiet" size="sm">
            All our offices
          </Button>
        </div>
      </div>
    </div>
  );
}
