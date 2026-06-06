import type { ReactNode } from 'react';

type OnboardingFieldLineProps = {
  children: ReactNode;
  className?: string;
};

export function OnboardingFieldLine({
  children,
  className = '',
}: OnboardingFieldLineProps) {
  return (
    <div
      data-iris-field-line
      className={`border-t border-white/70 py-4 first:border-t-0 first:pt-0 last:pb-0 ${className}`}
    >
      {children}
    </div>
  );
}
