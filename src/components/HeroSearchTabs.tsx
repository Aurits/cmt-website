'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Select } from '@/components/ui/Select';
import { categories } from '@/data/categories';
import { cities } from '@/data/listings';
import { cx } from '@/lib/cx';

type TabId = 'buy' | 'rent' | 'value';

const tabs: { id: TabId; label: string; action: string }[] = [
  { id: 'buy', label: 'Buy', action: 'Search properties for sale' },
  { id: 'rent', label: 'Rent', action: 'Search properties to let' },
  { id: 'value', label: 'Value a property', action: 'Request a valuation' },
];

/**
 * The three things a visitor arrives to do, as a counter across the foot of the hero.
 * Buy and Rent hand their selection to the listings page; Value hands it to the contact
 * form, which is where a valuation instruction actually starts.
 */
export function HeroSearchTabs() {
  const router = useRouter();
  const [active, setActive] = useState<TabId>('buy');
  const [category, setCategory] = useState('any');
  const [city, setCity] = useState('any');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (category !== 'any') params.set('category', category);
    if (city !== 'any') params.set('city', city);

    if (active === 'value') {
      params.set('subject', 'valuation');
      router.push(`/contact?${params.toString()}`);
      return;
    }

    params.set('type', active === 'buy' ? 'sale' : 'rent');
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
    <div className="bg-paper shadow-[0_-1px_0_rgba(27,54,28,0.08)]">
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
              'relative flex min-h-[52px] flex-1 items-center justify-center px-2 py-3 text-center text-[0.8125rem] leading-tight transition-colors sm:px-3 sm:text-[0.9375rem]',
              active === tab.id
                ? 'bg-green text-cream'
                : 'text-ink/75 hover:bg-cream-deep/60 hover:text-green',
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
        className="grid gap-3 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:gap-4 sm:p-5"
      >
        <div>
          <label htmlFor="hero-category" className="mb-1.5 block text-[0.8125rem] text-muted">
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
          <label htmlFor="hero-city" className="mb-1.5 block text-[0.8125rem] text-muted">
            Location
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

        <button
          type="submit"
          className="rounded-brand bg-gold px-6 py-3 text-[0.9375rem] font-medium text-green transition-colors hover:bg-gold-deep hover:text-cream"
        >
          {current.id === 'value' ? 'Request a valuation' : 'Search'}
          <span className="sr-only"> — {current.action}</span>
        </button>
      </form>
    </div>
  );
}
