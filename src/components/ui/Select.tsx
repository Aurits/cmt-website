'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ChevronIcon } from '@/components/ui/icons';
import { cx } from '@/lib/cx';

export interface SelectOption {
  value: string;
  label: string;
  /** Secondary text shown to the right of the label in the open list. */
  hint?: string;
}

/**
 * The site's dropdown.
 *
 * A native <select> cannot be styled where it matters: the open list is drawn by the
 * operating system, so on every machine it arrives in a different typeface, a different
 * blue, with different metrics. On a page this deliberate that is the one control that
 * always looks borrowed. This is the ARIA combobox/listbox pattern instead, so the open
 * menu belongs to the design system too — paper ground, hairline-ruled rows, a gold marker
 * against the chosen one, the same 2px radius as every other surface.
 *
 * Keyboard support matches what people expect from a native select, because that is the
 * bargain when you replace one: Enter, Space, Up and Down open it; Up and Down move;
 * Home and End jump; typing letters jumps to a match; Enter picks; Escape cancels and
 * restores; Tab closes and moves on. Focus moves into the list and returns to the trigger
 * on close.
 *
 * It needs JavaScript, which is the trade. Every dropdown on this site sits inside a
 * control that is already client-rendered (the filters, the hero search, the UI-only
 * forms), so nothing that works without JavaScript stops working — but a real submitting
 * form should keep the hidden input below, which carries the value to the server.
 */
export function Select({
  id,
  value,
  onChange,
  options,
  name,
  tone = 'cream',
  size = 'md',
  className,
  placeholder = 'Select',
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  /** Renders a hidden input so the value posts with a form once there is a backend. */
  name?: string;
  tone?: 'cream' | 'paper';
  size?: 'md' | 'sm';
  className?: string;
  placeholder?: string;
}) {
  const listboxId = `${useId()}-listbox`;
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ query: '', at: 0 });

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const selected = options[selectedIndex];

  const openList = (startAt = selectedIndex) => {
    setActiveIndex(startAt);
    setOpen(true);
  };

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  const commit = (index: number) => {
    const option = options[index];
    if (option) onChange(option.value);
    close();
  };

  // Focus the list when it opens, so arrow keys land somewhere sensible.
  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  // Keep the active row in view when arrowing through a long list.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  // A click anywhere else closes it, without stealing focus back.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  /**
   * Jump to the next option starting with the typed letters. The clock comes from the
   * keyboard event rather than Date.now(), so this stays a pure read: event.timeStamp is
   * milliseconds since the document loaded, which is all the 700ms window needs.
   */
  const onType = (key: string, at: number) => {
    const state = typeahead.current;
    state.query = at - state.at > 700 ? key : state.query + key;
    state.at = at;

    const from = state.query.length === 1 ? activeIndex + 1 : activeIndex;
    const order = [...options.slice(from), ...options.slice(0, from)];
    const hit = order.find((option) => option.label.toLowerCase().startsWith(state.query));
    if (hit) setActiveIndex(options.indexOf(hit));
  };

  const onTriggerKeyDown = (event: React.KeyboardEvent) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault();
      openList(event.key === 'ArrowUp' ? options.length - 1 : selectedIndex);
      return;
    }
    if (event.key.length === 1 && /\S/.test(event.key)) {
      event.preventDefault();
      openList();
      onType(event.key.toLowerCase(), event.timeStamp);
    }
  };

  const onListKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, options.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        commit(activeIndex);
        break;
      case 'Escape':
        event.preventDefault();
        close();
        break;
      case 'Tab':
        // Let focus move on naturally, but do not leave the list hanging open.
        setOpen(false);
        break;
      default:
        if (event.key.length === 1 && /\S/.test(event.key)) {
          event.preventDefault();
          onType(event.key.toLowerCase(), event.timeStamp);
        }
    }
  };

  const heights = size === 'sm' ? 'min-h-[40px] px-3 py-2 text-[0.875rem]' : 'min-h-[46px] px-3.5 py-2.5 text-[0.9375rem]';

  return (
    <div ref={wrapperRef} className={cx('relative', className)}>
      {name && <input type="hidden" name={name} value={value} />}

      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        onClick={() => (open ? close(false) : openList())}
        onKeyDown={onTriggerKeyDown}
        className={cx(
          'flex w-full items-center justify-between gap-3 rounded-brand border text-left transition-colors duration-150',
          heights,
          tone === 'cream' ? 'bg-cream' : 'bg-paper',
          open ? 'border-green' : 'border-rule hover:border-green/45',
        )}
      >
        <span className={cx('truncate', selected ? 'text-ink' : 'text-muted')}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronIcon
          width={16}
          height={16}
          aria-hidden="true"
          className={cx(
            'shrink-0 text-green/60 transition-transform duration-200',
            open ? '-rotate-90' : 'rotate-90',
          )}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={`${listboxId}-${activeIndex}`}
          onKeyDown={onListKeyDown}
          /*
           * z-[35] sits above the sticky mobile CTA bar (z-30) and below the masthead
           * (z-40), which is the order you want if a list opens near either edge.
           */
          className="absolute left-0 right-0 top-[calc(100%+4px)] z-[35] max-h-[17rem] overflow-y-auto rounded-brand border border-rule border-t-2 border-t-gold bg-paper shadow-[0_18px_40px_-18px_rgba(27,54,28,0.45)]"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;
            return (
              <li
                key={option.value}
                id={`${listboxId}-${index}`}
                data-index={index}
                role="option"
                aria-selected={isSelected}
                onClick={() => commit(index)}
                onMouseEnter={() => setActiveIndex(index)}
                className={cx(
                  'flex cursor-pointer items-center justify-between gap-3 border-l-[3px] px-3.5 py-2.5 text-[0.9375rem] transition-colors duration-100',
                  'border-b border-b-rule/60 last:border-b-0',
                  isSelected ? 'border-l-gold text-green' : 'border-l-transparent text-ink',
                  isActive && 'bg-green/8',
                )}
              >
                <span className="truncate">{option.label}</span>
                {option.hint && (
                  <span className="tnum shrink-0 text-[0.8125rem] text-muted">{option.hint}</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
