import { cx } from '@/lib/cx';

/**
 * The row of facts under the hero design's headline (Hero.html): a short gold rule, the fact in
 * Fraunces at 28px, a one-line caption under it. Four across, two across below 960px, over a
 * hairline. The homepage uses it with words ("Market evidence", "Regulated"); /about with counts
 * ("9 offices"), which is the same device carrying the figures that page is about.
 */
export function FactStrip({
  facts,
  className,
}: {
  facts: { title: string; body: string }[];
  className?: string;
}) {
  return (
    <dl
      className={cx(
        'grid grid-cols-2 gap-8 border-t border-green/14 pt-[30px] pb-9 min-[961px]:grid-cols-4',
        className,
      )}
    >
      {facts.map((fact) => (
        <div key={fact.title}>
          <span aria-hidden="true" className="mb-3.5 block h-[3px] w-7 rounded-full bg-gold" />
          <dt className="tnum font-display text-[28px] leading-[1.1] font-semibold text-green">
            {fact.title}
          </dt>
          <dd className="mt-1.5 text-small leading-[1.45] text-muted">{fact.body}</dd>
        </div>
      ))}
    </dl>
  );
}
