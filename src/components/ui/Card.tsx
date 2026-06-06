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
      <div className={`space-y-3 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 ${className}`}>
        <div className="h-32 w-full animate-pulse rounded-[18px] bg-neutral-200" />
        <div className="h-5 w-3/4 animate-pulse rounded-full bg-neutral-200" />
        <div className="h-4 w-1/2 animate-pulse rounded-full bg-neutral-200" />
        <div className="flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-neutral-200" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-neutral-200" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-[24px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] shadow-[var(--shadow-md)] transition-all duration-200 ease-out ${
        hover ? 'hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)]' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}