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
