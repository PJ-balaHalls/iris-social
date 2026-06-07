export type IrisThemeMode = 'system' | 'light' | 'dark';

export type IrisThemePricingModel = 'free' | 'subscription' | 'paid';

export type IrisThemeCategory =
  | 'themes'
  | 'backgrounds'
  | 'typography'
  | 'icons'
  | 'motion'
  | 'seasonal';

export type IrisThemeTokenSet = {
  primary: string;
  primaryDeep: string;
  primarySoft: string;
  accent: string;
  accentSoft: string;
  emotion: string;
  background: string;
  surface: string;
  surfaceSoft: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
};

export type IrisThemeTypography = {
  fontStyle: 'editorial' | 'modern' | 'soft' | 'mono';
};

export type IrisThemeLayout = {
  radius: 'sharp' | 'soft' | 'dream';
  spacing: 'compact' | 'comfortable' | 'airy';
  glass: 'none' | 'soft' | 'strong';
};

export type IrisThemeAnimation = {
  motion: 'reduced' | 'balanced' | 'expressive';
  backgroundAnimation?: 'none' | 'slow-aurora' | 'grain' | 'float';
};

export type IrisThemeBackground = {
  type: 'plain' | 'radial-soft' | 'aurora-lilac' | 'editorial-grid';
  animated: boolean;
  intensity: 'quiet' | 'soft' | 'strong';
};

export type IrisThemeDefinition = {
  id?: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  authorName: string;
  authorUserId?: string | null;
  category: IrisThemeCategory;
  pricingModel: IrisThemePricingModel;
  priceCents: number;
  priceLabel: string;
  status: 'draft' | 'published' | 'archived' | 'native';
  isFeatured: boolean;
  coverImagePath?: string | null;
  previewImagePath?: string | null;
  lightTokens: IrisThemeTokenSet;
  darkTokens: IrisThemeTokenSet;
  background: IrisThemeBackground;
  typography: IrisThemeTypography;
  layout: IrisThemeLayout;
  animation: IrisThemeAnimation;
  tags: string[];
  ratingAverage: number;
  ratingCount: number;
  metadata?: Record<string, unknown>;
};

export type IrisAppearancePreferences = {
  fontStyle: IrisThemeTypography['fontStyle'];
  fontScale: 'small' | 'normal' | 'large';
  spacing: IrisThemeLayout['spacing'];
  radius: IrisThemeLayout['radius'];
  motion: IrisThemeAnimation['motion'];
  glass: IrisThemeLayout['glass'];
};
