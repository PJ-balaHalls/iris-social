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
