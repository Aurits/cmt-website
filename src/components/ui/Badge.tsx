import { cx } from '@/lib/cx';

type Tone = 'type' | 'category' | 'categoryOnDark';

const tones: Record<Tone, string> = {
  // "For sale" / "For rent" / "To let" — the gold, always-solid tag, everywhere it appears.
  type: 'bg-gold font-medium text-green',
  // Property class ("Residential", "Commercial"...) on paper or on a photograph without a
  // scrim behind it — solid green reads clearly against either.
  category: 'bg-green text-cream',
  // The same category tag, but over a photograph that already carries a dark scrim
  // (FeaturedCarousel): a second solid green box there reads as a stacked block rather
  // than a tag, so this is outlined instead.
  categoryOnDark: 'border border-cream/40 text-cream',
};

/**
 * The property-type and category chips shown over a listing photograph or beside its
 * price — "Residential", "For sale". One shared component so the three places these
 * appear (PropertyCard, FeaturedCarousel, the property detail page) stay in step rather
 * than drifting into three slightly different tags.
 */
export function Badge({
  tone,
  children,
  className,
}: {
  tone: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-brand px-3 py-1.5 text-[0.75rem]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
