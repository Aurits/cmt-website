'use client';

import { useAdmin } from '@/lib/admin/store';
import { CheckIcon } from '@/components/admin/icons';
import { CloseIcon } from '@/components/ui/icons';

/**
 * What happened to the last change.
 *
 * Saves are optimistic: the screen updates before the write completes, which is what stops the
 * CMS feeling like a form. The cost of that is a failure mode where the row quietly reverts and
 * the editor has no idea their edit did not survive, which is the worst way for a tool like this
 * to behave. The store already rolled the change back and recorded why; this is what says so.
 *
 * Fixed to the bottom rather than inline, because a save can be triggered from a table row, a
 * form, or a reorder button, and the message has to be in one predictable place regardless.
 */
export function SaveStatus() {
  const { saving, error, dismissError } = useAdmin();

  if (error) {
    return (
      <div
        role="alert"
        className="fixed bottom-4 left-1/2 z-40 w-[min(34rem,calc(100vw-2rem))] -translate-x-1/2 border-l-[3px] border-flag bg-paper px-4 py-3 shadow-[0_18px_40px_-18px_rgba(17,52,27,0.45)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-body font-medium text-flag">That change was not saved</p>
            <p className="mt-1 text-micro leading-relaxed text-muted">
              {error} The screen has been put back to what is actually stored, so nothing here is
              showing an edit that does not exist.
            </p>
          </div>
          <button
            type="button"
            onClick={dismissError}
            aria-label="Dismiss"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-control border border-rule text-muted transition-colors hover:border-flag hover:text-flag"
          >
            <CloseIcon width={14} height={14} />
          </button>
        </div>
      </div>
    );
  }

  if (saving) {
    return (
      <p
        aria-live="polite"
        className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 border border-rule bg-paper px-3 py-1.5 text-micro text-muted"
      >
        Saving…
      </p>
    );
  }

  // Nothing to say. aria-live still needs a node to live in, so the region stays mounted.
  return (
    <p aria-live="polite" className="sr-only">
      <CheckIcon className="hidden" /> All changes saved
    </p>
  );
}
