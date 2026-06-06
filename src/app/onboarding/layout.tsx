import type { ReactNode } from 'react';
import { AccessibilityRuntime } from '@/components/accessibility/AccessibilityRuntime';
import { AuthScopedStoreGate } from '@/components/auth/AuthScopedStoreGate';
import { EmotionalProgressBar } from '@/components/onboarding/EmotionalProgressBar';
import { OnboardingContentFrame } from '@/components/onboarding/OnboardingContentFrame';
import { OnboardingBotanicalBackground } from '@/components/onboarding/OnboardingBotanicalBackground';

const LOGO_PATH = '/iris/brand/logotipo/svg/iris-logotipo-colorido.svg';

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <main
      data-iris-onboarding-root
      className="relative min-h-screen overflow-x-hidden bg-[#FAF7F2] font-sans text-[#002c1f]"
    >
      <AccessibilityRuntime />

      <style>
        {`
          @keyframes iris-onboarding-bg {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.012); }
          }

          .iris-onboarding-bg {
            animation: iris-onboarding-bg 16s ease-in-out infinite;
            transform-origin: center;
          }

          @media (prefers-reduced-motion: reduce) {
            .iris-onboarding-bg {
              animation: none !important;
              transform: none !important;
            }
          }
        `}
      </style>

      <OnboardingBotanicalBackground />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="grid w-full grid-cols-[auto_1fr_auto] items-start gap-4">
          <a href="/" aria-label="Voltar para a página inicial do IRIS" className="shrink-0">
            <img src={LOGO_PATH} alt="IRIS" className="h-auto w-[66px] sm:w-[72px]" />
          </a>

          <div className="flex justify-center pt-1">
            <EmotionalProgressBar />
          </div>

          <div className="hidden w-[72px] sm:block" aria-hidden="true" />
        </header>

        <section className="flex flex-1 items-center justify-center py-8 lg:py-10">
          <OnboardingContentFrame><AuthScopedStoreGate>{children}</AuthScopedStoreGate></OnboardingContentFrame>
        </section>
      </div>
    </main>
  );
}
