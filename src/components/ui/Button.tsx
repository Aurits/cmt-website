import Link from 'next/link';
import { cx } from '@/lib/cx';

type Variant = 'primary' | 'gold' | 'outline' | 'onDark' | 'quiet';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60';

const variants: Record<Variant, string> = {
  primary: 'bg-green text-cream hover:text-gold',
  gold: 'bg-gold text-green hover:bg-gold-deep hover:text-cream',
  outline: 'border border-green/35 text-green hover:border-green hover:bg-green/8',
  onDark: 'border border-cream/40 text-cream hover:border-gold hover:text-gold',
  quiet: 'text-green underline decoration-gold decoration-2 underline-offset-4 hover:text-gold-deep',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-2 text-micro',
  md: 'px-5 py-3 text-body',
  lg: 'px-6 py-3.5 text-base',
};

interface CommonProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  fullWidth?: boolean;
}

type ButtonAsLink = CommonProps & { href: string; type?: never; onClick?: never };
type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };

/**
 * One button, five registers. `quiet` is a text link for in-flow CTAs; everything else
 * is a filled or outlined control. Labels say what happens, and never carry an arrow.
 */
export function Button(props: ButtonAsLink | ButtonAsButton) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    className,
    fullWidth,
    ...rest
  } = props as ButtonAsButton;
  const classes = cx(
    base,
    variant === 'quiet' ? sizes[size].replace(/px-\d+(\.\d+)?/, 'px-0') : sizes[size],
    variants[variant],
    fullWidth && 'w-full',
    className,
  );

  if ('href' in props && props.href) {
    const external = /^(https?:|tel:|mailto:)/.test(props.href);
    if (external) {
      return (
        <a href={props.href} className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
