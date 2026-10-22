import Link from 'next/link';
import { ArrowRightIcon } from '@/components/ui/icons';
import { cx } from '@/lib/cx';

type Variant = 'primary' | 'gold' | 'outline' | 'onDark' | 'quiet';
type Size = 'sm' | 'md' | 'lg';

/*
 * Pills, as the hero design (Hero.html) sets them: fully rounded, semibold, and tall enough to be
 * an easy target (52px at lg, 44px at sm). `primary` is the design's dark button; with `arrow`
 * it carries the gold disc with an arrow at its right end, the one decorated button on a page.
 */
const base =
  'inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-full border font-semibold transition-[background-color,border-color,color,filter] duration-150 disabled:cursor-not-allowed disabled:opacity-60';

const variants: Record<Variant, string> = {
  primary: 'border-transparent bg-green text-white hover:brightness-125',
  gold: 'border-transparent bg-gold text-green hover:brightness-[1.06]',
  outline: 'border-green/30 text-green hover:bg-green/6',
  onDark: 'border-white/30 text-white hover:bg-white/10',
  quiet: 'border-transparent text-green underline decoration-gold decoration-2 underline-offset-4 hover:text-gold-deep',
};

const sizes: Record<Size, string> = {
  sm: 'min-h-11 px-5 text-small',
  md: 'min-h-12 px-6 text-body',
  lg: 'min-h-[52px] px-[26px] text-body',
};

interface CommonProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  fullWidth?: boolean;
  /** The gold disc with an arrow, on the primary button. Use once per view. */
  arrow?: boolean;
}

type ButtonAsLink = CommonProps & { href: string; type?: never; onClick?: never };
type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };

/**
 * One button, five registers. `quiet` is a text link for in-flow CTAs; everything else is a pill.
 * Labels say what happens; only `arrow` adds a mark, and only on the primary action.
 */
export function Button(props: ButtonAsLink | ButtonAsButton) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    className,
    fullWidth,
    arrow,
    ...rest
  } = props as ButtonAsButton & { arrow?: boolean };
  const classes = cx(
    base,
    variant === 'quiet' ? 'min-h-0 px-0 text-body' : sizes[size],
    variants[variant],
    // The disc sits 10px from the right edge, as in the design: padding 0 10px 0 26px.
    arrow && 'pr-2.5',
    fullWidth && 'w-full',
    className,
  );
  const content = (
    <>
      {children}
      {arrow && (
        <span
          aria-hidden="true"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gold text-green"
        >
          <ArrowRightIcon width={16} height={16} />
        </span>
      )}
    </>
  );

  if ('href' in props && props.href) {
    const external = /^(https?:|tel:|mailto:)/.test(props.href);
    if (external) {
      return (
        <a href={props.href} className={classes}>
          {content}
        </a>
      );
    }
    return (
      <Link href={props.href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {content}
    </button>
  );
}
