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
