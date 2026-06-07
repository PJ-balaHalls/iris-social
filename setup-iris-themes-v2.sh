#!/usr/bin/env bash
set -euo pipefail

echo "==> IRIS Themes V2: dark global + marketplace + creator"

mkdir -p \
  "src/lib/themes" \
  "src/components/theme" \
  "src/lib/actions" \
  "src/app/api/theme/me" \
  "src/app/(app)/settings/appearance/_components" \
  "src/app/(app)/marketplace/_components" \
  "src/app/(app)/marketplace/_utils" \
  "src/app/(app)/marketplace/creator/_components" \
  "src/styles"

cat > "src/lib/themes/themeTypes.ts" <<'TS'
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
TS

cat > "src/lib/themes/themeCatalog.ts" <<'TS'
import type {
  IrisAppearancePreferences,
  IrisThemeDefinition,
  IrisThemeMode,
  IrisThemeTokenSet,
} from './themeTypes';

export const defaultThemeSlug = 'iris-classic';
export const defaultThemeMode: IrisThemeMode = 'system';

export const defaultAppearancePreferences: IrisAppearancePreferences = {
  fontStyle: 'editorial',
  fontScale: 'normal',
  spacing: 'comfortable',
  radius: 'soft',
  motion: 'balanced',
  glass: 'soft',
};

export const classicLightTokens: IrisThemeTokenSet = {
  primary: '#1B3A2E',
  primaryDeep: '#0F1512',
  primarySoft: '#DDE6DA',
  accent: '#006D4E',
  accentSoft: '#F2F7F3',
  emotion: '#9A7CA7',
  background: '#FAF7F2',
  surface: '#FFFFFF',
  surfaceSoft: '#FFFDF8',
  text: '#1B3A2E',
  textSecondary: '#476153',
  textMuted: '#747D79',
  border: '#E2E7E3',
};

export const classicDarkTokens: IrisThemeTokenSet = {
  primary: '#43C8A1',
  primaryDeep: '#D9FFF1',
  primarySoft: '#1E2924',
  accent: '#43C8A1',
  accentSoft: '#16231E',
  emotion: '#BFA6D6',
  background: '#0F1512',
  surface: '#161E1A',
  surfaceSoft: '#1E2924',
  text: '#F6FAF7',
  textSecondary: '#C9D3CD',
  textMuted: '#98A59F',
  border: '#2A3430',
};

export const lilacLightTokens: IrisThemeTokenSet = {
  primary: '#6F4BB2',
  primaryDeep: '#4E347F',
  primarySoft: '#EFE7F6',
  accent: '#9A7CA7',
  accentSoft: '#F7F1FA',
  emotion: '#B899D6',
  background: '#FAF7F2',
  surface: '#FFFFFF',
  surfaceSoft: '#FFFDF8',
  text: '#3A295F',
  textSecondary: '#5E4A76',
  textMuted: '#887898',
  border: '#E6DDF0',
};

export const lilacDarkTokens: IrisThemeTokenSet = {
  primary: '#C8A8FF',
  primaryDeep: '#EFE3FF',
  primarySoft: '#2A1F3A',
  accent: '#B899D6',
  accentSoft: '#22172F',
  emotion: '#D8B9F4',
  background: '#0F0B16',
  surface: '#171021',
  surfaceSoft: '#20162D',
  text: '#FAF7FF',
  textSecondary: '#D8CEE6',
  textMuted: '#A89CB8',
  border: '#3A2B4A',
};

export const irisThemeCatalog: IrisThemeDefinition[] = [
  {
    slug: 'iris-classic',
    name: 'IRIS Classic',
    shortDescription: 'Tema original da IRIS com verde profundo e off-white.',
    longDescription:
      'A identidade base da IRIS. Verde profundo, off-white, superfícies suaves e uma atmosfera minimalista/editorial.',
    authorName: 'IRIS Studio',
    category: 'themes',
    pricingModel: 'free',
    priceCents: 0,
    priceLabel: 'Gratuito',
    status: 'native',
    isFeatured: true,
    coverImagePath: null,
    previewImagePath: null,
    lightTokens: classicLightTokens,
    darkTokens: classicDarkTokens,
    background: {
      type: 'radial-soft',
      animated: false,
      intensity: 'quiet',
    },
    typography: {
      fontStyle: 'editorial',
    },
    layout: {
      radius: 'soft',
      spacing: 'comfortable',
      glass: 'soft',
    },
    animation: {
      motion: 'balanced',
      backgroundAnimation: 'none',
    },
    tags: ['nativo', 'verde', 'minimal', 'editorial'],
    ratingAverage: 5,
    ratingCount: 1,
    metadata: {
      system: true,
    },
  },
  {
    slug: 'iris-lilac',
    name: 'Lilás',
    shortDescription: 'Troca o verde da IRIS por uma atmosfera lilás.',
    longDescription:
      'Um tema suave, editorial e onírico. Ele preserva o off-white e a elegância da IRIS, mas transforma o verde principal em uma paleta lilás/violeta, com versão escura e fundo aurora.',
    authorName: 'IRIS Studio',
    category: 'themes',
    pricingModel: 'free',
    priceCents: 0,
    priceLabel: 'Gratuito',
    status: 'published',
    isFeatured: true,
    coverImagePath: '/iris/brand/cards/marketplace.png',
    previewImagePath: null,
    lightTokens: lilacLightTokens,
    darkTokens: lilacDarkTokens,
    background: {
      type: 'aurora-lilac',
      animated: true,
      intensity: 'soft',
    },
    typography: {
      fontStyle: 'editorial',
    },
    layout: {
      radius: 'dream',
      spacing: 'comfortable',
      glass: 'soft',
    },
    animation: {
      motion: 'balanced',
      backgroundAnimation: 'slow-aurora',
    },
    tags: ['lilás', 'violeta', 'suave', 'editorial', 'gratuito'],
    ratingAverage: 4.9,
    ratingCount: 12,
    metadata: {
      version: '1.0.0',
      replaces: 'green-core',
    },
  },
];

export function normalizeThemeSlug(value: unknown) {
  if (typeof value !== 'string') return defaultThemeSlug;
  return irisThemeCatalog.some((theme) => theme.slug === value)
    ? value
    : defaultThemeSlug;
}

export function normalizeThemeMode(value: unknown): IrisThemeMode {
  if (value === 'light' || value === 'dark' || value === 'system') return value;
  return defaultThemeMode;
}

export function normalizeAppearancePreferences(
  value: unknown,
): IrisAppearancePreferences {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return defaultAppearancePreferences;
  }

  const source = value as Record<string, unknown>;

  return {
    fontStyle:
      source.fontStyle === 'modern' ||
      source.fontStyle === 'soft' ||
      source.fontStyle === 'mono' ||
      source.fontStyle === 'editorial'
        ? source.fontStyle
        : defaultAppearancePreferences.fontStyle,
    fontScale:
      source.fontScale === 'small' ||
      source.fontScale === 'large' ||
      source.fontScale === 'normal'
        ? source.fontScale
        : defaultAppearancePreferences.fontScale,
    spacing:
      source.spacing === 'compact' ||
      source.spacing === 'airy' ||
      source.spacing === 'comfortable'
        ? source.spacing
        : defaultAppearancePreferences.spacing,
    radius:
      source.radius === 'sharp' ||
      source.radius === 'dream' ||
      source.radius === 'soft'
        ? source.radius
        : defaultAppearancePreferences.radius,
    motion:
      source.motion === 'reduced' ||
      source.motion === 'expressive' ||
      source.motion === 'balanced'
        ? source.motion
        : defaultAppearancePreferences.motion,
    glass:
      source.glass === 'none' ||
      source.glass === 'strong' ||
      source.glass === 'soft'
        ? source.glass
        : defaultAppearancePreferences.glass,
  };
}

export function getThemeBySlug(slug: string, themes = irisThemeCatalog) {
  return (
    themes.find((theme) => theme.slug === slug) ||
    themes.find((theme) => theme.slug === defaultThemeSlug) ||
    themes[0]
  );
}

export function getPricingLabel(model: string, priceCents = 0) {
  if (model === 'free') return 'Gratuito';
  if (model === 'subscription') return 'Assinatura';
  const price = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(priceCents / 100);
  return `Pago à parte · ${price}`;
}
TS

