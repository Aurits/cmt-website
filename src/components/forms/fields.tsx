'use client';

import { useState } from 'react';
import { Select } from '@/components/ui/Select';
import { cx } from '@/lib/cx';

export const inputClass =
  'w-full rounded-control border border-rule-strong bg-paper px-3.5 py-3 text-[0.9375rem] text-ink placeholder:text-muted transition-colors hover:border-green/60 focus:border-green';

export function Label({
  htmlFor,
  children,
  optional = false,
}: {
  htmlFor: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[0.875rem] text-ink">
      {children}
      {optional && <span className="ml-1.5 text-[0.8125rem] text-muted">(optional)</span>}
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
