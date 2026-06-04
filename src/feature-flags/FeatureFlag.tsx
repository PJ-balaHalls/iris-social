// src/feature-flags/FeatureFlag.tsx
'use client';

import { useFeatureFlag } from './FeatureFlagContext';
import { FeatureFlag as FeatureFlagType } from './flags.config';

interface FeatureFlagProps {
  name: FeatureFlagType;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureFlag({ name, children, fallback = null }: FeatureFlagProps) {
  const isEnabled = useFeatureFlag(name);
  return isEnabled ? <>{children}</> : <>{fallback}</>;
}
