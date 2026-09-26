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
    <nav aria-label="What would you like to do" className="border border-rule bg-paper">
      <ul className="flex flex-col sm:flex-row">
        {intents.map((intent) => {
          const isActive = intent.id === active;
          return (
            <li key={intent.id} className="flex-1">
              <Link
                href={intent.href}
                aria-current={isActive ? 'page' : undefined}
                className={cx(
                  'flex min-h-[52px] items-center justify-center px-4 py-3 text-center text-body leading-tight transition-colors',
                  'border-b border-rule last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0',
                  isActive
                    ? 'bg-green text-cream'
                    : 'text-ink/75 hover:bg-mist hover:text-green',
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
