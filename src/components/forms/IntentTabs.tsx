import Link from 'next/link';
import { cx } from '@/lib/cx';

/**
 * Three doors.
 *
 * A single form behind a subject dropdown asks the visitor to classify themselves before the page
 * has helped them, and then asks everyone the union of every intent's questions. These are real
 * routes rather than client state, so each is linkable, back-button correct, and can be the
 * destination of a CTA that already knows what the visitor wants.
 */
export const intents = [
  { id: 'valuation', label: 'Request a valuation', href: '/contact/request-a-valuation' },
  { id: 'listing', label: 'List a property', href: '/contact/list-a-property' },
  { id: 'general', label: 'Something else', href: '/contact' },
] as const;

export type IntentId = (typeof intents)[number]['id'];

export function IntentTabs({ active }: { active: IntentId }) {
  return (
    <nav aria-label="What would you like to do">
      {/* A segmented pill control, the masthead nav's shape at a smaller size. */}
      <ul className="flex flex-col gap-1 rounded-[28px] border border-green/12 bg-cream p-[5px] sm:flex-row sm:rounded-full">
        {intents.map((intent) => {
          const isActive = intent.id === active;
          return (
            <li key={intent.id} className="flex-1">
              <Link
                href={intent.href}
                aria-current={isActive ? 'page' : undefined}
                className={cx(
                  'flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-center text-body leading-tight transition-colors',
                  isActive
                    ? 'bg-green font-semibold text-white'
                    : 'font-medium text-green/80 hover:bg-green/7',
                )}
              >
                {intent.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
