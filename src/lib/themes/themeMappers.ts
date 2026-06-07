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
