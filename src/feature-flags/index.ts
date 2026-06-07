// src/feature-flags/index.ts

export { FeatureFlagProvider, useFeatureFlag } from './FeatureFlagContext';
export { FeatureFlag } from './FeatureFlag';

export {
  defaultFlags,
  planFlags,
  type FeatureFlag as FeatureFlagKey,
} from './flags.config';