'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
 * against the chosen one. The trigger takes --radius-control, like every other control; the
 * open list stays square, so its gold top rule reads as a straight ruled edge rather than
 * curving into a highlight.
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
  // Where the list draws: measured from the trigger each time it opens (see openList).
  const [place, setPlace] = useState<{
    left: number;
    width: number;
    top?: number;
    bottom?: number;
    upward: boolean;
    sharp: boolean;
  } | null>(null);
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

  /*
   * Opens downward unless there is not room for the list below the trigger and there is more
   * room above it, as near the bottom of the screen. It used to always open downward, so on
   * /listings the filters' lists ran off the bottom edge of the viewport.
   */
  const openList = (startAt = selectedIndex) => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const wanted = Math.min(options.length * 45, 272) + 8;
    const below = window.innerHeight - rect.bottom;
    const upward = below < wanted && rect.top > below;
    setPlace({
      left: rect.left,
      width: rect.width,
      // The list is portalled to <body>, outside any .admin-sharp scope, so it takes the
      // trigger's own field radius with it: rounded on the site, square in the CMS.
      sharp: getComputedStyle(triggerRef.current!).borderTopLeftRadius === '0px',
      upward,
      ...(upward ? { bottom: window.innerHeight - rect.top + 4 } : { top: rect.bottom + 4 }),
    });
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

  // Focus the list when it opens, so arrow keys land somewhere sensible. preventScroll, because
  // focusing an element is itself allowed to scroll its ancestors into view.
  useEffect(() => {
    if (open) listRef.current?.focus({ preventScroll: true });
  }, [open]);

  /*
   * Keep the active row in view when arrowing through a long list, by scrolling THE LIST ONLY.
   *
   * This used scrollIntoView, which scrolls every scrollable ancestor, and an overflow:hidden box
   * still counts as one. The homepage hero clips its drawing with overflow:hidden, so opening a
   * dropdown in the search counter scrolled the whole hero 147px upward inside itself: the
   * content above the dropdown visibly jumped. Adjusting the list's own scrollTop cannot touch
   * anything outside it.
   */
  useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    const row = list?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    if (!list || !row) return;
    if (row.offsetTop < list.scrollTop) list.scrollTop = row.offsetTop;
    else if (row.offsetTop + row.offsetHeight > list.scrollTop + list.clientHeight)
      list.scrollTop = row.offsetTop + row.offsetHeight - list.clientHeight;
  }, [open, activeIndex]);

  /*
   * A click anywhere else closes it, without stealing focus back. The list lives in <body> now,
   * not inside the wrapper, so a click on the list itself has to be excluded separately.
   *
   * Scrolling the page or resizing the window closes it too, which is what a native select does:
   * the list is positioned against the trigger at the moment it opened, and following the trigger
   * through a scroll would mean redrawing it every frame. Scrolling inside the list is ignored.
   */
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!wrapperRef.current?.contains(target) && !listRef.current?.contains(target)) setOpen(false);
    };
    const onMove = (event: Event) => {
      if (event.type === 'scroll' && listRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('scroll', onMove, true);
    window.addEventListener('resize', onMove);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('scroll', onMove, true);
      window.removeEventListener('resize', onMove);
    };
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
        // Let focus move on naturally, but do not leave the list hanging open. Focus goes back
        // to the trigger first: the list sits at the end of <body>, so tabbing straight out of
        // it would land after the footer instead of on the next field.
        close();
        break;
      default:
        if (event.key.length === 1 && /\S/.test(event.key)) {
          event.preventDefault();
          onType(event.key.toLowerCase(), event.timeStamp);
        }
    }
  };

  const heights = size === 'sm' ? 'min-h-[40px] px-3 py-2 text-body' : 'min-h-[46px] px-3.5 py-2.5 text-body';

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
          'flex w-full items-center justify-between gap-3 rounded-(--radius-field) border text-left transition-colors duration-150',
          heights,
          tone === 'cream' ? 'bg-cream' : 'bg-white',
          // One indicator, not two: the border turns green with a soft halo tight against it,
          // for keyboard focus and for the open state alike. The site-wide focus outline sits
          // 2px outside an element, which around a bordered control read as a second outline.
          'focus-visible:border-green focus-visible:shadow-[0_0_0_3px_rgb(15_42_26/0.14)] focus-visible:outline-none',
          open
            ? 'border-green shadow-[0_0_0_3px_rgb(15_42_26/0.14)]'
            : 'border-rule-strong hover:border-green/60',
        )}
      >
        <span className={cx('truncate', selected ? 'text-green' : 'text-muted')}>
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

      {/*
        The open list is portalled into <body> and fixed to the viewport, at --z-popover. Drawn
        inside the control, it inherited every ancestor's clipping and stacking: the homepage hero
        is overflow:hidden and isolated, so the search counter's lists were cut off at the hero's
        edge, and on other pages a later section (or a Leaflet map) could paint over an open list.
        Out here nothing on the page can clip or cover it.
      */}
      {open && place && createPortal(
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={`${listboxId}-${activeIndex}`}
          onKeyDown={onListKeyDown}
          style={{ left: place.left, width: place.width, top: place.top, bottom: place.bottom }}
          className={cx(
            'fixed z-(--z-popover) max-h-[17rem] overflow-y-auto border border-green/10 bg-white p-1.5 font-sans shadow-[0_28px_56px_-20px_rgba(15,42,26,0.35)] outline-none',
            // The gold rule marks the edge that meets the trigger, whichever way it opened.
            place.upward ? 'origin-bottom' : 'origin-top',
            place.sharp ? 'rounded-none' : 'rounded-[18px]',
          )}
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
                  'flex cursor-pointer items-center justify-between gap-3 px-3.5 py-2.5 text-body transition-colors duration-100',
                  isSelected ? 'font-semibold text-green' : 'text-green/85',
                  isActive && 'bg-sage-soft',
                  !place.sharp && 'rounded-[12px]',
                )}
              >
                <span className="truncate">{option.label}</span>
                {option.hint && (
                  <span className="tnum shrink-0 text-micro text-muted">{option.hint}</span>
                )}
              </li>
            );
          })}
        </ul>,
        document.body,
      )}
    </div>
  );
}
