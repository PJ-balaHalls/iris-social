'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  hover?: boolean;
  skeleton?: boolean;
  className?: string;
}

export function Card({ children, hover = true, skeleton = false, className = '' }: CardProps) {
  if (skeleton) {
    return (
      <div className={`bg-bg-surface border border-border rounded-lg p-5 space-y-3 ${className}`}>
        <div className="skeleton-card-image h-32 w-full rounded-md" />
        <div className="skeleton-text h-5 w-3/4 rounded" />
        <div className="skeleton-text h-4 w-1/2 rounded" />
        <div className="flex gap-2">
          <div className="skeleton-tag h-6 w-16 rounded-full" />
          <div className="skeleton-tag h-6 w-16 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-bg-surface border border-border rounded-lg shadow-md transition-all ${
        hover ? 'hover:shadow-lg hover:-translate-y-0.5' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}