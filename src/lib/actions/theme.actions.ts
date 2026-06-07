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
