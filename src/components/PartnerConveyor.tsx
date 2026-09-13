import Image from 'next/image';
import type { Partner, PartnerGroup } from '@/lib/types';
import { cx } from '@/lib/cx';

/**
 * Client logos on a moving belt.
 *
 * One continuous track of full-colour marks, with a desaturating veil over each side of
 * the frame (see .conveyor in globals.css). Whatever is passing the centre is the only
 * thing at full strength; marks grey out as they drift away. Because there is a single
 * track and the greying is done by the veils rather than by a second copy, the colour and
 * grey states can never drift out of register.
 *
 * The belt is CSS-only — no JavaScript, no animation library — so it costs nothing on a
 * phone, keeps running if hydration fails, and stops completely under
 * prefers-reduced-motion, where it falls back to a centred, full-colour row.
 *
 * Accessibility: the visible track duplicates every logo, which would make a screen reader
 * read the client list twice. The track is therefore aria-hidden and the real list is
 * exposed once, visually hidden, above it.
 */
function ConveyorItem({ partner, clone }: { partner: Partner; clone: boolean }) {
  return (
    // Clones exist only to make the loop seamless. With motion off they are hidden, or
    // the belt would collapse into a wall of the same logos repeated.
    <div className="conveyor__item" data-clone={clone ? 'true' : undefined}>
      <div className="flex h-[92px] w-[190px] items-center justify-center rounded-[2px] border border-rule bg-white px-5 sm:h-[104px] sm:w-[220px]">
        {partner.logo ? (
          <Image
            src={partner.logo}
            alt=""
            width={260}
            height={80}
            className="max-h-[56px] w-auto object-contain sm:max-h-[64px]"
          />
        ) : (
          // No file yet: the name still holds the slot rather than leaving a gap.
          <span className="text-center font-display text-[0.9375rem] leading-tight text-green">
            {partner.shortName ?? partner.name}
          </span>
        )}
      </div>
    </div>
  );
}

export function PartnerConveyor({
  partners,
  reverse = false,
  /** Seconds a mark takes to advance by one slot. Higher is slower and calmer. */
  secondsPerItem = 6.5,
  label,
  className,
}: {
  partners: Partner[];
  reverse?: boolean;
  secondsPerItem?: number;
  /** What this belt is, for screen readers, e.g. "Banks and financial institutions". */
  label: string;
  className?: string;
}) {
  // Short lists are duplicated more so the belt is always wider than any viewport.
  const copies = partners.length < 5 ? 4 : 2;
  const track = Array.from({ length: copies }, () => partners).flat();

  /*
   * The animation travels half the track, which is `copies / 2` sets of marks — so the
   * duration has to account for the number of copies, not just the number of partners.
   * Without this the two-logo government belt ran at double the speed of the others,
   * because it is duplicated four times rather than twice.
   */
  const slotsTravelled = (copies / 2) * partners.length;
  const duration = `${(slotsTravelled * secondsPerItem).toFixed(1)}s`;

  return (
    <div className={className}>
      <ul className="sr-only">
        {partners.map((partner) => (
          <li key={partner.name}>{partner.name}</li>
        ))}
      </ul>

      <div
        aria-hidden="true"
        aria-label={label}
        className={cx('conveyor', reverse && 'conveyor--reverse')}
      >
        <div className="conveyor__track" style={{ '--conveyor-duration': duration } as React.CSSProperties}>
          {track.map((partner, index) => (
            <ConveyorItem
              key={`${partner.name}-${index}`}
              partner={partner}
              clone={index >= partners.length}
            />
          ))}
        </div>
        <span className="conveyor__veil conveyor__veil--left" />
        <span className="conveyor__veil conveyor__veil--right" />
      </div>
    </div>
  );
}

/** Categorised belts, one per client group, alternating direction. */
export function PartnerConveyorGroups({
  groups,
  headingLevel = 'h3',
  showDescriptions = true,
}: {
  groups: PartnerGroup[];
  headingLevel?: 'h2' | 'h3';
  showDescriptions?: boolean;
}) {
  const Heading = headingLevel;

  return (
    <div className="space-y-10 lg:space-y-12">
      {groups.map((group, index) => (
        <section key={group.id} aria-labelledby={`clients-${group.id}`}>
          <div className="flex flex-col gap-2 border-b border-rule pb-3">
            <Heading id={`clients-${group.id}`} className="font-display text-[1.25rem] text-green">
              {group.title}
            </Heading>
            {showDescriptions && (
              <p className="max-w-[64ch] text-[0.9375rem] leading-relaxed text-muted">
                {group.description}
              </p>
            )}
          </div>
          <PartnerConveyor
            partners={group.partners}
            label={group.title}
            reverse={index % 2 === 1}
            className="mt-5"
          />
        </section>
      ))}
    </div>
  );
}