cat > "src/lib/themes/themeMappers.ts" <<'TS'
import {
  getPricingLabel,
  lilacDarkTokens,
  lilacLightTokens,
} from './themeCatalog';
import type {
  IrisThemeAnimation,
  IrisThemeBackground,
  IrisThemeCategory,
  IrisThemeDefinition,
  IrisThemeLayout,
  IrisThemePricingModel,
  IrisThemeTokenSet,
  IrisThemeTypography,
} from './themeTypes';

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function stringValue(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function numberValue(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function tokensFrom(value: unknown, fallback: IrisThemeTokenSet): IrisThemeTokenSet {
  const source = objectValue(value);

  return {
    primary: stringValue(source.primary, fallback.primary),
    primaryDeep: stringValue(source.primaryDeep, fallback.primaryDeep),
    primarySoft: stringValue(source.primarySoft, fallback.primarySoft),
    accent: stringValue(source.accent, fallback.accent),
    accentSoft: stringValue(source.accentSoft, fallback.accentSoft),
    emotion: stringValue(source.emotion, fallback.emotion),
    background: stringValue(source.background, fallback.background),
    surface: stringValue(source.surface, fallback.surface),
    surfaceSoft: stringValue(source.surfaceSoft, fallback.surfaceSoft),
    text: stringValue(source.text, fallback.text),
    textSecondary: stringValue(source.textSecondary, fallback.textSecondary),
    textMuted: stringValue(source.textMuted, fallback.textMuted),
    border: stringValue(source.border, fallback.border),
  };
}

function backgroundFrom(value: unknown): IrisThemeBackground {
  const source = objectValue(value);

  return {
    type:
      source.type === 'plain' ||
      source.type === 'radial-soft' ||
      source.type === 'aurora-lilac' ||
      source.type === 'editorial-grid'
        ? source.type
        : 'radial-soft',
    animated: typeof source.animated === 'boolean' ? source.animated : false,
    intensity:
      source.intensity === 'quiet' ||
      source.intensity === 'strong' ||
      source.intensity === 'soft'
        ? source.intensity
        : 'soft',
  };
}

function typographyFrom(value: unknown): IrisThemeTypography {
  const source = objectValue(value);

  return {
    fontStyle:
      source.fontStyle === 'modern' ||
      source.fontStyle === 'soft' ||
      source.fontStyle === 'mono' ||
      source.fontStyle === 'editorial'
        ? source.fontStyle
        : 'editorial',
  };
}

function layoutFrom(value: unknown): IrisThemeLayout {
  const source = objectValue(value);

  return {
    radius:
      source.radius === 'sharp' ||
      source.radius === 'dream' ||
      source.radius === 'soft'
        ? source.radius
        : 'soft',
    spacing:
      source.spacing === 'compact' ||
      source.spacing === 'airy' ||
      source.spacing === 'comfortable'
        ? source.spacing
        : 'comfortable',
    glass:
      source.glass === 'none' || source.glass === 'strong' || source.glass === 'soft'
        ? source.glass
        : 'soft',
  };
}

function animationFrom(value: unknown): IrisThemeAnimation {
  const source = objectValue(value);

  return {
    motion:
      source.motion === 'reduced' ||
      source.motion === 'expressive' ||
      source.motion === 'balanced'
        ? source.motion
        : 'balanced',
    backgroundAnimation:
      source.backgroundAnimation === 'slow-aurora' ||
      source.backgroundAnimation === 'grain' ||
      source.backgroundAnimation === 'float' ||
      source.backgroundAnimation === 'none'
        ? source.backgroundAnimation
        : 'none',
  };
}

export function mapThemeRowToDefinition(row: Record<string, unknown>): IrisThemeDefinition {
  const pricingModel =
    row.pricing_model === 'subscription' || row.pricing_model === 'paid'
      ? row.pricing_model
      : 'free';

  const priceCents = numberValue(row.price_cents, 0);

  return {
    id: typeof row.id === 'string' ? row.id : undefined,
    slug: stringValue(row.slug, 'theme'),
    name: stringValue(row.name, 'Tema sem nome'),
    shortDescription: stringValue(row.short_description, 'Tema personalizado da IRIS.'),
    longDescription: stringValue(row.long_description, 'Tema personalizado da IRIS.'),
    authorName: stringValue(row.author_name, 'Criador IRIS'),
    authorUserId: typeof row.author_user_id === 'string' ? row.author_user_id : null,
    category: stringValue(row.category, 'themes') as IrisThemeCategory,
    pricingModel: pricingModel as IrisThemePricingModel,
    priceCents,
    priceLabel: getPricingLabel(pricingModel, priceCents),
    status: row.status === 'draft' || row.status === 'archived' ? row.status : 'published',
    isFeatured: Boolean(row.is_featured),
    coverImagePath: typeof row.cover_image_path === 'string' ? row.cover_image_path : null,
    previewImagePath: typeof row.preview_image_path === 'string' ? row.preview_image_path : null,
    lightTokens: tokensFrom(row.light_tokens, lilacLightTokens),
    darkTokens: tokensFrom(row.dark_tokens, lilacDarkTokens),
    background: backgroundFrom(row.background_tokens),
    typography: typographyFrom(row.typography_tokens),
    layout: layoutFrom(row.layout_tokens),
    animation: animationFrom(row.animation_tokens),
    tags: Array.isArray(row.tags)
      ? row.tags.filter((tag): tag is string => typeof tag === 'string')
      : [],
    ratingAverage: numberValue(row.rating_average, 0),
    ratingCount: numberValue(row.rating_count, 0),
    metadata: objectValue(row.metadata),
  };
}
TS

cat > "src/styles/iris-theme.css" <<'CSS'
:root {
  --iris-color-primary: #1B3A2E;
  --iris-color-primary-deep: #0F1512;
  --iris-color-primary-soft: #DDE6DA;
  --iris-color-accent: #006D4E;
  --iris-color-accent-soft: #F2F7F3;
  --iris-color-emotion: #9A7CA7;
  --iris-color-border: #E2E7E3;
  --iris-color-ring: rgba(27, 58, 46, 0.14);
  --iris-color-shadow: rgba(27, 58, 46, 0.10);

  --iris-bg-primary: #FAF7F2;
  --iris-bg-surface: #FFFFFF;
  --iris-bg-soft: #FFFDF8;
  --iris-text-primary: #1B3A2E;
  --iris-text-secondary: #476153;
  --iris-text-muted: #747D79;

  --iris-radius-card: 32px;
  --iris-radius-control: 999px;
  --iris-section-gap: 2rem;
  --iris-font-scale: 1;
  --iris-glass-opacity: 0.58;
}

html[data-theme='dark'] {
  color-scheme: dark;
}

html[data-theme='light'] {
  color-scheme: light;
}

html[data-font-style='modern'] {
  --font-display: "Inter", system-ui, sans-serif;
}

html[data-font-style='soft'] {
  --font-display: "Inter", system-ui, sans-serif;
  letter-spacing: -0.005em;
}

html[data-font-style='mono'] {
  --font-display: "JetBrains Mono", ui-monospace, monospace;
}

html[data-font-scale='small'] {
  --iris-font-scale: 0.94;
}

html[data-font-scale='large'] {
  --iris-font-scale: 1.07;
}

html[data-spacing='compact'] {
  --iris-section-gap: 1.25rem;
}

html[data-spacing='airy'] {
  --iris-section-gap: 3rem;
}

html[data-radius='sharp'] {
  --iris-radius-card: 18px;
  --iris-radius-control: 14px;
}

html[data-radius='dream'] {
  --iris-radius-card: 42px;
  --iris-radius-control: 999px;
}

html[data-glass='none'] {
  --iris-glass-opacity: 1;
}

html[data-glass='strong'] {
  --iris-glass-opacity: 0.42;
}

html[data-motion='reduced'] *,
html[data-motion='reduced'] *::before,
html[data-motion='reduced'] *::after {
  animation-duration: 0.001ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.001ms !important;
  scroll-behavior: auto !important;
}

html,
body {
  background: var(--iris-bg-primary);
  color: var(--iris-text-primary);
  font-size: calc(16px * var(--iris-font-scale));
}

body {
  min-height: 100vh;
  transition:
    background-color 240ms ease,
    color 240ms ease;
}

html[data-theme='dark'] body {
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--iris-color-primary) 13%, transparent), transparent 34rem),
    radial-gradient(circle at top right, color-mix(in srgb, var(--iris-color-emotion) 10%, transparent), transparent 30rem),
    var(--iris-bg-primary);
  color: var(--iris-text-primary);
}

html[data-theme-bg='aurora-lilac'] body {
  background:
    radial-gradient(circle at 10% 8%, color-mix(in srgb, var(--iris-color-primary) 18%, transparent), transparent 34rem),
    radial-gradient(circle at 88% 12%, color-mix(in srgb, var(--iris-color-accent) 15%, transparent), transparent 32rem),
    radial-gradient(circle at 48% 92%, color-mix(in srgb, var(--iris-color-emotion) 10%, transparent), transparent 36rem),
    var(--iris-bg-primary);
}

html[data-bg-animated='true'][data-motion='balanced'] body,
html[data-bg-animated='true'][data-motion='expressive'] body {
  background-size: 120% 120%;
  animation: iris-theme-aurora 16s ease-in-out infinite alternate;
}

@keyframes iris-theme-aurora {
  from {
    background-position: 0% 0%;
  }
  to {
    background-position: 100% 42%;
  }
}

.iris-theme-card {
  border-radius: var(--iris-radius-card);
  border-color: var(--iris-color-border);
  background: color-mix(in srgb, var(--iris-bg-surface) calc(var(--iris-glass-opacity) * 100%), transparent);
  box-shadow: 0 24px 80px var(--iris-color-shadow);
  backdrop-filter: blur(18px);
}

.iris-theme-control {
  border-radius: var(--iris-radius-control);
}

.iris-theme-swatch {
  background:
    radial-gradient(circle at 18% 18%, var(--iris-color-primary), transparent 35%),
    radial-gradient(circle at 82% 20%, var(--iris-color-accent), transparent 34%),
    linear-gradient(135deg, var(--iris-bg-soft), var(--iris-color-accent-soft));
}

