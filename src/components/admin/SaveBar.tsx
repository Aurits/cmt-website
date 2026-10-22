'use client';

import { Button } from '@/components/ui/Button';
import { CheckIcon } from '@/components/admin/icons';
import { cx } from '@/lib/cx';

/** Sticky footer for an edit form: save state on the left, actions on the right. */
export function SaveBar({
  dirty,
  justSaved,
  onSave,
  cancelHref,
  extra,
}: {
  dirty: boolean;
  justSaved: boolean;
  onSave: () => void;
  cancelHref: string;
  extra?: React.ReactNode;
}) {
  return (
    // Full width of the content column: the negative margins match AdminShell's main padding.
    <div className="sticky bottom-0 z-10 -mx-4 mt-8 border-t border-green/10 bg-white/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-7 lg:px-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p
          className={cx(
            'flex items-center gap-2 text-small',
            justSaved ? 'text-moss' : dirty ? 'text-green' : 'text-muted',
          )}
        >
          {justSaved ? (
            <>
              <CheckIcon width={14} height={14} /> Saved
            </>
          ) : dirty ? (
            <>
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-gold" /> Unsaved changes
            </>
          ) : (
            'No changes yet'
          )}
        </p>
        <div className="flex items-center gap-3">
          {extra}
          <Button href={cancelHref} variant="outline" size="sm">
            Cancel
          </Button>
          <Button type="button" onClick={onSave} variant="primary" size="sm">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
