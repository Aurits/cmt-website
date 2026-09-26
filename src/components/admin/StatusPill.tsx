import { cx } from '@/lib/cx';

export type PillTone = 'positive' | 'attention' | 'neutral' | 'muted';

const tones: Record<PillTone, string> = {
  positive: 'bg-green/10 text-green border-green/25',
  attention: 'bg-gold/20 text-gold-deep border-gold/40',
  neutral: 'bg-mist text-ink border-rule-strong',
  muted: 'bg-mist text-muted border-rule',
};

/** A control-radius tag for row status, never rounded-brand, since it behaves like a chip. */
export function StatusPill({ tone, children }: { tone: PillTone; children: React.ReactNode }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-control border px-2.5 py-1 text-micro font-medium',
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
