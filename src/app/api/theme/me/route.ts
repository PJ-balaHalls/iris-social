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
