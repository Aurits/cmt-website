import { Container } from '@/components/ui/Container';
import { cx } from '@/lib/cx';

/**
 * The page rhythm of the hero design (Hero.html), shared by every page.
 *
 * The whole site sits on one ground, the design's paper. Sections are not coloured bands; they
 * are spaced blocks on the paper (`Section`), and where a group needs setting apart it goes on a
 * rounded `Plate` inset in the column, the way the hero's report card sits on its sage plate.
 * Three plate tones and no others: sage (the recessed, informational one), ink (the single dark
 * moment on a page, used at most once) and white (a card that holds a form or a table).
 */
export function Section({
  children,
  className,
  containerClassName,
  id,
  labelledBy,
  clip = false,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
  labelledBy?: string;
  /** Clip sideways overflow, for plates whose offset back plate reaches past the gutter. */
  clip?: boolean;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cx('pb-16 lg:pb-24', clip && 'overflow-x-clip', className)}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

const tones = {
  sage: 'bg-sage-soft',
  ink: 'bg-green text-white',
  white: 'border border-green/8 bg-white',
};

export function Plate({
  children,
  tone = 'sage',
  className,
  disc = false,
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
  className?: string;
  /** The gold disc in the top-right corner, the hero card's mark. For the ink plate. */
  disc?: boolean;
}) {
  return (
    <div
      className={cx(
        'relative overflow-hidden rounded-(--radius-plate) px-6 py-12 min-[601px]:px-12 lg:py-16',
        tones[tone],
        className,
      )}
    >
      {disc && (
        <div aria-hidden="true" className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gold/90" />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

/** A white card on the paper: the unit every list of things on the site is built from. */
export const cardClass = 'rounded-(--radius-card) border border-green/8 bg-white';
