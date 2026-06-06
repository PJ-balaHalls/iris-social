'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

type OnboardingContentFrameProps = {
  children: ReactNode;
};

export function OnboardingContentFrame({ children }: OnboardingContentFrameProps) {
  const pathname = usePathname();

  const frameClass =
    pathname === '/onboarding/welcome'
      ? 'max-w-5xl'
      : pathname === '/onboarding/basic-info' ||
          pathname === '/onboarding/avatar' ||
          pathname === '/onboarding/username'
        ? 'max-w-4xl'
        : 'max-w-xl';

  return (
    <div className={`w-full ${frameClass} transition-all duration-300 ease-out`}>
      {children}
    </div>
  );
}
