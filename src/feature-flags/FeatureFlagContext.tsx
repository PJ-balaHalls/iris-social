// src/feature-flags/FeatureFlagContext.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';
import { FeatureFlag, defaultFlags } from './flags.config';

const FeatureFlagContext = createContext<Record<FeatureFlag, boolean>>(defaultFlags);

export function FeatureFlagProvider({ 
  children, 
  flags = defaultFlags 
}: { 
  children: ReactNode;
  flags?: Record<FeatureFlag, boolean>;
}) {
  return (
    <FeatureFlagContext.Provider value={flags}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlag(flag: FeatureFlag): boolean {
  const flags = useContext(FeatureFlagContext);
  return flags[flag] ?? false;
}
