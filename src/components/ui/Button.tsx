'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
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
    const skeletonClasses = 'animate-pulse bg-gradient-to-r from-emerald/20 via-emerald/40 to-emerald/20 bg-[length:200%_100%] rounded-md';
    const sizes = {
      sm: 'h-8 w-20',
      md: 'h-10 w-24',
      lg: 'h-12 w-32',
    };
    return <div className={`${skeletonClasses} ${sizes[size]} ${className}`} />;
  }

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-48 disabled:cursor-not-allowed gap-2';
  
  const variants = {
    primary: 'bg-accent text-white hover:bg-accent-hover focus:ring-accent',
    secondary: 'bg-bg-subtle text-text-primary border border-border hover:bg-neutral-200 focus:ring-border-strong',
    outline: 'bg-transparent text-text-primary border border-border hover:border-accent hover:text-accent focus:ring-accent',
    ghost: 'bg-transparent text-text-primary hover:bg-bg-subtle focus:ring-border',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {icon && !loading && icon}
      {children}
    </button>
  );
}