'use client';

import { useEffect, useRef, useState } from 'react';
import { TrashIcon } from '@/components/admin/icons';
import { cx } from '@/lib/cx';

/**
 * A two-tap delete, in place rather than in a native confirm() dialog — a browser-chrome
 * modal is exactly the "borrowed control" look the brief's design tokens are written to
 * avoid. First tap arms it and swaps the label for three seconds; a second tap within that
 * window commits, otherwise it quietly disarms.
 */
export function ConfirmButton({
  onConfirm,
  label = 'Delete',
  className,
}: {
  onConfirm: () => void;
  label?: string;
  className?: string;
}) {
  const [armed, setArmed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <button
      type="button"
      onClick={() => {
        if (!armed) {
          setArmed(true);
          timer.current = setTimeout(() => setArmed(false), 3000);
          return;
        }
        if (timer.current) clearTimeout(timer.current);
        setArmed(false);
        onConfirm();
      }}
      className={cx(
        'inline-flex items-center gap-1.5 rounded-control border px-3 py-2 text-micro font-medium transition-colors',
        armed
          ? 'border-flag bg-flag/10 text-flag'
          : 'border-rule-strong text-muted hover:border-green/50 hover:text-green',
        className,
      )}
    >
      <TrashIcon width={14} height={14} />
      {armed ? 'Confirm delete?' : label}
    </button>
  );
}
