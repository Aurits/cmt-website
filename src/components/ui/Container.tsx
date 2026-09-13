import { cx } from '@/lib/cx';

/** Page gutter and measure. 16px gutters on phones, never wider than 1200px. */
export function Container({
  children,
  className,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'header' | 'footer' | 'nav' | 'main';
}) {
  return <Tag className={cx('mx-auto w-full max-w-[1200px] px-4 sm:px-6', className)}>{children}</Tag>;
}
