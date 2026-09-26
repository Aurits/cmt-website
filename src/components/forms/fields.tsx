'use client';

import { useState } from 'react';
import { Select } from '@/components/ui/Select';
import { cx } from '@/lib/cx';

/*
 * One focus indicator, not two.
 *
 * The site-wide focus outline is drawn 2px OUTSIDE an element, which is right for a link or a
 * button but wrong for a bordered field: you get the field's border, a gap, then the outline, and
 * that reads as a double outline however the colours are tuned. So fields opt out of it and show
 * focus themselves: the border turns green and a soft halo sits tight against it, with no gap.
 * The Select trigger uses the same treatment, so every control on a form focuses identically.
 */
export const inputClass =
  'w-full rounded-control border border-rule-strong bg-paper px-3.5 py-3 text-body text-ink placeholder:text-muted transition-[border-color,box-shadow] hover:border-green/60 focus:border-green focus:shadow-[0_0_0_3px_rgb(17_52_27/0.16)] focus:outline-none';

export function Label({
  htmlFor,
  children,
  optional = false,
  className,
}: {
  htmlFor: string;
  children: React.ReactNode;
  optional?: boolean;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={cx('mb-1.5 block text-body text-ink', className)}>
      {children}
      {optional && <span className="ml-1.5 text-micro text-muted">(optional)</span>}
    </label>
  );
}

export function TextField({
  id,
  label,
  type = 'text',
  optional,
  className,
  ...rest
}: {
  id: string;
  label: string;
  optional?: boolean;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <Label htmlFor={id} optional={optional}>
        {label}
      </Label>
      <input id={id} name={id} type={type} required={!optional} className={inputClass} {...rest} />
    </div>
  );
}

export function TextArea({
  id,
  label,
  optional,
  rows = 5,
  className,
  ...rest
}: {
  id: string;
  label: string;
  optional?: boolean;
  className?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={className}>
      <Label htmlFor={id} optional={optional}>
        {label}
      </Label>
      <textarea
        id={id}
        name={id}
        rows={rows}
        required={!optional}
        className={cx(inputClass, 'resize-y')}
        {...rest}
      />
    </div>
  );
}

/**
 * Form dropdown. Holds its own value so the shared Select (a controlled listbox) can be
 * dropped into an otherwise uncontrolled form, and writes it to a hidden input under the
 * field's name so it posts correctly once there is a backend to post to.
 */
export function SelectField({
  id,
  label,
  options,
  defaultValue,
  className,
}: {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  className?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? options[0]?.value ?? '');

  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <Select
        id={id}
        name={id}
        tone="paper"
        value={value}
        onChange={setValue}
        options={options}
      />
    </div>
  );
}
