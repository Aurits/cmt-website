import { Select, type SelectOption } from '@/components/ui/Select';
import { Label } from '@/components/forms/fields';

/**
 * A controlled dropdown for admin edit forms, bound straight to a draft object's field.
 *
 * forms/fields.tsx's SelectField manages its own state from a `defaultValue`, which suits an
 * uncontrolled marketing form; a CMS edit page needs the value to live in the draft state so
 * "Save" always writes what is on screen. This wraps the same Select control instead.
 */
export function AdminSelectField({
  id,
  label,
  value,
  onChange,
  options,
  optional,
  hideLabel = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  optional?: boolean;
  /** Keeps the label for screen readers but drops its visual space — for in-table selects. */
  hideLabel?: boolean;
}) {
  return (
    <div>
      <Label htmlFor={id} optional={optional} className={hideLabel ? 'sr-only' : undefined}>
        {label}
      </Label>
      <Select id={id} tone="paper" value={value} onChange={onChange} options={options} />
    </div>
  );
}
