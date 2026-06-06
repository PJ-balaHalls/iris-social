'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'auth' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  skeleton?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  skeleton = false,
  icon,
  children,
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  if (skeleton) {
    const sizes = {
      sm: 'h-8 w-20',
      md: 'h-10 w-24',
      lg: 'h-12 w-32',
    };

    return (
      <div
        className={`animate-pulse rounded-[18px] bg-gradient-to-r from-emerald-800/10 via-emerald-800/20 to-emerald-800/10 bg-[length:200%_100%] ${sizes[size]} ${className}`}
      />
    );
  }

  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-[18px] font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

  const variants = {
    primary:
      'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] focus:ring-[var(--color-accent)]',
    auth:
      'bg-emerald-800 text-white shadow-[0_12px_28px_rgba(0,44,31,0.18)] hover:bg-emerald-900 focus:ring-emerald-800',
    secondary:
      'border border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] hover:bg-neutral-200 focus:ring-[var(--color-border-strong)]',
    outline:
      'border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] hover:border-emerald-800 hover:text-emerald-800 focus:ring-emerald-800',
    ghost:
      'bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] focus:ring-[var(--color-border)]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3.5 text-base',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}

      {icon && !loading && icon}
      {children}
    </button>
  );
}