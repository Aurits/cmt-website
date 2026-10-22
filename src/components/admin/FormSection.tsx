import { cx } from '@/lib/cx';

/** A bordered, square panel grouping related fields, the CMS's equivalent of a report section. */
export function FormSection({
  title,
  lead,
  children,
  className,
}: {
  title: string;
  lead?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    // The dashboard's panel: white, a hairline frame, the short gold rule on its top edge.
    <section className={cx('relative border border-green/10 bg-white', className)}>
      <span aria-hidden="true" className="absolute -top-px left-5 h-[3px] w-7 bg-gold" />
      <div className="border-b border-hair px-5 py-4">
        <h2 className="font-display text-[19px] font-semibold text-green">{title}</h2>
        {lead && <p className="mt-1 text-small text-muted">{lead}</p>}
      </div>
      <div className="grid gap-5 p-5">{children}</div>
    </section>
  );
}
