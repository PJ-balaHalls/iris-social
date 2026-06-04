'use client';

import { ReactNode } from 'react';
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  icon?: ReactNode;
  skeleton?: boolean;
  className?: string;
}

const variantStyles = {
  info: 'bg-mist/20 border-info text-info',
  success: 'bg-sage-light/30 border-success text-success',
  warning: 'bg-sand/30 border-warning text-warning',
  error: 'bg-rose/30 border-danger text-danger',
};

const defaultIcons = {
  info: <Info size={20} />,
  success: <CheckCircle size={20} />,
  warning: <AlertTriangle size={20} />,
  error: <XCircle size={20} />,
};

export function Alert({
  variant = 'info',
  title,
  message,
  icon,
  skeleton = false,
  className = '',
}: AlertProps) {
  if (skeleton) {
    return (
      <div className={`flex items-start gap-3 p-4 rounded-lg border bg-bg-subtle border-border ${className}`}>
        <div className="skeleton-icon h-5 w-5 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton-text h-4 w-32 rounded" />
          <div className="skeleton-text h-3 w-48 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border ${variantStyles[variant]} ${className}`}
      role="alert"
    >
      <div className="flex-shrink-0">{icon || defaultIcons[variant]}</div>
      <div className="flex-1">
        {title && <p className="font-semibold text-sm mb-1">{title}</p>}
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}