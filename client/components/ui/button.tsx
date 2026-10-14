import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  children: ReactNode;
  external?: boolean;
};

const styles = {
  primary: 'bg-forest text-white hover:bg-[#315d4c] focus-visible:ring-forest',
  secondary:
    'border border-line bg-white text-ink hover:border-sage hover:text-forest focus-visible:ring-sage',
  ghost: 'bg-transparent text-ink hover:bg-canvas focus-visible:ring-sage',
  danger: 'bg-rose-700 text-white hover:bg-rose-800 focus-visible:ring-rose-700',
};

export function Button({ href, variant = 'primary', className, children, external, ...props }: ButtonProps) {
  const classes = cn(
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    styles[variant],
    className,
  );
  if (href && external)
    return (
      <a className={classes} href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  if (href)
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
