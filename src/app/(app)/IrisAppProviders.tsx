'use client';

import type { ReactNode } from 'react';
import { IrisThemeProvider } from '@/components/theme/IrisThemeProvider';

export function IrisAppProviders({ children }: { children: ReactNode }) {
  return <IrisThemeProvider>{children}</IrisThemeProvider>;
}
