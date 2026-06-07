import { Suspense } from 'react';
import { FeatureFlagProvider } from '@/feature-flags';
import { defaultFlags } from '@/feature-flags/flags.config';
import { NavigationLoadingProvider } from '@/components/global/NavigationLoadingProvider';
import { Spinner } from '@/components/global/Loader/Spinner';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FeatureFlagProvider flags={defaultFlags}>
      <Suspense fallback={<Spinner fullScreen withBrand label="Carregando IRIS..." />}>
        <NavigationLoadingProvider>{children}</NavigationLoadingProvider>
      </Suspense>
    </FeatureFlagProvider>
  );
}