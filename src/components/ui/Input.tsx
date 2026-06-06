'use client';

import { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: ReactNode;
  skeleton?: boolean;
}

export function Input({
  label,
  error,
  helper,
  icon,
  skeleton = false,
  className = '',
  id,
  ...rest
}: InputProps) {
  if (skeleton) {
    return (
      <div className="w-full space-y-2">
        {label && <div className="h-4 w-20 animate-pulse rounded-full bg-neutral-200" />}
        <div className="h-12 w-full animate-pulse rounded-[18px] bg-neutral-200" />
        {helper && <div className="h-3 w-32 animate-pulse rounded-full bg-neutral-200" />}
      </div>
    );
  }

  const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
            {icon}
          </div>
        )}

        <input
          id={inputId}
          className={`min-h-12 w-full rounded-[18px] border bg-white/92 px-4 py-3 text-[var(--color-text-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] outline-none transition-all duration-200 ease-out placeholder:text-[#9AA4A1] focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/10 disabled:cursor-not-allowed disabled:opacity-60 ${
            error ? 'border-[var(--color-danger)]' : 'border-[#DDE6DA]'
          } ${icon ? 'pl-11' : ''} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
          {...rest}
        />
      </div>

      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm text-[var(--color-danger)]">
          {error}
        </p>
      )}

      {helper && !error && (
        <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-[var(--color-text-muted)]">
          {helper}
        </p>
      )}
    </div>
  );
}