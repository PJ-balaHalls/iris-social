import { UnifiedParallaxBackground } from '@/components/landing/UnifiedParallaxBackground';
import { HeroSection } from '@/components/landing/HeroSection';
import { ManifestoSection } from '@/components/landing/ManifestoSection';
import { ModulesSection } from '@/components/landing/ModulesSection';
import { TrustSection } from '@/components/landing/TrustSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { CtaSection } from '@/components/landing/CtaSection';
import { Footer } from '@/components/landing/Footer';

export default function Home() {
  return (
    <UnifiedParallaxBackground
      imageUrl="/iris/brand/backgrounds/desktop/fundo-botanico-suave.svg"
      speed={0.2}
    >
      <main className="relative">
        <HeroSection />
        <ManifestoSection />
        {/* As seções seguintes precisam de fundo opaco para cobrir o parallax */}
        <div className="bg-background-primary">
          <ModulesSection />
          <TrustSection />
          <PricingSection />
          <CtaSection />
          <Footer />
        </div>
      </main>
    </UnifiedParallaxBackground>
  );
}