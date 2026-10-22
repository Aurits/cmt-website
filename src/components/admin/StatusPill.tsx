import { cx } from '@/lib/cx';

export type PillTone = 'positive' | 'attention' | 'neutral' | 'muted';

const tones: Record<PillTone, string> = {
  // The admin design's tags: sage for good, pale gold for needs-attention, outlined otherwise.
  positive: 'bg-sage-soft text-moss border-transparent',
  attention: 'bg-tag text-tag-ink border-transparent',
  neutral: 'bg-white text-green border-chip',
  muted: 'bg-cream text-muted border-hair',
};

/** A control-radius tag for row status, never rounded-brand, since it behaves like a chip. */
export function StatusPill({ tone, children }: { tone: PillTone; children: React.ReactNode }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[12px] font-semibold whitespace-nowrap',
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
