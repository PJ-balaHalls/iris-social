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
