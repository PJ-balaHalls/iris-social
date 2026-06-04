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
        {label && <div className="skeleton-text h-4 w-20 rounded" />}
        <div className="skeleton-input h-10 w-full rounded-md" />
        {helper && <div className="skeleton-text h-3 w-32 rounded" />}
      </div>
    );
  }

  const inputId = id || label?.toLowerCase().replace(/\s/g, '-');
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-text-primary mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full px-4 py-2 bg-bg-surface border rounded-md text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-emotion focus:border-transparent transition-all ${
            error ? 'border-danger' : 'border-border'
          } ${icon ? 'pl-10' : ''} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
          {...rest}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-danger">
          {error}
        </p>
      )}
      {helper && !error && (
        <p id={`${inputId}-helper`} className="mt-1 text-sm text-text-muted">
          {helper}
        </p>
      )}
    </div>
  );
}

// Estilos adicionais para skeletons (coloque no globals.css ou module)
// .skeleton-text, .skeleton-input são classes utilitárias que você pode definir no tailwind ou globals.