html[data-theme='dark'] .text-\[\#1B3A2E\],
html[data-theme='dark'] .text-\[\#006D4E\],
html[data-theme='dark'] .text-\[\#111111\],
html[data-theme='dark'] .text-black {
  color: var(--iris-text-primary) !important;
}

html[data-theme='dark'] .text-\[\#476153\] {
  color: var(--iris-text-secondary) !important;
}

html[data-theme='dark'] .text-\[\#747D79\],
html[data-theme='dark'] .text-\[\#9AA4A1\] {
  color: var(--iris-text-muted) !important;
}

html[data-theme='dark'] .bg-\[\#FAF7F2\],
html[data-theme='dark'] .bg-\[\#FFFDF8\],
html[data-theme='dark'] .bg-\[\#F2F4F3\],
html[data-theme='dark'] .bg-\[\#F2F7F3\],
html[data-theme='dark'] .bg-white,
html[data-theme='dark'] .bg-white\/40,
html[data-theme='dark'] .bg-white\/45,
html[data-theme='dark'] .bg-white\/50,
html[data-theme='dark'] .bg-white\/52,
html[data-theme='dark'] .bg-white\/55,
html[data-theme='dark'] .bg-white\/56,
html[data-theme='dark'] .bg-white\/58,
html[data-theme='dark'] .bg-white\/70 {
  background-color: var(--iris-bg-surface) !important;
}

html[data-theme='dark'] .border-\[\#E2E7E3\],
html[data-theme='dark'] .border-\[\#DDE6DA\],
html[data-theme='dark'] .border-\[\#C7CFCC\],
html[data-theme='dark'] .border-white\/70,
html[data-theme='dark'] .border-white\/75 {
  border-color: var(--iris-color-border) !important;
}

html[data-theme='dark'] .shadow-\[0_32px_110px_rgba\(27\,58\,46\,0\.11\)\],
html[data-theme='dark'] .shadow-\[0_20px_70px_rgba\(27\,58\,46\,0\.06\)\],
html[data-theme='dark'] .shadow-\[0_16px_48px_rgba\(27\,58\,46\,0\.055\)\] {
  box-shadow: 0 24px 90px rgba(0, 0, 0, 0.28) !important;
}

html[data-iris-theme='iris-lilac'] .text-\[\#1B3A2E\],
html[data-iris-theme='iris-lilac'] .text-\[\#006D4E\] {
  color: var(--iris-color-primary) !important;
}

html[data-iris-theme='iris-lilac'] .bg-\[\#1B3A2E\],
html[data-iris-theme='iris-lilac'] .bg-\[\#006D4E\] {
  background-color: var(--iris-color-primary) !important;
}

html[data-iris-theme='iris-lilac'] .border-\[\#1B3A2E\] {
  border-color: var(--iris-color-primary) !important;
}

html[data-theme='dark'][data-iris-theme='iris-lilac'] .bg-\[\#111A16\],
html[data-theme='dark'][data-iris-theme='iris-lilac'] .bg-\[\#0F1512\] {
  background-color: #100B18 !important;
}
CSS

cat > "src/components/theme/IrisThemeScript.tsx" <<'TSX'
export function IrisThemeScript() {
  const code = `
(function () {
  try {
    var theme = localStorage.getItem('iris:theme:slug') || 'iris-classic';
    var mode = localStorage.getItem('iris:theme:mode') || 'system';
    var prefsRaw = localStorage.getItem('iris:theme:preferences');
    var prefs = prefsRaw ? JSON.parse(prefsRaw) : {};
    var resolved = mode;

    if (mode === 'system') {
      resolved = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }

    var root = document.documentElement;
    root.setAttribute('data-iris-theme', theme);
    root.setAttribute('data-theme', resolved);
    root.setAttribute('data-theme-mode', mode);
    root.setAttribute('data-font-style', prefs.fontStyle || 'editorial');
    root.setAttribute('data-font-scale', prefs.fontScale || 'normal');
    root.setAttribute('data-spacing', prefs.spacing || 'comfortable');
    root.setAttribute('data-radius', prefs.radius || 'soft');
    root.setAttribute('data-motion', prefs.motion || 'balanced');
    root.setAttribute('data-glass', prefs.glass || 'soft');
    root.style.colorScheme = resolved;
  } catch (error) {}
})();
`;

  return (
    <script
      id="iris-theme-script"
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );
}
TSX

cat > "src/components/theme/IrisThemeProvider.tsx" <<'TSX'
'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  defaultAppearancePreferences,
  defaultThemeMode,
  defaultThemeSlug,
  getThemeBySlug,
  irisThemeCatalog,
  normalizeAppearancePreferences,
  normalizeThemeMode,
  normalizeThemeSlug,
} from '@/lib/themes/themeCatalog';
import type {
  IrisAppearancePreferences,
  IrisThemeDefinition,
  IrisThemeMode,
} from '@/lib/themes/themeTypes';

type IrisThemeContextValue = {
  themeSlug: string;
  mode: IrisThemeMode;
  resolvedMode: 'light' | 'dark';
  preferences: IrisAppearancePreferences;
  themes: IrisThemeDefinition[];
  setMode: (mode: IrisThemeMode) => void;
  setPreferences: (preferences: IrisAppearancePreferences) => void;
  activateTheme: (
    themeSlug: string,
    mode?: IrisThemeMode,
    preferences?: IrisAppearancePreferences,
    themes?: IrisThemeDefinition[],
  ) => void;
};

const IrisThemeContext = createContext<IrisThemeContextValue | null>(null);

const storageKeys = {
  themeSlug: 'iris:theme:slug',
  mode: 'iris:theme:mode',
  preferences: 'iris:theme:preferences',
};

function getSystemMode(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function resolveMode(mode: IrisThemeMode): 'light' | 'dark' {
  return mode === 'system' ? getSystemMode() : mode;
}

function setVariables(tokens: Record<string, string>) {
  const root = document.documentElement;

  const map: Record<string, string> = {
    primary: '--iris-color-primary',
    primaryDeep: '--iris-color-primary-deep',
    primarySoft: '--iris-color-primary-soft',
    accent: '--iris-color-accent',
    accentSoft: '--iris-color-accent-soft',
    emotion: '--iris-color-emotion',
    background: '--iris-bg-primary',
    surface: '--iris-bg-surface',
    surfaceSoft: '--iris-bg-soft',
    text: '--iris-text-primary',
    textSecondary: '--iris-text-secondary',
    textMuted: '--iris-text-muted',
    border: '--iris-color-border',
  };

  Object.entries(map).forEach(([key, cssVar]) => {
    if (tokens[key]) root.style.setProperty(cssVar, tokens[key]);
  });

  if (tokens.primary) {
    root.style.setProperty('--iris-color-ring', `${tokens.primary}29`);
    root.style.setProperty('--iris-color-shadow', `${tokens.primary}1F`);
  }
}

export function applyIrisThemeToDOM(
  themeSlug: string,
  mode: IrisThemeMode,
  preferences: IrisAppearancePreferences = defaultAppearancePreferences,
  themes: IrisThemeDefinition[] = irisThemeCatalog,
) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const resolvedMode = resolveMode(mode);
  const theme = getThemeBySlug(themeSlug, themes);
  const tokens = resolvedMode === 'dark' ? theme.darkTokens : theme.lightTokens;

  setVariables(tokens);

  root.setAttribute('data-iris-theme', theme.slug);
  root.setAttribute('data-theme', resolvedMode);
  root.setAttribute('data-theme-mode', mode);
  root.setAttribute('data-font-style', preferences.fontStyle);
  root.setAttribute('data-font-scale', preferences.fontScale);
  root.setAttribute('data-spacing', preferences.spacing);
  root.setAttribute('data-radius', preferences.radius);
  root.setAttribute('data-motion', preferences.motion);
  root.setAttribute('data-glass', preferences.glass);
  root.setAttribute('data-theme-bg', theme.background.type);
  root.setAttribute('data-bg-animated', String(theme.background.animated));
  root.style.colorScheme = resolvedMode;

  window.dispatchEvent(
    new CustomEvent('iris-theme-change', {
      detail: {
        themeSlug: theme.slug,
        mode,
        resolvedMode,
        preferences,
      },
    }),
  );
}

function getLocalThemeSlug() {
  if (typeof window === 'undefined') return defaultThemeSlug;
  return localStorage.getItem(storageKeys.themeSlug) || defaultThemeSlug;
}

function getLocalMode() {
  if (typeof window === 'undefined') return defaultThemeMode;
  return normalizeThemeMode(localStorage.getItem(storageKeys.mode));
}

function getLocalPreferences() {
  if (typeof window === 'undefined') return defaultAppearancePreferences;

  try {
    return normalizeAppearancePreferences(
      JSON.parse(localStorage.getItem(storageKeys.preferences) || '{}'),
    );
  } catch {
    return defaultAppearancePreferences;
  }
}

function persistLocal(
  themeSlug: string,
  mode: IrisThemeMode,
  preferences: IrisAppearancePreferences,
) {
  localStorage.setItem(storageKeys.themeSlug, themeSlug);
  localStorage.setItem(storageKeys.mode, mode);
  localStorage.setItem(storageKeys.preferences, JSON.stringify(preferences));
}

export function IrisThemeProvider({ children }: { children: ReactNode }) {
  const [themes, setThemes] = useState<IrisThemeDefinition[]>(irisThemeCatalog);
  const [themeSlug, setThemeSlug] = useState(getLocalThemeSlug);
  const [mode, setModeState] = useState<IrisThemeMode>(getLocalMode);
  const [preferences, setPreferencesState] =
    useState<IrisAppearancePreferences>(getLocalPreferences);
  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>(() =>
    resolveMode(getLocalMode()),
  );

  const activateTheme = useCallback(
    (
      nextThemeSlug: string,
      nextMode: IrisThemeMode = mode,
      nextPreferences: IrisAppearancePreferences = preferences,
      nextThemes: IrisThemeDefinition[] = themes,
    ) => {
      const normalizedMode = normalizeThemeMode(nextMode);
      const normalizedPreferences = normalizeAppearancePreferences(nextPreferences);

      setThemes(nextThemes);
      setThemeSlug(nextThemeSlug);
      setModeState(normalizedMode);
      setPreferencesState(normalizedPreferences);
      setResolvedMode(resolveMode(normalizedMode));

      persistLocal(nextThemeSlug, normalizedMode, normalizedPreferences);
      applyIrisThemeToDOM(
        nextThemeSlug,
        normalizedMode,
        normalizedPreferences,
        nextThemes,
      );
    },
    [mode, preferences, themes],
  );

  const setMode = useCallback(
    (nextMode: IrisThemeMode) => {
      activateTheme(themeSlug, nextMode, preferences, themes);
    },
    [activateTheme, themeSlug, preferences, themes],
  );

  const setPreferences = useCallback(
    (nextPreferences: IrisAppearancePreferences) => {
      activateTheme(themeSlug, mode, nextPreferences, themes);
    },
    [activateTheme, themeSlug, mode, themes],
  );

  useEffect(() => {
    applyIrisThemeToDOM(themeSlug, mode, preferences, themes);
  }, [themeSlug, mode, preferences, themes]);

  useEffect(() => {
    if (mode !== 'system') return;

    const query = window.matchMedia('(prefers-color-scheme: dark)');

    function handleChange() {
      applyIrisThemeToDOM(themeSlug, 'system', preferences, themes);
      setResolvedMode(resolveMode('system'));
    }

    query.addEventListener('change', handleChange);

    return () => query.removeEventListener('change', handleChange);
  }, [mode, themeSlug, preferences, themes]);

  useEffect(() => {
    let cancelled = false;

    async function syncProfileTheme() {
      try {
        const response = await fetch('/api/theme/me', {
          cache: 'no-store',
        });

        if (!response.ok) return;

        const payload = await response.json();

        if (cancelled) return;

        const serverThemeSlug =
          typeof payload.themeSlug === 'string'
            ? payload.themeSlug
            : defaultThemeSlug;

        const serverMode = normalizeThemeMode(payload.mode);
        const serverPreferences = normalizeAppearancePreferences(payload.preferences);
        const serverThemes = Array.isArray(payload.themes)
          ? [...irisThemeCatalog, ...payload.themes]
          : irisThemeCatalog;

        activateTheme(serverThemeSlug, serverMode, serverPreferences, serverThemes);
      } catch {
        // Mantém tema local.
      }
    }

    syncProfileTheme();

    return () => {
      cancelled = true;
    };
  }, [activateTheme]);

  const value = useMemo<IrisThemeContextValue>(
    () => ({
      themeSlug,
      mode,
      resolvedMode,
      preferences,
      themes,
      setMode,
      setPreferences,
      activateTheme,
    }),
    [
      themeSlug,
      mode,
      resolvedMode,
      preferences,
      themes,
      setMode,
      setPreferences,
      activateTheme,
    ],
  );

  return (
    <IrisThemeContext.Provider value={value}>
      {children}
    </IrisThemeContext.Provider>
  );
}

export function useIrisTheme() {
  const context = useContext(IrisThemeContext);

  if (context) return context;

  return {
    themeSlug: defaultThemeSlug,
    mode: defaultThemeMode,
    resolvedMode: 'light' as const,
    preferences: defaultAppearancePreferences,
    themes: irisThemeCatalog,
    setMode: () => undefined,
    setPreferences: () => undefined,
    activateTheme: (
      themeSlug: string,
      mode: IrisThemeMode = defaultThemeMode,
      preferences: IrisAppearancePreferences = defaultAppearancePreferences,
      themes: IrisThemeDefinition[] = irisThemeCatalog,
    ) => applyIrisThemeToDOM(themeSlug, mode, preferences, themes),
  };
}
TSX

cat > "src/lib/actions/theme.actions.ts" <<'TS'
'use server';

import { revalidatePath } from 'next/cache';
import { createServer } from '@/lib/supabase/server';
import {
  defaultAppearancePreferences,
  normalizeAppearancePreferences,
  normalizeThemeMode,
} from '@/lib/themes/themeCatalog';

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

function getPreferencesFromForm(formData: FormData) {
  return normalizeAppearancePreferences({
    fontStyle: getString(formData, 'fontStyle') || defaultAppearancePreferences.fontStyle,
    fontScale: getString(formData, 'fontScale') || defaultAppearancePreferences.fontScale,
    spacing: getString(formData, 'spacing') || defaultAppearancePreferences.spacing,
    radius: getString(formData, 'radius') || defaultAppearancePreferences.radius,
    motion: getString(formData, 'motion') || defaultAppearancePreferences.motion,
    glass: getString(formData, 'glass') || defaultAppearancePreferences.glass,
  });
}

export async function saveThemePreferenceAction(formData: FormData) {
  const themeSlug = getString(formData, 'themeSlug') || 'iris-classic';
  const mode = normalizeThemeMode(getString(formData, 'mode'));
  const preferences = getPreferencesFromForm(formData);

  const supabase = createServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      error: 'not-authenticated',
    };
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      active_theme_slug: themeSlug,
      theme_mode: mode,
      theme_preferences: {
        ...preferences,
        updated_at: new Date().toISOString(),
      },
    })
    .eq('id', user.id);

  if (error) {
    console.error('[IRIS_THEME_SAVE_FAILED]', error);

    return {
      ok: false,
      error: 'database',
    };
  }

  revalidatePath('/settings/appearance');
  revalidatePath('/marketplace');

  return {
    ok: true,
    themeSlug,
    mode,
    preferences,
  };
}

export async function installThemeAction(formData: FormData) {
  const themeSlug = getString(formData, 'themeSlug') || 'iris-classic';
  const mode = normalizeThemeMode(getString(formData, 'mode'));
  const preferences = getPreferencesFromForm(formData);
  const supabase = createServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      error: 'not-authenticated',
    };
  }

  await supabase
    .from('iris_user_theme_library')
    .update({
      is_active: false,
    })
    .eq('user_id', user.id);

  const { error: libraryError } = await supabase
    .from('iris_user_theme_library')
    .upsert(
      {
        user_id: user.id,
        theme_slug: themeSlug,
        is_active: true,
        activated_at: new Date().toISOString(),
        settings: preferences,
      },
      {
        onConflict: 'user_id,theme_slug',
      },
    );

  if (libraryError) {
    console.error('[IRIS_THEME_INSTALL_FAILED]', libraryError);
    return {
      ok: false,
      error: 'library',
    };
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      active_theme_slug: themeSlug,
      theme_mode: mode,
      theme_preferences: {
        ...preferences,
        updated_at: new Date().toISOString(),
      },
    })
    .eq('id', user.id);

  if (profileError) {
    console.error('[IRIS_THEME_PROFILE_UPDATE_FAILED]', profileError);
    return {
      ok: false,
      error: 'profile',
    };
  }

  revalidatePath('/settings/appearance');
  revalidatePath('/marketplace');

  return {
    ok: true,
    themeSlug,
  };
}
TS

cat > "src/lib/actions/marketplace-theme.actions.ts" <<'TS'
'use server';

import { revalidatePath } from 'next/cache';
import { createServer } from '@/lib/supabase/server';

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function getNumber(formData: FormData, key: string, fallback = 0) {
  const value = Number(getString(formData, key));
  return Number.isFinite(value) ? value : fallback;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 72);
}

function tokens(formData: FormData, prefix: 'light' | 'dark') {
  return {
    primary: getString(formData, `${prefix}_primary`),
    primaryDeep: getString(formData, `${prefix}_primaryDeep`),
    primarySoft: getString(formData, `${prefix}_primarySoft`),
    accent: getString(formData, `${prefix}_accent`),
    accentSoft: getString(formData, `${prefix}_accentSoft`),
    emotion: getString(formData, `${prefix}_emotion`),
    background: getString(formData, `${prefix}_background`),
    surface: getString(formData, `${prefix}_surface`),
    surfaceSoft: getString(formData, `${prefix}_surfaceSoft`),
    text: getString(formData, `${prefix}_text`),
    textSecondary: getString(formData, `${prefix}_textSecondary`),
    textMuted: getString(formData, `${prefix}_textMuted`),
    border: getString(formData, `${prefix}_border`),
  };
}

export async function publishThemeAction(formData: FormData) {
  const supabase = createServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      error: 'not-authenticated',
    };
  }

  const name = getString(formData, 'name') || 'Tema sem nome';
  const slug = slugify(getString(formData, 'slug') || name);
  const pricingModel = getString(formData, 'pricingModel') || 'free';
  const priceCents = pricingModel === 'paid' ? getNumber(formData, 'priceCents', 0) : 0;

  const payload = {
    slug,
    name,
    short_description: getString(formData, 'shortDescription') || 'Tema personalizado da IRIS.',
    long_description: getString(formData, 'longDescription') || 'Tema criado no marketplace da IRIS.',
    author_name: getString(formData, 'authorName') || 'Criador IRIS',
    author_user_id: user.id,
    category: getString(formData, 'category') || 'themes',
    pricing_model: pricingModel,
    price_cents: priceCents,
    status: 'published',
    is_featured: false,
    cover_image_path: getString(formData, 'coverImagePath') || null,
    light_tokens: tokens(formData, 'light'),
    dark_tokens: tokens(formData, 'dark'),
    background_tokens: {
      type: getString(formData, 'backgroundType') || 'radial-soft',
      animated: getString(formData, 'backgroundAnimated') === 'true',
      intensity: getString(formData, 'backgroundIntensity') || 'soft',
    },
    typography_tokens: {
      fontStyle: getString(formData, 'fontStyle') || 'editorial',
    },
    layout_tokens: {
      radius: getString(formData, 'radius') || 'soft',
      spacing: getString(formData, 'spacing') || 'comfortable',
      glass: getString(formData, 'glass') || 'soft',
    },
    animation_tokens: {
      motion: getString(formData, 'motion') || 'balanced',
      backgroundAnimation: getString(formData, 'backgroundAnimation') || 'none',
    },
    tags: getString(formData, 'tags')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
    metadata: {
      createdFrom: 'marketplace-creator',
      version: '1.0.0',
    },
  };

  const { error } = await supabase
    .from('iris_theme_marketplace_items')
    .upsert(payload, {
      onConflict: 'slug',
    });

  if (error) {
    console.error('[IRIS_THEME_PUBLISH_FAILED]', error);

    return {
      ok: false,
      error: 'database',
      message: error.message,
    };
  }

  await supabase
    .from('iris_theme_creator_profiles')
    .upsert(
      {
        user_id: user.id,
        display_name: payload.author_name,
        can_publish: true,
        creator_status: 'active',
      },
      {
        onConflict: 'user_id',
      },
    );

  revalidatePath('/marketplace');
  revalidatePath('/marketplace/creator');

  return {
    ok: true,
    slug,
  };
}
TS

cat > "src/app/api/theme/me/route.ts" <<'TS'
import { NextResponse } from 'next/server';
import { createServer } from '@/lib/supabase/server';
import {
  defaultAppearancePreferences,
  defaultThemeMode,
  defaultThemeSlug,
  irisThemeCatalog,
  normalizeAppearancePreferences,
  normalizeThemeMode,
} from '@/lib/themes/themeCatalog';
import { mapThemeRowToDefinition } from '@/lib/themes/themeMappers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const supabase = createServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: themeRows } = await supabase
    .from('iris_theme_marketplace_items')
    .select('*')
    .eq('status', 'published')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  const dbThemes = Array.isArray(themeRows)
    ? themeRows.map((row) => mapThemeRowToDefinition(row as Record<string, unknown>))
    : [];

  if (!user) {
    return NextResponse.json({
      authenticated: false,
      themeSlug: defaultThemeSlug,
      mode: defaultThemeMode,
      preferences: defaultAppearancePreferences,
      themes: dbThemes.length ? dbThemes : irisThemeCatalog,
    });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('active_theme_slug, theme_mode, theme_preferences')
    .eq('id', user.id)
    .maybeSingle();

  const { data: libraryRows } = await supabase
    .from('iris_user_theme_library')
    .select('theme_slug, is_active, installed_at, activated_at, settings')
    .eq('user_id', user.id);

  return NextResponse.json({
    authenticated: true,
    themeSlug:
      typeof profile?.active_theme_slug === 'string'
        ? profile.active_theme_slug
        : defaultThemeSlug,
    mode: normalizeThemeMode(profile?.theme_mode),
    preferences: normalizeAppearancePreferences(profile?.theme_preferences),
    themes: dbThemes.length ? dbThemes : irisThemeCatalog,
    library: libraryRows || [],
  });
}
TS

cat > "src/app/(app)/settings/appearance/_components/AppearanceThemeCarousel.tsx" <<'TSX'
'use client';

import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import type { IrisThemeDefinition } from '@/lib/themes/themeTypes';

export function AppearanceThemeCarousel({
  themes,
  activeSlug,
  onActivate,
}: {
  themes: IrisThemeDefinition[];
  activeSlug: string;
  onActivate: (slug: string) => void;
}) {
  return (
    <section className="overflow-hidden rounded-[34px] border border-[var(--iris-color-border)] bg-white/55 p-5 shadow-[0_20px_70px_var(--iris-color-shadow)] backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
            Biblioteca
          </p>
          <h2 className="mt-2 font-display text-[2rem] leading-none tracking-[-0.055em]">
            Temas adquiridos
          </h2>
        </div>

        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--iris-color-border)] bg-white/70"
          >
            <ChevronLeft size={16} strokeWidth={1.8} />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--iris-color-border)] bg-white/70"
          >
            <ChevronRight size={16} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <div className="flex snap-x gap-4 overflow-x-auto pb-2">
        {themes.map((theme) => {
          const active = theme.slug === activeSlug;

          return (
            <article
              key={theme.slug}
              className="min-w-[280px] snap-start rounded-[28px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] p-4"
            >
              <div
                className="h-36 rounded-[24px] border border-white/70"
                style={{
                  background: `
                    radial-gradient(circle at 18% 18%, ${theme.lightTokens.primary}, transparent 35%),
                    radial-gradient(circle at 82% 22%, ${theme.lightTokens.accent}, transparent 34%),
                    linear-gradient(135deg, ${theme.lightTokens.background}, ${theme.lightTokens.accentSoft})
                  `,
                }}
              />

              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-[1.55rem] leading-none tracking-[-0.05em]">
                    {theme.name}
                  </h3>
                  <p className="mt-2 text-sm leading-5 text-[#747D79]">
                    {theme.priceLabel}
                  </p>
                </div>

                {active ? (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--iris-color-primary)] text-white">
                    <Check size={16} strokeWidth={1.8} />
                  </span>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => onActivate(theme.slug)}
                className={[
                  'mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-full px-4 text-sm font-semibold transition',
                  active
                    ? 'border border-[var(--iris-color-border)] bg-white/70 text-[var(--iris-text-primary)]'
                    : 'bg-[var(--iris-color-primary)] text-white',
                ].join(' ')}
              >
                {active ? 'Ativo' : 'Usar tema'}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
TSX

cat > "src/app/(app)/settings/appearance/AppearanceSettingsClient.tsx" <<'TSX'
'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import {
  ArrowLeft,
  CaseSensitive,
  GalleryHorizontalEnd,
  LayoutGrid,
  Moon,
  Move,
  Palette,
  Ruler,
  Save,
  ShoppingBag,
  Sparkles,
  Sun,
  Type,
  Monitor,
} from 'lucide-react';
import { useIrisTheme } from '@/components/theme/IrisThemeProvider';
import { saveThemePreferenceAction } from '@/lib/actions/theme.actions';
import type { IrisAppearancePreferences, IrisThemeMode } from '@/lib/themes/themeTypes';
import { AppearanceThemeCarousel } from './_components/AppearanceThemeCarousel';

const preferenceGroups = [
  {
    key: 'fontStyle',
    title: 'Estilo das fontes',
    description: 'Define a personalidade tipográfica da interface.',
    icon: Type,
    options: [
      ['editorial', 'Editorial'],
      ['modern', 'Moderna'],
      ['soft', 'Suave'],
      ['mono', 'Mono'],
    ],
  },
  {
    key: 'fontScale',
    title: 'Tamanho das fontes',
    description: 'Ajusta a escala geral da leitura.',
    icon: CaseSensitive,
    options: [
      ['small', 'Menor'],
      ['normal', 'Normal'],
      ['large', 'Maior'],
    ],
  },
  {
    key: 'spacing',
    title: 'Espaçamento',
    description: 'Controla a densidade visual das telas.',
    icon: Ruler,
    options: [
      ['compact', 'Compacto'],
      ['comfortable', 'Confortável'],
      ['airy', 'Aberto'],
    ],
  },
  {
    key: 'radius',
    title: 'Arredondamento',
    description: 'Muda o formato dos cards e controles.',
    icon: LayoutGrid,
    options: [
      ['sharp', 'Reto'],
      ['soft', 'Suave'],
      ['dream', 'Dream'],
    ],
  },
  {
    key: 'motion',
    title: 'Movimento',
    description: 'Define animações, transições e fundos vivos.',
    icon: Move,
    options: [
      ['reduced', 'Reduzido'],
      ['balanced', 'Equilibrado'],
      ['expressive', 'Expressivo'],
    ],
  },
  {
    key: 'glass',
    title: 'Transparência',
    description: 'Controla o nível de vidro/blur.',
    icon: GalleryHorizontalEnd,
    options: [
      ['none', 'Mínimo'],
      ['soft', 'Suave'],
      ['strong', 'Forte'],
    ],
  },
] as const;

export function AppearanceSettingsClient() {
  const {
    themeSlug,
    mode,
    resolvedMode,
    preferences,
    themes,
    activateTheme,
    setMode,
    setPreferences,
  } = useIrisTheme();
  const [pending, startTransition] = useTransition();

  function persist(nextThemeSlug: string, nextMode: IrisThemeMode, nextPreferences: IrisAppearancePreferences) {
    const formData = new FormData();

    formData.set('themeSlug', nextThemeSlug);
    formData.set('mode', nextMode);
    formData.set('fontStyle', nextPreferences.fontStyle);
    formData.set('fontScale', nextPreferences.fontScale);
    formData.set('spacing', nextPreferences.spacing);
    formData.set('radius', nextPreferences.radius);
    formData.set('motion', nextPreferences.motion);
    formData.set('glass', nextPreferences.glass);

    startTransition(async () => {
      await saveThemePreferenceAction(formData);
    });
  }

  function handleTheme(slug: string) {
    activateTheme(slug, mode, preferences, themes);
    persist(slug, mode, preferences);
  }

  function handleMode(nextMode: IrisThemeMode) {
    setMode(nextMode);
    persist(themeSlug, nextMode, preferences);
  }

  function handlePreference(key: keyof IrisAppearancePreferences, value: string) {
    const nextPreferences = {
      ...preferences,
      [key]: value,
    } as IrisAppearancePreferences;

    setPreferences(nextPreferences);
    persist(themeSlug, mode, nextPreferences);
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-5 py-8 text-[#1B3A2E] sm:px-8 lg:px-12 lg:py-10">
      <div className="mx-auto w-full max-w-[1560px]">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/settings"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#DDE6DA] bg-white/70 px-4 text-sm font-semibold text-[#1B3A2E] transition hover:bg-white"
          >
            <ArrowLeft size={15} strokeWidth={1.8} />
            Voltar
          </Link>

          <Link
            href="/marketplace"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#DDE6DA] bg-white/70 px-4 text-sm font-semibold text-[#476153] transition hover:bg-white hover:text-[#1B3A2E]"
          >
            <ShoppingBag size={15} strokeWidth={1.8} />
            Marketplace
          </Link>
        </div>

        <section className="iris-theme-card relative overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 iris-theme-swatch opacity-50" />

          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <div className="mb-8 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/40 px-3 py-1.5 text-xs font-medium text-[#476153] backdrop-blur-md">
                  <Palette size={13} strokeWidth={1.8} />
                  Aparência global
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/40 px-3 py-1.5 text-xs font-medium text-[#476153] backdrop-blur-md">
                  <Save size={13} strokeWidth={1.8} />
                  {pending ? 'Salvando...' : 'Aplicação imediata'}
                </span>
              </div>

              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#747D79]">
                Aparência
              </p>

              <h1 className="mt-3 max-w-4xl font-display text-[2.35rem] leading-[1.03] tracking-[-0.055em] text-[#1B3A2E] sm:text-[3.2rem] lg:text-[3.8rem]">
                Tema, leitura, espaço e movimento em todo o app.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-[#476153]">
                Agora a aparência muda a IRIS inteira: cores, modo escuro, fonte,
                espaçamento, radius, transparência e animações.
              </p>
            </div>

            <div className="rounded-[28px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] p-5">
              <p className="text-sm font-semibold">Estado atual</p>
              <p className="mt-2 font-display text-[2.15rem] leading-none tracking-[-0.06em]">
                {themes.find((theme) => theme.slug === themeSlug)?.name || themeSlug}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#747D79]">
                Modo resolvido: {resolvedMode === 'dark' ? 'Escuro' : 'Claro'}.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-8">
            <AppearanceThemeCarousel
              themes={themes}
              activeSlug={themeSlug}
              onActivate={handleTheme}
            />

            <section className="iris-theme-card p-5 sm:p-6">
              <div className="mb-6">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
                  Personalização
                </p>
                <h2 className="mt-2 font-display text-[2rem] leading-none tracking-[-0.055em]">
                  Leitura e comportamento visual
                </h2>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                {preferenceGroups.map((group) => {
                  const Icon = group.icon;
                  const current = preferences[group.key as keyof IrisAppearancePreferences];

                  return (
                    <article
                      key={group.key}
                      className="rounded-[28px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] p-5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--iris-color-primary)] text-white">
                          <Icon size={17} strokeWidth={1.8} />
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold">{group.title}</h3>
                          <p className="mt-1 text-sm leading-6 text-[#747D79]">
                            {group.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {group.options.map(([value, label]) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() =>
                              handlePreference(
                                group.key as keyof IrisAppearancePreferences,
                                value,
                              )
                            }
                            className={[
                              'rounded-full border px-4 py-2 text-sm font-semibold transition',
                              current === value
                                ? 'border-[var(--iris-color-primary)] bg-[var(--iris-color-primary)] text-white'
                                : 'border-[var(--iris-color-border)] bg-white/60 text-[var(--iris-text-primary)] hover:bg-white',
                            ].join(' ')}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </section>

          <aside className="space-y-6 xl:sticky xl:top-8 xl:self-start">
            <section className="iris-theme-card p-5">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
                Modo
              </p>
              <h3 className="mt-2 font-display text-[1.9rem] leading-none tracking-[-0.05em]">
                Claro, escuro ou sistema
              </h3>

              <div className="mt-6 space-y-3">
                {[
                  { key: 'light', label: 'Claro', icon: Sun },
                  { key: 'dark', label: 'Escuro', icon: Moon },
                  { key: 'system', label: 'Sistema', icon: Monitor },
                ].map((item) => {
                  const Icon = item.icon;
                  const active = mode === item.key;

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleMode(item.key as IrisThemeMode)}
                      className={[
                        'flex min-h-12 w-full items-center justify-between rounded-full border px-4 text-sm font-semibold transition',
                        active
                          ? 'border-[var(--iris-color-primary)] bg-[var(--iris-color-primary)] text-white'
                          : 'border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)]',
                      ].join(' ')}
                    >
                      <span className="inline-flex items-center gap-2">
                        <Icon size={16} strokeWidth={1.8} />
                        {item.label}
                      </span>
                      {active ? 'Ativo' : ''}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[32px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] p-5">
              <Sparkles size={20} strokeWidth={1.8} />
              <p className="mt-4 text-sm font-semibold">Prévia real</p>
              <p className="mt-2 text-sm leading-6 text-[#747D79]">
                Todo ajuste é aplicado no documento global, então páginas antigas e
                novas respondem juntas.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
TSX

cat > "src/app/(app)/settings/appearance/page.tsx" <<'TSX'
import { AppearanceSettingsClient } from './AppearanceSettingsClient';

export const dynamic = 'force-dynamic';

export default function AppearanceSettingsPage() {
  return <AppearanceSettingsClient />;
}
TSX

cat > "src/app/(app)/marketplace/_utils/marketplaceSearch.ts" <<'TS'
import type { IrisThemeDefinition, IrisThemePricingModel } from '@/lib/themes/themeTypes';

export type MarketplaceFilter = {
  query: string;
  category: string;
  pricing: 'all' | IrisThemePricingModel;
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function scoreTheme(theme: IrisThemeDefinition, query: string) {
  const q = normalize(query.trim());

  if (!q) return theme.isFeatured ? 10 : 1;

  const fields = [
    [theme.name, 12],
    [theme.shortDescription, 8],
    [theme.longDescription, 5],
    [theme.authorName, 4],
    [theme.category, 4],
    [theme.pricingModel, 3],
    [theme.priceLabel, 3],
    [theme.tags.join(' '), 6],
  ] as const;

  return fields.reduce((score, [field, weight]) => {
    const normalized = normalize(field);
    if (normalized === q) return score + weight * 2;
    if (normalized.startsWith(q)) return score + weight * 1.4;
    if (normalized.includes(q)) return score + weight;
    return score;
  }, 0);
}

export function filterMarketplaceThemes(
  themes: IrisThemeDefinition[],
  filter: MarketplaceFilter,
) {
  return themes
    .map((theme) => ({
      theme,
      score: scoreTheme(theme, filter.query),
    }))
    .filter(({ theme, score }) => {
      const categoryMatch =
        filter.category === 'all' || theme.category === filter.category;

      const pricingMatch =
        filter.pricing === 'all' || theme.pricingModel === filter.pricing;

      const queryMatch = !filter.query.trim() || score > 0;

      return categoryMatch && pricingMatch && queryMatch;
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (Number(b.theme.isFeatured) !== Number(a.theme.isFeatured)) {
        return Number(b.theme.isFeatured) - Number(a.theme.isFeatured);
      }
      return b.theme.ratingAverage - a.theme.ratingAverage;
    })
    .map(({ theme }) => theme);
}
TS

cat > "src/app/(app)/marketplace/_components/ThemeDetailSheet.tsx" <<'TSX'
'use client';

import { X, Star, Download, Code2, UserRound, BadgeCheck } from 'lucide-react';
import type { IrisThemeDefinition } from '@/lib/themes/themeTypes';

export function ThemeDetailSheet({
  theme,
  open,
  active,
  installing,
  installProgress,
  onClose,
  onInstall,
}: {
  theme: IrisThemeDefinition | null;
  open: boolean;
  active: boolean;
  installing: boolean;
  installProgress: number;
  onClose: () => void;
  onInstall: () => void;
}) {
  if (!theme) return null;

  return (
    <div
      className={[
        'fixed inset-0 z-50 transition',
        open ? 'pointer-events-auto' : 'pointer-events-none',
      ].join(' ')}
    >
      <div
        className={[
          'absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity',
          open ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        onClick={onClose}
      />

      <aside
        className={[
          'absolute right-0 top-0 h-full w-full max-w-[560px] overflow-y-auto border-l border-[var(--iris-color-border)] bg-[var(--iris-bg-primary)] p-5 shadow-[-30px_0_100px_rgba(0,0,0,0.18)] transition-transform duration-300 sm:p-7',
          open ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <span className="rounded-full border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            {theme.priceLabel}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)]"
          >
            <X size={17} strokeWidth={1.8} />
          </button>
        </div>

        <div
          className="h-64 overflow-hidden rounded-[34px] border border-white/70"
          style={{
            background: `
              radial-gradient(circle at 18% 18%, ${theme.lightTokens.primary}, transparent 35%),
              radial-gradient(circle at 82% 20%, ${theme.lightTokens.accent}, transparent 34%),
              linear-gradient(135deg, ${theme.lightTokens.background}, ${theme.lightTokens.accentSoft})
            `,
          }}
        />

        <div className="mt-7">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
            {theme.category}
          </p>

          <h2 className="mt-2 font-display text-[3rem] leading-none tracking-[-0.065em]">
            {theme.name}
          </h2>

          <p className="mt-4 text-base leading-7 text-[#747D79]">
            {theme.longDescription}
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[24px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] p-4">
            <Star size={17} strokeWidth={1.8} />
            <p className="mt-3 text-sm font-semibold">
              {theme.ratingAverage.toFixed(1)}
            </p>
            <p className="mt-1 text-xs text-[#747D79]">
              {theme.ratingCount} avaliações
            </p>
          </div>

          <div className="rounded-[24px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] p-4">
            <UserRound size={17} strokeWidth={1.8} />
            <p className="mt-3 text-sm font-semibold">{theme.authorName}</p>
            <p className="mt-1 text-xs text-[#747D79]">Autor</p>
          </div>

          <div className="rounded-[24px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] p-4">
            <BadgeCheck size={17} strokeWidth={1.8} />
            <p className="mt-3 text-sm font-semibold">
              {theme.status === 'native' ? 'Nativo' : 'Publicado'}
            </p>
            <p className="mt-1 text-xs text-[#747D79]">Status</p>
          </div>
        </div>

        <section className="mt-7 rounded-[30px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] p-5">
          <h3 className="text-sm font-semibold">Exemplos no app</h3>

          <div className="mt-5 grid gap-4">
            <div className="rounded-[26px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-surface)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
                Card de memória
              </p>
              <p className="mt-2 font-display text-2xl leading-none tracking-[-0.05em]">
                Uma tarde guardada
              </p>
              <p className="mt-3 text-sm leading-6 text-[#747D79]">
                O tema muda a atmosfera sem quebrar a hierarquia visual.
              </p>
            </div>

            <button
              type="button"
              className="min-h-11 rounded-full bg-[var(--iris-color-primary)] px-5 text-sm font-semibold text-white"
            >
              Botão principal
            </button>
          </div>
        </section>

        <section className="mt-7 rounded-[30px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] p-5">
          <div className="flex items-center gap-2">
            <Code2 size={17} strokeWidth={1.8} />
            <h3 className="text-sm font-semibold">Código do tema</h3>
          </div>

          <pre className="mt-4 max-h-64 overflow-auto rounded-[22px] bg-black p-4 text-xs leading-5 text-white">
{JSON.stringify(
  {
    slug: theme.slug,
    lightTokens: theme.lightTokens,
    darkTokens: theme.darkTokens,
    background: theme.background,
    typography: theme.typography,
    layout: theme.layout,
    animation: theme.animation,
  },
  null,
  2,
)}
          </pre>
        </section>

        <div className="sticky bottom-0 mt-7 border-t border-[var(--iris-color-border)] bg-[var(--iris-bg-primary)] pt-5">
          {installing ? (
            <div className="rounded-[24px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] p-4">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>Baixando e instalando...</span>
                <span>{installProgress}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--iris-color-border)]">
                <div
                  className="h-full rounded-full bg-[var(--iris-color-primary)] transition-all"
                  style={{ width: `${installProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onInstall}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--iris-color-primary)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--iris-color-primary-deep)]"
            >
              <Download size={16} strokeWidth={1.8} />
              {active ? 'Tema ativo' : 'Baixar, instalar e ativar'}
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
TSX

cat > "src/app/(app)/marketplace/_components/MarketplaceThemeCard.tsx" <<'TSX'
'use client';

import { Check, Download, Star } from 'lucide-react';
import type { IrisThemeDefinition } from '@/lib/themes/themeTypes';

export function MarketplaceThemeCard({
  theme,
  active,
  onOpen,
  onInstall,
}: {
  theme: IrisThemeDefinition;
  active: boolean;
  onOpen: () => void;
  onInstall: () => void;
}) {
  return (
    <article className="group overflow-hidden rounded-[34px] border border-[var(--iris-color-border)] bg-white/58 p-4 shadow-[0_18px_60px_var(--iris-color-shadow)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white">
      <button
        type="button"
        onClick={onOpen}
        className="block w-full text-left"
      >
        <div
          className="relative h-52 overflow-hidden rounded-[28px] border border-white/70"
          style={{
            background: `
              radial-gradient(circle at 18% 18%, ${theme.lightTokens.primary}, transparent 35%),
              radial-gradient(circle at 82% 20%, ${theme.lightTokens.accent}, transparent 34%),
              linear-gradient(135deg, ${theme.lightTokens.background}, ${theme.lightTokens.accentSoft})
            `,
          }}
        >
          <div className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/60 px-3 py-1.5 text-xs font-semibold text-[#476153] backdrop-blur-md">
            {theme.priceLabel}
          </div>

          {active ? (
            <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--iris-color-primary)] text-white">
              <Check size={16} strokeWidth={1.8} />
            </div>
          ) : null}
        </div>

        <div className="mt-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#747D79]">
                {theme.category}
              </p>
              <h2 className="mt-2 font-display text-[2rem] leading-none tracking-[-0.055em]">
                {theme.name}
              </h2>
            </div>

            <div className="flex items-center gap-1 rounded-full border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] px-3 py-1.5 text-xs font-semibold">
              <Star size={13} strokeWidth={1.8} />
              {theme.ratingAverage.toFixed(1)}
            </div>
          </div>

          <p className="mt-3 text-sm leading-6 text-[#747D79]">
            {theme.shortDescription}
          </p>
        </div>
      </button>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={onOpen}
          className="min-h-10 flex-1 rounded-full border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] px-4 text-sm font-semibold"
        >
          Ver tema
        </button>

        <button
          type="button"
          onClick={onInstall}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[var(--iris-color-primary)] px-4 text-sm font-semibold text-white"
        >
          <Download size={15} strokeWidth={1.8} />
          Instalar
        </button>
      </div>
    </article>
  );
}
TSX

cat > "src/app/(app)/marketplace/MarketplaceClient.tsx" <<'TSX'
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState, useTransition } from 'react';
import {
  ArrowLeft,
  Brush,
  Code2,
  Filter,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useIrisTheme } from '@/components/theme/IrisThemeProvider';
import { installThemeAction } from '@/lib/actions/theme.actions';
import type {
  IrisAppearancePreferences,
  IrisThemeDefinition,
  IrisThemeMode,
  IrisThemePricingModel,
} from '@/lib/themes/themeTypes';
import { MarketplaceThemeCard } from './_components/MarketplaceThemeCard';
import { ThemeDetailSheet } from './_components/ThemeDetailSheet';
import { filterMarketplaceThemes } from './_utils/marketplaceSearch';

const categories = [
  ['all', 'Todos'],
  ['themes', 'Temas'],
  ['backgrounds', 'Backgrounds'],
  ['typography', 'Fontes'],
  ['icons', 'Ícones'],
  ['motion', 'Animações'],
  ['seasonal', 'Sazonais'],
] as const;

const pricingFilters = [
  ['all', 'Todos'],
  ['free', 'Gratuito'],
  ['subscription', 'Assinatura'],
  ['paid', 'Pago à parte'],
] as const;

export function MarketplaceClient({ initialThemes }: { initialThemes: IrisThemeDefinition[] }) {
  const { themeSlug, mode, preferences, activateTheme, themes } = useIrisTheme();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [pricing, setPricing] = useState<'all' | IrisThemePricingModel>('all');
  const [selected, setSelected] = useState<IrisThemeDefinition | null>(initialThemes[0] || null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [installingSlug, setInstallingSlug] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [, startTransition] = useTransition();

  const marketplaceThemes = useMemo(
    () => filterMarketplaceThemes(initialThemes, { query, category, pricing }),
    [initialThemes, query, category, pricing],
  );

  function persistInstall(
    theme: IrisThemeDefinition,
    nextMode: IrisThemeMode,
    nextPreferences: IrisAppearancePreferences,
  ) {
    const formData = new FormData();

    formData.set('themeSlug', theme.slug);
    formData.set('mode', nextMode);
    formData.set('fontStyle', nextPreferences.fontStyle);
    formData.set('fontScale', nextPreferences.fontScale);
    formData.set('spacing', nextPreferences.spacing);
    formData.set('radius', nextPreferences.radius);
    formData.set('motion', nextPreferences.motion);
    formData.set('glass', nextPreferences.glass);

    startTransition(async () => {
      await installThemeAction(formData);
    });
  }

  function installTheme(theme: IrisThemeDefinition) {
    setSelected(theme);
    setSheetOpen(true);
    setInstallingSlug(theme.slug);
    setProgress(8);

    const steps = [22, 44, 68, 86, 100];

    steps.forEach((step, index) => {
      window.setTimeout(() => {
        setProgress(step);

        if (step === 100) {
          activateTheme(theme.slug, mode, preferences, [...themes, ...initialThemes]);
          persistInstall(theme, mode, preferences);

          window.setTimeout(() => {
            setInstallingSlug(null);
            setProgress(0);
          }, 520);
        }
      }, 340 + index * 280);
    });
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-5 py-8 text-[#1B3A2E] sm:px-8 lg:px-12 lg:py-10">
      <div className="mx-auto w-full max-w-[1680px]">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/iris"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#DDE6DA] bg-white/70 px-4 text-sm font-semibold text-[#1B3A2E] transition hover:bg-white"
          >
            <ArrowLeft size={15} strokeWidth={1.8} />
            Voltar para IRIS
          </Link>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/marketplace/creator"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[var(--iris-color-primary)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--iris-color-primary-deep)]"
            >
              <Code2 size={15} strokeWidth={1.8} />
              Criar tema
            </Link>

            <Link
              href="/settings/appearance"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#DDE6DA] bg-white/70 px-4 text-sm font-semibold text-[#476153] transition hover:bg-white hover:text-[#1B3A2E]"
            >
              <Settings size={15} strokeWidth={1.8} />
              Aparência
            </Link>
          </div>
        </div>

        <section className="relative min-h-[460px] overflow-hidden rounded-[44px] border border-white/70 bg-[#111A16] p-6 text-white shadow-[0_34px_120px_rgba(15,21,18,0.22)] sm:p-8 lg:p-10">
          <Image
            src="/iris/brand/cards/marketplace.png"
            alt="IRIS Marketplace"
            fill
            priority
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/42 to-black/10" />

          <div className="relative grid min-h-[380px] gap-8 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-end">
            <div>
              <div className="mb-8 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/76 backdrop-blur-md">
                  <ShoppingBag size={13} strokeWidth={1.8} />
                  Marketplace
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/76 backdrop-blur-md">
                  <Sparkles size={13} strokeWidth={1.8} />
                  Temas e extensões visuais
                </span>
              </div>

              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-white/50">
                IRIS Marketplace
              </p>

              <h1 className="mt-3 max-w-4xl font-display text-[2.7rem] leading-[1.01] tracking-[-0.065em] sm:text-[4rem] lg:text-[5rem]">
                Personalize a atmosfera da sua IRIS.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-white/68">
                Temas, fundos, tipografia, animações e pacotes visuais. Começamos
                com o tema Lilás, mas a estrutura já aceita criações da comunidade.
              </p>
            </div>

            <div className="rounded-[34px] border border-white/12 bg-white/[0.08] p-5 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#111A16]">
                  <Brush size={24} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Busca inteligente</p>
                  <p className="mt-1 text-sm text-white/60">
                    Nome, autor, tags, categoria e preço.
                  </p>
                </div>
              </div>

              <div className="relative mt-6">
                <Search
                  size={17}
                  strokeWidth={1.8}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar: lilás, gratuito, autor, dark, animação..."
                  className="min-h-12 w-full rounded-full border border-white/14 bg-white/10 pl-11 pr-4 text-sm font-medium text-white outline-none placeholder:text-white/42 focus:border-white/50"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[34px] border border-[var(--iris-color-border)] bg-white/55 p-5 shadow-[0_20px_70px_var(--iris-color-shadow)] backdrop-blur-xl">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Filter size={16} strokeWidth={1.8} />
              Filtros
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  className={[
                    'shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition',
                    category === key
                      ? 'border-[var(--iris-color-primary)] bg-[var(--iris-color-primary)] text-white'
                      : 'border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)]',
                  ].join(' ')}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {pricingFilters.map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPricing(key)}
                  className={[
                    'shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition',
                    pricing === key
                      ? 'border-[var(--iris-color-primary)] bg-[var(--iris-color-primary)] text-white'
                      : 'border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)]',
                  ].join(' ')}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {marketplaceThemes.map((theme) => (
            <MarketplaceThemeCard
              key={theme.slug}
              theme={theme}
              active={theme.slug === themeSlug}
              onOpen={() => {
                setSelected(theme);
                setSheetOpen(true);
              }}
              onInstall={() => installTheme(theme)}
            />
          ))}
        </section>

        {marketplaceThemes.length === 0 ? (
          <section className="mt-8 rounded-[34px] border border-dashed border-[var(--iris-color-border)] bg-white/40 p-10 text-center">
            <p className="font-display text-[2.4rem] leading-none tracking-[-0.06em]">
              Nenhum tema encontrado.
            </p>
            <p className="mt-4 text-sm leading-6 text-[#747D79]">
              Tente buscar por gratuito, lilás, animação, dark, autor ou categoria.
            </p>
          </section>
        ) : null}

        <ThemeDetailSheet
          theme={selected}
          open={sheetOpen}
          active={Boolean(selected && selected.slug === themeSlug)}
          installing={Boolean(selected && installingSlug === selected.slug)}
          installProgress={progress}
          onClose={() => setSheetOpen(false)}
          onInstall={() => selected && installTheme(selected)}
        />
      </div>
    </main>
  );
}
TSX

cat > "src/app/(app)/marketplace/page.tsx" <<'TSX'
import { createServer } from '@/lib/supabase/server';
import { irisThemeCatalog } from '@/lib/themes/themeCatalog';
import { mapThemeRowToDefinition } from '@/lib/themes/themeMappers';
import { MarketplaceClient } from './MarketplaceClient';

export const dynamic = 'force-dynamic';

export default async function MarketplacePage() {
  const supabase = createServer();

  const { data, error } = await supabase
    .from('iris_theme_marketplace_items')
    .select('*')
    .eq('status', 'published')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  const dbThemes =
    !error && Array.isArray(data)
      ? data.map((row) => mapThemeRowToDefinition(row as Record<string, unknown>))
      : [];

  const merged = [...irisThemeCatalog];

  dbThemes.forEach((theme) => {
    if (!merged.some((item) => item.slug === theme.slug)) {
      merged.push(theme);
    }
  });

  return <MarketplaceClient initialThemes={merged} />;
}
TSX

cat > "src/app/(app)/marketplace/creator/ThemeCreatorClient.tsx" <<'TSX'
'use client';

import Link from 'next/link';
import { useMemo, useState, useTransition } from 'react';
import {
  ArrowLeft,
  Check,
  Code2,
  Eye,
  Image as ImageIcon,
  Palette,
  Send,
  Sparkles,
  Type,
} from 'lucide-react';
import { publishThemeAction } from '@/lib/actions/marketplace-theme.actions';
import type { IrisThemeDefinition } from '@/lib/themes/themeTypes';

const defaultTheme = {
  name: 'Aurora Particular',
  slug: 'aurora-particular',
  authorName: 'Criador IRIS',
  shortDescription: 'Um tema autoral com aura suave e visual editorial.',
  longDescription:
    'Tema criado no editor da IRIS com tokens próprios, versão escura, background configurável e atmosfera personalizada.',
  coverImagePath: '/iris/brand/cards/marketplace.png',
  category: 'themes',
  pricingModel: 'free',
  priceCents: 0,
  tags: 'autoral, editorial, suave',
  light: {
    primary: '#6F4BB2',
    primaryDeep: '#4E347F',
    primarySoft: '#EFE7F6',
    accent: '#9A7CA7',
    accentSoft: '#F7F1FA',
    emotion: '#B899D6',
    background: '#FAF7F2',
    surface: '#FFFFFF',
    surfaceSoft: '#FFFDF8',
    text: '#3A295F',
    textSecondary: '#5E4A76',
    textMuted: '#887898',
    border: '#E6DDF0',
  },
  dark: {
    primary: '#C8A8FF',
    primaryDeep: '#EFE3FF',
    primarySoft: '#2A1F3A',
    accent: '#B899D6',
    accentSoft: '#22172F',
    emotion: '#D8B9F4',
    background: '#0F0B16',
    surface: '#171021',
    surfaceSoft: '#20162D',
    text: '#FAF7FF',
    textSecondary: '#D8CEE6',
    textMuted: '#A89CB8',
    border: '#3A2B4A',
  },
  backgroundType: 'aurora-lilac',
  backgroundAnimated: true,
  backgroundIntensity: 'soft',
  fontStyle: 'editorial',
  radius: 'dream',
  spacing: 'comfortable',
  glass: 'soft',
  motion: 'balanced',
  backgroundAnimation: 'slow-aurora',
};

type CreatorState = typeof defaultTheme;

function colorFields(prefix: 'light' | 'dark', values: CreatorState, setValues: (value: CreatorState) => void) {
  const tokenSet = values[prefix];

  return Object.entries(tokenSet).map(([key, value]) => (
    <label key={`${prefix}-${key}`} className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#747D79]">
        {key}
      </span>
      <div className="mt-2 flex items-center gap-3 rounded-[18px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] p-2">
        <input
          type="color"
          value={value}
          onChange={(event) =>
            setValues({
              ...values,
              [prefix]: {
                ...tokenSet,
                [key]: event.target.value,
              },
            })
          }
          className="h-10 w-12 rounded-xl border-0 bg-transparent"
        />
        <input
          value={value}
          onChange={(event) =>
            setValues({
              ...values,
              [prefix]: {
                ...tokenSet,
                [key]: event.target.value,
              },
            })
          }
          className="min-h-10 flex-1 bg-transparent px-2 text-sm font-semibold outline-none"
        />
      </div>
    </label>
  ));
}

export function ThemeCreatorClient() {
  const [values, setValues] = useState<CreatorState>(defaultTheme);
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [result, setResult] = useState<string>('');
  const [pending, startTransition] = useTransition();

  const previewTokens = values[mode];

  const themeJson = useMemo(
    () => ({
      slug: values.slug,
      name: values.name,
      authorName: values.authorName,
      category: values.category,
      pricingModel: values.pricingModel,
      priceCents: values.priceCents,
      coverImagePath: values.coverImagePath,
      lightTokens: values.light,
      darkTokens: values.dark,
      background: {
        type: values.backgroundType,
        animated: values.backgroundAnimated,
        intensity: values.backgroundIntensity,
      },
      typography: {
        fontStyle: values.fontStyle,
      },
      layout: {
        radius: values.radius,
        spacing: values.spacing,
        glass: values.glass,
      },
      animation: {
        motion: values.motion,
        backgroundAnimation: values.backgroundAnimation,
      },
      tags: values.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    }),
    [values],
  );

  function publish() {
    const formData = new FormData();

    formData.set('name', values.name);
    formData.set('slug', values.slug);
    formData.set('authorName', values.authorName);
    formData.set('shortDescription', values.shortDescription);
    formData.set('longDescription', values.longDescription);
    formData.set('coverImagePath', values.coverImagePath);
    formData.set('category', values.category);
    formData.set('pricingModel', values.pricingModel);
    formData.set('priceCents', String(values.priceCents));
    formData.set('tags', values.tags);
    formData.set('backgroundType', values.backgroundType);
    formData.set('backgroundAnimated', String(values.backgroundAnimated));
    formData.set('backgroundIntensity', values.backgroundIntensity);
    formData.set('fontStyle', values.fontStyle);
    formData.set('radius', values.radius);
    formData.set('spacing', values.spacing);
    formData.set('glass', values.glass);
    formData.set('motion', values.motion);
    formData.set('backgroundAnimation', values.backgroundAnimation);

    Object.entries(values.light).forEach(([key, value]) => {
      formData.set(`light_${key}`, value);
    });

    Object.entries(values.dark).forEach(([key, value]) => {
      formData.set(`dark_${key}`, value);
    });

    startTransition(async () => {
      const response = await publishThemeAction(formData);
      setResult(response.ok ? `Tema publicado: ${response.slug}` : `Erro: ${response.error}`);
    });
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-5 py-8 text-[#1B3A2E] sm:px-8 lg:px-12 lg:py-10">
      <div className="mx-auto w-full max-w-[1680px]">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/marketplace"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#DDE6DA] bg-white/70 px-4 text-sm font-semibold text-[#1B3A2E] transition hover:bg-white"
          >
            <ArrowLeft size={15} strokeWidth={1.8} />
            Voltar ao marketplace
          </Link>

          <button
            type="button"
            onClick={publish}
            disabled={pending}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--iris-color-primary)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--iris-color-primary-deep)] disabled:opacity-60"
          >
            <Send size={15} strokeWidth={1.8} />
            {pending ? 'Publicando...' : 'Publicar tema'}
          </button>
        </div>

        <section className="relative overflow-hidden rounded-[44px] border border-white/70 bg-[#111A16] p-6 text-white shadow-[0_34px_120px_rgba(15,21,18,0.22)] sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_8%,rgba(154,124,167,0.35),transparent_32%),radial-gradient(circle_at_90%_12%,rgba(111,75,178,0.26),transparent_34%)]" />

          <div className="relative max-w-5xl">
            <div className="mb-8 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/76 backdrop-blur-md">
                <Code2 size={13} strokeWidth={1.8} />
                Creator Studio
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/76 backdrop-blur-md">
                <Sparkles size={13} strokeWidth={1.8} />
                Qualquer usuário autenticado pode publicar
              </span>
            </div>

            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-white/48">
              Criar e publicar temas
            </p>
            <h1 className="mt-3 font-display text-[2.7rem] leading-[1.01] tracking-[-0.065em] sm:text-[4rem] lg:text-[5rem]">
              Desenhe uma atmosfera completa para a IRIS.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/68">
              Configure capa, autor, descrição, light mode, dark mode, background,
              tipografia, espaçamento, radius, glass e animações com prévia real.
            </p>
          </div>
        </section>

        <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_560px]">
          <section className="space-y-6">
            <div className="iris-theme-card p-5">
              <div className="mb-5 flex items-center gap-2">
                <ImageIcon size={18} strokeWidth={1.8} />
                <h2 className="text-sm font-semibold">Informações públicas</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ['name', 'Nome do tema'],
                  ['slug', 'Slug'],
                  ['authorName', 'Autor'],
                  ['coverImagePath', 'Capa / URL pública'],
                  ['shortDescription', 'Descrição curta'],
                  ['tags', 'Tags separadas por vírgula'],
                ].map(([key, label]) => (
                  <label key={key} className="block">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#747D79]">
                      {label}
                    </span>
                    <input
                      value={String(values[key as keyof CreatorState])}
                      onChange={(event) =>
                        setValues({
                          ...values,
                          [key]: event.target.value,
                        })
                      }
                      className="mt-2 min-h-12 w-full rounded-[18px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] px-4 text-sm font-semibold outline-none"
                    />
                  </label>
                ))}
              </div>

              <label className="mt-4 block">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#747D79]">
                  Sobre o tema
                </span>
                <textarea
                  value={values.longDescription}
                  onChange={(event) =>
                    setValues({
                      ...values,
                      longDescription: event.target.value,
                    })
                  }
                  className="mt-2 min-h-32 w-full rounded-[22px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] p-4 text-sm leading-6 outline-none"
                />
              </label>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#747D79]">
                    Categoria
                  </span>
                  <select
                    value={values.category}
                    onChange={(event) =>
                      setValues({
                        ...values,
                        category: event.target.value,
                      })
                    }
                    className="mt-2 min-h-12 w-full rounded-[18px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] px-4 text-sm font-semibold"
                  >
                    <option value="themes">Temas</option>
                    <option value="backgrounds">Backgrounds</option>
                    <option value="typography">Fontes</option>
                    <option value="icons">Ícones</option>
                    <option value="motion">Animações</option>
                    <option value="seasonal">Sazonais</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#747D79]">
                    Preço
                  </span>
                  <select
                    value={values.pricingModel}
                    onChange={(event) =>
                      setValues({
                        ...values,
                        pricingModel: event.target.value,
                      })
                    }
                    className="mt-2 min-h-12 w-full rounded-[18px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] px-4 text-sm font-semibold"
                  >
                    <option value="free">Gratuito</option>
                    <option value="subscription">Assinatura</option>
                    <option value="paid">Pago à parte</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#747D79]">
                    Valor em centavos
                  </span>
                  <input
                    type="number"
                    value={values.priceCents}
                    onChange={(event) =>
                      setValues({
                        ...values,
                        priceCents: Number(event.target.value),
                      })
                    }
                    className="mt-2 min-h-12 w-full rounded-[18px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] px-4 text-sm font-semibold"
                  />
                </label>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="iris-theme-card p-5">
                <div className="mb-5 flex items-center gap-2">
                  <Palette size={18} strokeWidth={1.8} />
                  <h2 className="text-sm font-semibold">Light mode</h2>
                </div>
                <div className="grid gap-4">
                  {colorFields('light', values, setValues)}
                </div>
              </section>

              <section className="iris-theme-card p-5">
                <div className="mb-5 flex items-center gap-2">
                  <Palette size={18} strokeWidth={1.8} />
                  <h2 className="text-sm font-semibold">Dark mode</h2>
                </div>
                <div className="grid gap-4">
                  {colorFields('dark', values, setValues)}
                </div>
              </section>
            </div>

            <section className="iris-theme-card p-5">
              <div className="mb-5 flex items-center gap-2">
                <Type size={18} strokeWidth={1.8} />
                <h2 className="text-sm font-semibold">Comportamento visual</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ['backgroundType', 'Background', ['plain', 'radial-soft', 'aurora-lilac', 'editorial-grid']],
                  ['fontStyle', 'Fonte', ['editorial', 'modern', 'soft', 'mono']],
                  ['radius', 'Radius', ['sharp', 'soft', 'dream']],
                  ['spacing', 'Espaçamento', ['compact', 'comfortable', 'airy']],
                  ['glass', 'Glass', ['none', 'soft', 'strong']],
                  ['motion', 'Movimento', ['reduced', 'balanced', 'expressive']],
                  ['backgroundAnimation', 'Animação de fundo', ['none', 'slow-aurora', 'grain', 'float']],
                ].map(([key, label, options]) => (
                  <label key={String(key)} className="block">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#747D79]">
                      {String(label)}
                    </span>
                    <select
                      value={String(values[key as keyof CreatorState])}
                      onChange={(event) =>
                        setValues({
                          ...values,
                          [key as keyof CreatorState]: event.target.value as never,
                        })
                      }
                      className="mt-2 min-h-12 w-full rounded-[18px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] px-4 text-sm font-semibold"
                    >
                      {(options as string[]).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>

              <label className="mt-5 flex items-center gap-3 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={values.backgroundAnimated}
                  onChange={(event) =>
                    setValues({
                      ...values,
                      backgroundAnimated: event.target.checked,
                    })
                  }
                />
                Background animado
              </label>
            </section>
          </section>

          <aside className="space-y-6 xl:sticky xl:top-8 xl:self-start">
            <section
              className="overflow-hidden rounded-[38px] border border-white/70 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.16)]"
              style={{
                background: `
                  radial-gradient(circle at 18% 18%, ${previewTokens.primary}, transparent 35%),
                  radial-gradient(circle at 82% 16%, ${previewTokens.accent}, transparent 35%),
                  linear-gradient(135deg, ${previewTokens.background}, ${previewTokens.accentSoft})
                `,
                color: previewTokens.text,
              }}
            >
              <div className="mb-5 flex justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setMode('light')}
                  className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-black"
                >
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => setMode('dark')}
                  className="rounded-full bg-black/70 px-4 py-2 text-sm font-semibold text-white"
                >
                  Dark
                </button>
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">
                Preview real
              </p>
              <h2 className="mt-3 font-display text-[3rem] leading-none tracking-[-0.07em]">
                {values.name}
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-6 opacity-75">
                {values.shortDescription}
              </p>

              <div
                className="mt-6 rounded-[28px] border p-5"
                style={{
                  borderColor: previewTokens.border,
                  background: previewTokens.surface,
                  color: previewTokens.text,
                }}
              >
                <p className="text-sm font-semibold">Card de exemplo</p>
                <p className="mt-2 text-sm leading-6" style={{ color: previewTokens.textMuted }}>
                  É assim que cards, textos e superfícies podem ficar no app.
                </p>
                <button
                  type="button"
                  className="mt-5 min-h-10 rounded-full px-5 text-sm font-semibold text-white"
                  style={{ background: previewTokens.primary }}
                >
                  Botão principal
                </button>
              </div>
            </section>

            <section className="iris-theme-card p-5">
              <div className="mb-4 flex items-center gap-2">
                <Eye size={18} strokeWidth={1.8} />
                <h2 className="text-sm font-semibold">JSON em tempo real</h2>
              </div>
              <pre className="max-h-[520px] overflow-auto rounded-[24px] bg-black p-4 text-xs leading-5 text-white">
{JSON.stringify(themeJson, null, 2)}
              </pre>
            </section>

            {result ? (
              <section className="rounded-[28px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] p-5">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Check size={17} strokeWidth={1.8} />
                  {result}
                </div>
              </section>
            ) : null}
          </aside>
        </div>
      </div>
    </main>
  );
}
TSX

cat > "src/app/(app)/marketplace/creator/page.tsx" <<'TSX'
import { redirect } from 'next/navigation';
import { createServer } from '@/lib/supabase/server';
import { ThemeCreatorClient } from './ThemeCreatorClient';

export const dynamic = 'force-dynamic';

export default async function ThemeCreatorPage() {
  const supabase = createServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return <ThemeCreatorClient />;
}
TSX

cat > "src/lib/themes/themeTemplate.example.json" <<'JSON'
{
  "slug": "meu-tema",
  "name": "Meu Tema",
  "authorName": "Seu nome",
  "category": "themes",
  "pricingModel": "free",
  "priceCents": 0,
  "coverImagePath": "/iris/brand/cards/marketplace.png",
  "shortDescription": "Resumo curto do tema.",
  "longDescription": "Descrição completa do tema, intenção visual, atmosfera e casos de uso.",
  "lightTokens": {
    "primary": "#6F4BB2",
    "primaryDeep": "#4E347F",
    "primarySoft": "#EFE7F6",
    "accent": "#9A7CA7",
    "accentSoft": "#F7F1FA",
    "emotion": "#B899D6",
    "background": "#FAF7F2",
    "surface": "#FFFFFF",
    "surfaceSoft": "#FFFDF8",
    "text": "#3A295F",
    "textSecondary": "#5E4A76",
    "textMuted": "#887898",
    "border": "#E6DDF0"
  },
  "darkTokens": {
    "primary": "#C8A8FF",
    "primaryDeep": "#EFE3FF",
    "primarySoft": "#2A1F3A",
    "accent": "#B899D6",
    "accentSoft": "#22172F",
    "emotion": "#D8B9F4",
    "background": "#0F0B16",
    "surface": "#171021",
    "surfaceSoft": "#20162D",
    "text": "#FAF7FF",
    "textSecondary": "#D8CEE6",
    "textMuted": "#A89CB8",
    "border": "#3A2B4A"
  },
  "background": {
    "type": "aurora-lilac",
    "animated": true,
    "intensity": "soft"
  },
  "typography": {
    "fontStyle": "editorial"
  },
  "layout": {
    "radius": "dream",
    "spacing": "comfortable",
    "glass": "soft"
  },
  "animation": {
    "motion": "balanced",
    "backgroundAnimation": "slow-aurora"
  },
  "tags": ["lilas", "editorial", "suave"]
}
JSON

cat > "patch-theme-root-layout-v2.js" <<'JS'
const fs = require('fs');

const rootLayout = 'src/app/layout.tsx';

if (!fs.existsSync(rootLayout)) {
  console.error('src/app/layout.tsx não encontrado.');
  process.exit(1);
}

let content = fs.readFileSync(rootLayout, 'utf8');

function addImport(importLine) {
  if (!content.includes(importLine)) {
    content = `${importLine}\n${content}`;
  }
}

addImport("import '@/styles/iris-theme.css';");
addImport("import { IrisThemeProvider } from '@/components/theme/IrisThemeProvider';");
addImport("import { IrisThemeScript } from '@/components/theme/IrisThemeScript';");

content = content.replace(/<html([^>]*)>/, (match, attrs) => {
  if (attrs.includes('suppressHydrationWarning')) return match;
  return `<html${attrs} suppressHydrationWarning>`;
});

if (!content.includes('<IrisThemeProvider>')) {
  content = content.replace(
    /<body([^>]*)>/,
    '<body$1>\n        <IrisThemeScript />\n        <IrisThemeProvider>',
  );

  content = content.replace(
    /<\/body>/,
    '        </IrisThemeProvider>\n      </body>',
  );
} else if (!content.includes('<IrisThemeScript />')) {
  content = content.replace(
    /<body([^>]*)>/,
    '<body$1>\n        <IrisThemeScript />',
  );
}

fs.writeFileSync(rootLayout, content, 'utf8');
console.log('Root layout conectado ao sistema de temas.');
JS

node patch-theme-root-layout-v2.js

rm -rf .next

npx tsc --noEmit --pretty false > type-errors.txt || true

echo ""
echo "==== TYPE ERRORS ===="
cat type-errors.txt

echo ""
echo "Setup aplicado. Se não houver erros acima, rode:"
echo "npm run dev"
echo "npm run build"
