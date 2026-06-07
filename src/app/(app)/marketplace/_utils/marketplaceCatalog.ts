import { irisThemeCatalog } from '@/lib/themes/themeCatalog';

export const marketplaceThemes = irisThemeCatalog.filter(
  (theme) => theme.status === 'marketplace',
);

export const marketplaceFeaturedTheme =
  marketplaceThemes.find((theme) => theme.slug === 'iris-lilac') ||
  marketplaceThemes[0];
