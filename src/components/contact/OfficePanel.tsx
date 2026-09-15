import { Button } from '@/components/ui/Button';
import { ClockIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from '@/components/ui/icons';
import { kenyaOffices, site, ugandaOffices, whatsappHref } from '@/data/site';

/**
 * The office card that sits beside every contact form. Uganda expanded, Kenya as a collapsed
 * summary linking through — nine offices listed in full here would bury the one you are actually
 * trying to reach.
 */
export function OfficePanel() {
  return (
    <div>
      <div className="border border-rule bg-paper p-6">
        <h2 className="text-[1.375rem] text-green">Our office</h2>

        <address className="mt-5 space-y-4 text-[0.9375rem] not-italic">
          <p className="flex gap-3.5">
            <PinIcon width={18} height={18} className="mt-0.5 shrink-0 text-gold-deep" />
            <span className="text-ink">
              {site.address.building}
              <br />
              {site.address.line1}
              <br />
              {site.address.street}, {site.address.city}, {site.address.country}
            </span>
          </p>
          <p className="flex gap-3.5">
            <PhoneIcon width={18} height={18} className="mt-0.5 shrink-0 text-gold-deep" />
            <a href={site.phone.href} className="tnum text-ink hover:text-green">
              {site.phone.display}
            </a>
          </p>
          <p className="flex gap-3.5">
            <MailIcon width={18} height={18} className="mt-0.5 shrink-0 text-gold-deep" />
            <a href={`mailto:${site.email}`} className="break-all text-ink hover:text-green">
              {site.email}
            </a>
          </p>
        </address>

        <div id="whatsapp" className="mt-6 scroll-mt-32 border-t border-rule pt-5">
          <h3 className="flex items-center gap-2.5 font-display text-[1.0625rem] text-green">
            <WhatsAppIcon width={18} height={18} className="text-gold-deep" />
            WhatsApp
          </h3>
          {site.whatsapp ? (
            <div className="mt-3">
              <Button href={whatsappHref()} variant="primary" size="sm">
                Open a WhatsApp chat
              </Button>
            </div>
          ) : (
            <p className="mt-2 max-w-[46ch] text-[0.875rem] leading-relaxed text-muted">
              CMT publishes a landline, which cannot receive WhatsApp. Once the office mobile is
              confirmed, every WhatsApp button on the site starts working from one setting. Until
              then, please call or email.
            </p>
          )}
        </div>

        <div className="mt-6 border-t border-rule pt-5">
          <h3 className="flex items-center gap-2.5 font-display text-[1.0625rem] text-green">
            <ClockIcon width={18} height={18} className="text-gold-deep" />
            Office hours
          </h3>
          <dl className="mt-3">
            {site.hours.map((entry) => (
              <div key={entry.days} className="schedule-row text-[0.9375rem]">
                <dt className="text-muted">{entry.days}</dt>
                <dd className="tnum text-ink">{entry.time}</dd>
              </div>
            ))}
          </dl>
          {!site.hoursConfirmed && (
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted">
              Hours shown are a placeholder and need confirming by CMT.
            </p>
          )}
        </div>
      </div>

      {/* The other offices, briefly. */}
      <div className="mt-6 border border-rule bg-paper p-6">
        <h2 className="font-display text-[1.125rem] text-green">Elsewhere</h2>
        <dl className="mt-4">
          <div className="schedule-row text-[0.9375rem]">
            <dt className="text-muted">Uganda</dt>
            <dd className="text-right text-ink">
              {ugandaOffices.map((office) => office.city).join(', ')}
            </dd>
          </div>
          <div className="schedule-row text-[0.9375rem]">
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
