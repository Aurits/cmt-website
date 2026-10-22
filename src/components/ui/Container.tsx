import { cx } from '@/lib/cx';

/** Page gutter and measure, as Hero.html: a 1240px column with 40px gutters, 20px up to 600px wide. */
export function Container({
  children,
  className,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'header' | 'footer' | 'nav' | 'main';
}) {
  return <Tag className={cx('mx-auto w-full max-w-[1240px] px-5 min-[601px]:px-10', className)}>{children}</Tag>;
}
