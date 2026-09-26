'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Select } from '@/components/ui/Select';
import { categories } from '@/data/categories';
import { cities } from '@/data/listings';
import { valuationPurposes } from '@/data/valuations';
import { cx } from '@/lib/cx';

type TabId = 'value' | 'browse' | 'talk';

/**
 * The three things a visitor arrives to do, as a counter across the foot of the hero.
 *
 * Valuation leads, and is the default. It used to be third behind Buy and Rent, which made the
 * homepage argue the opposite of everything else on the site: the nav, the masthead CTA and the
 * whole positioning put the valuation practice first, and then the first control under the
 * headline offered property search.
 *
 * Buy and Rent merged into one tab with a toggle. They ask identical questions and differ by a
 * single parameter, so two tabs spent a third of the counter on a distinction the form could make
 * in a control.
 *
 * "Talk to a valuer" carries no fields at all. Three dropdowns in front of "I would like to speak
 * to someone" is a toll gate, not a form.
 */
const tabs: { id: TabId; label: string; action: string }[] = [
  { id: 'value', label: 'Value a property', action: 'Request a valuation' },
  { id: 'browse', label: 'Buy or rent', action: 'Search properties' },
  { id: 'talk', label: 'Talk to a valuer', action: 'Reach the office' },
];

export function HeroSearchTabs() {
  const router = useRouter();
  const [active, setActive] = useState<TabId>('value');
  const [category, setCategory] = useState('any');
  const [city, setCity] = useState('any');
  const [listingType, setListingType] = useState('sale');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    if (active === 'talk') {
      router.push('/contact');
      return;
    }

    const params = new URLSearchParams();
    if (category !== 'any') params.set('category', category);
    if (city !== 'any') params.set('city', city);

    if (active === 'value') {
      // The hero asks about land and buildings; the other asset classes live on /valuations.
      params.set('asset', 'property');
      router.push(`/contact/request-a-valuation?${params.toString()}`);
      return;
    }

    params.set('type', listingType);
    router.push(`/listings?${params.toString()}`);
  };

  const onTabKey = (event: React.KeyboardEvent, index: number) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    setActive(tabs[next].id);
    tabRefs.current[next]?.focus();
  };

  const current = tabs.find((tab) => tab.id === active)!;

  return (
    <div className="bg-paper shadow-[0_-1px_0_rgba(17,52,27,0.08)]">
      <div role="tablist" aria-label="What would you like to do" className="flex border-b border-rule">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            role="tab"
            id={`hero-tab-${tab.id}`}
            aria-selected={active === tab.id}
            aria-controls="hero-tabpanel"
            tabIndex={active === tab.id ? 0 : -1}
            onClick={() => setActive(tab.id)}
            onKeyDown={(event) => onTabKey(event, index)}
            className={cx(
              // Two-line labels are normal at 390px, so the row centres rather than clips.
              'relative flex min-h-[52px] flex-1 items-center justify-center px-2 py-3 text-center text-micro leading-tight transition-colors sm:px-3 sm:text-body',
              active === tab.id
                ? 'bg-green text-cream'
                : 'text-ink/75 hover:bg-mist hover:text-green',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form
        id="hero-tabpanel"
        role="tabpanel"
        aria-labelledby={`hero-tab-${active}`}
        onSubmit={submit}
        className={cx(
          'gap-3 p-4 sm:gap-4 sm:p-5',
          active === 'talk'
            ? 'flex flex-col sm:flex-row sm:items-center sm:justify-between'
            : 'grid sm:grid-cols-[1fr_1fr_auto] sm:items-end',
        )}
      >
        {active === 'talk' ? (
          <p className="max-w-[54ch] text-body leading-relaxed text-muted">
            No form to start with. Tell us what you are dealing with and a valuer will tell you
            whether it needs an inspection, a desktop opinion, or nothing at all.
          </p>
        ) : (
          <>
            <div>
              <label htmlFor="hero-category" className="mb-1.5 block text-micro text-muted">
                Property type
              </label>
              <Select
                id="hero-category"
                value={category}
                onChange={setCategory}
                options={[
                  { value: 'any', label: 'All types' },
                  ...categories.map((item) => ({ value: item.slug, label: item.name })),
                ]}
              />
            </div>

            <div>
              <label htmlFor="hero-city" className="mb-1.5 block text-micro text-muted">
                {active === 'value' ? 'Where it is' : 'Location'}
              </label>
              <Select
                id="hero-city"
                value={city}
                onChange={setCity}
                options={[
                  { value: 'any', label: 'Anywhere we cover' },
                  ...cities.map((name) => ({ value: name, label: name })),
                ]}
              />
            </div>
          </>
        )}

        {active === 'browse' && (
          <div className="sm:col-span-2 lg:col-span-1">
            <label htmlFor="hero-type" className="mb-1.5 block text-micro text-muted">
              Buying or renting
            </label>
            <Select
              id="hero-type"
              value={listingType}
              onChange={setListingType}
              options={[
                { value: 'sale', label: 'For sale' },
                { value: 'rent', label: 'To let' },
              ]}
            />
          </div>
        )}

        {/* Green, the primary on a light ground, the same as the hero button directly above.
            It was gold, so one screen showed "Request a valuation" in two colours. Gold is the
            primary on dark grounds only: the masthead and the closing banner. */}
        <button
          type="submit"
          className="rounded-control bg-green px-6 py-3 text-body font-medium text-cream transition-colors hover:text-gold"
        >
          {active === 'value' ? 'Request a valuation' : active === 'talk' ? 'Contact us' : 'Search'}
          <span className="sr-only">. {current.action}</span>
        </button>
      </form>

      {active === 'value' && (
        // Hidden on a phone: the /valuations link it offers is one tap away in the menu, and
        // under a full-width button it was a fourth line of small print in the first screen.
        <p className="border-t border-rule px-4 py-3.5 text-micro leading-relaxed text-muted max-sm:hidden sm:px-5">
          Valuing machinery, equipment or shares in a business? Start from{' '}
          <Link href="/valuations" className="text-green underline decoration-gold decoration-2 underline-offset-4">
            all {valuationPurposes.length} valuation purposes
          </Link>
          .
        </p>
      )}
    </div>
  );
}
