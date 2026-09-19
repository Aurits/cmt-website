import { cx } from '@/lib/cx';

/** A bordered, square panel grouping related fields — the CMS's equivalent of a report section. */
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
    <section className={cx('rounded-brand border border-rule bg-paper', className)}>
      <div className="border-b border-rule px-5 py-4">
        <h2 className="font-display text-h4 text-green">{title}</h2>
        {lead && <p className="mt-1 text-micro text-muted">{lead}</p>}
      </div>
      <div className="grid gap-5 p-5">{children}</div>
    </section>
  );
}
