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
    <div className="sticky bottom-0 z-10 -mx-4 mt-8 border-t border-rule bg-paper/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p
          className={cx(
            'flex items-center gap-1.5 text-micro',
            justSaved ? 'text-green' : 'text-muted',
          )}
        >
          {justSaved ? (
            <>
              <CheckIcon width={14} height={14} /> Saved
            </>
          ) : dirty ? (
            'Unsaved changes'
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
