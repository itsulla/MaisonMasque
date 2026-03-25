import {Link} from '@remix-run/react';
import type {ReactNode, ButtonHTMLAttributes} from 'react';

interface ButtonProps {
  variant: 'dark' | 'outline';
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
}

const baseStyles =
  'inline-block font-body font-semibold text-xs uppercase tracking-[0.2em] py-3.5 px-9 transition-all duration-300 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]';

const variantStyles: Record<ButtonProps['variant'], string> = {
  dark: 'bg-ink text-cream hover:bg-espresso hover:shadow-[0_4px_12px_rgba(26,23,20,0.15)]',
  outline:
    'bg-transparent border border-sand text-ink hover:text-gold hover:border-gold hover:shadow-[0_4px_12px_rgba(197,165,90,0.1)]',
};

export function Button({
  variant,
  children,
  className = '',
  href,
  onClick,
  type = 'button',
}: ButtonProps) {
  const classes = `${baseStyles} ${variantStyles[variant]} ${className}`.trim();

  if (href) {
    return (
      <Link to={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
