import { cx } from '@/lib/cx';

/**
 * Section opener. The short gold rule is the site's one recurring ornament — it marks
 * the start of a section the way a stamp marks the start of a schedule. No all-caps
 * eyebrow, and the heading carries the whole message on its own.
 */
export function SectionHeading({
  title,
  lead,
  leadShort,
  action,
  align = 'left',
  onDark = false,
  className,
  id,
}: {
  title: string;
  lead?: string;
  /**
   * The lead as it should read on a phone, where it replaces `lead` below 640px. One sentence,
   * written to stand on its own rather than cut from the long one. Leave it out and the full
   * lead shows everywhere, which is right for anything already short. See "THE MOBILE SYSTEM"
   * in globals.css.
   */
  leadShort?: string;
  action?: React.ReactNode;
  align?: 'left' | 'center';
  onDark?: boolean;
  className?: string;
  id?: string;
}) {
  return (
    <div
      className={cx(
        'flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'sm:flex-col sm:items-center sm:text-center',
        className,
      )}
    >
      {/*
        The measure lives on the title and the lead separately, each in its own units.

        It used to sit on this wrapper as max-w-[42ch], and ch is relative to the element's own
        font size: the wrapper inherits body text, so 42ch came to about 370px, and a heading
        set at text-h2 inside it was being broken over two and three lines ("Five kinds of /
        property, five / kinds of question") while the button beside it floated alone across
        a wide empty gap. Now the heading takes a width sized for display type and balances
        its lines, and the lead keeps a reading measure of its own.
      */}
      <div className={cx('min-w-0', align === 'center' && 'mx-auto')}>
        <span
          aria-hidden="true"
          className={cx('mb-5 block h-[3px] w-10 bg-gold', align === 'center' && 'mx-auto')}
        />
        <h2
          id={id}
          className={cx(
            'max-w-[24ch] text-h2 text-balance',
            align === 'center' && 'mx-auto',
            onDark ? 'text-cream' : 'text-green',
          )}
        >
          {title}
        </h2>
        {lead && (
          <p
            className={cx(
              'mt-4 max-w-[60ch] text-lead leading-relaxed text-pretty',
              align === 'center' && 'mx-auto',
              onDark ? 'text-cream/80' : 'text-muted',
            )}
          >
            {/* Two spans rather than two paragraphs, so the spacing is identical and a screen
                reader, which skips display:none, only ever hears the one on screen. */}
            {leadShort ? (
              <>
                <span className="sm:hidden">{leadShort}</span>
                <span className="max-sm:hidden">{lead}</span>
              </>
            ) : (
              lead
            )}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
