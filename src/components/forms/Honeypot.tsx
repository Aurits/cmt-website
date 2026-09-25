/**
 * A field no person ever sees, and most bots fill.
 *
 * Hidden with position and opacity rather than `display:none` or `hidden`, because the simplest
 * bots skip anything the browser would not render. tabIndex -1 and aria-hidden keep it away from
 * keyboard and screen reader users, who would otherwise meet a mystery input with no purpose.
 * autoComplete is off so a password manager does not helpfully fill it and get a real visitor
 * silently dropped.
 */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-px w-px overflow-hidden">
      <label htmlFor="company">Company (leave this empty)</label>
      <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
