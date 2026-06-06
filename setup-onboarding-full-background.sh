#!/usr/bin/env bash
set -euo pipefail

mkdir -p src/components/onboarding

cat > src/components/onboarding/OnboardingBotanicalBackground.tsx <<'TSX'
const ONBOARDING_BACKGROUNDS = {
  desktop: '/iris/brand/backgrounds/desktop/fundo-botanico-suave.svg',
  tablet: '/iris/brand/backgrounds/tablet/fundo-botanico-suave.svg',
  mobile: '/iris/brand/backgrounds/mobile/fundo-botanico-suave.svg',
};

export function OnboardingBotanicalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[#FAF7F2]" />

      <div
        className="iris-onboarding-bg hidden lg:block absolute inset-0 opacity-[0.96] mix-blend-multiply"
        style={{
          backgroundImage: `url(${ONBOARDING_BACKGROUNDS.desktop})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
        }}
      />

      <div
        className="iris-onboarding-bg hidden md:block lg:hidden absolute inset-0 opacity-[0.96] mix-blend-multiply"
        style={{
          backgroundImage: `url(${ONBOARDING_BACKGROUNDS.tablet})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
        }}
      />

      <div
        className="iris-onboarding-bg md:hidden absolute inset-0 opacity-[0.96] mix-blend-multiply"
        style={{
          backgroundImage: `url(${ONBOARDING_BACKGROUNDS.mobile})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(0,44,31,0.08),transparent_32%),radial-gradient(circle_at_88%_86%,rgba(154,124,167,0.10),transparent_38%)]" />

      <div className="hidden md:block absolute inset-y-0 right-0 w-[54%] bg-gradient-to-r from-transparent via-[#FAF7F2]/72 to-[#FAF7F2]/94" />
      <div className="md:hidden absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-b from-transparent via-[#FAF7F2]/78 to-[#FAF7F2]" />

      <div className="absolute inset-0 bg-[#FAF7F2]/10" />
    </div>
  );
}
TSX

cat > src/app/onboarding/layout.tsx <<'TSX'
import type { ReactNode } from 'react';
import { EmotionalProgressBar } from '@/components/onboarding/EmotionalProgressBar';
import { OnboardingContentFrame } from '@/components/onboarding/OnboardingContentFrame';
import { OnboardingBotanicalBackground } from '@/components/onboarding/OnboardingBotanicalBackground';

const LOGO_PATH = '/iris/brand/logotipo/svg/iris-logotipo-colorido.svg';

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#FAF7F2] font-sans text-[#002c1f]">
      <style>
        {`
          @keyframes iris-onboarding-bg {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.012);
            }
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
        <header className="flex w-full items-start justify-between gap-5">
          <a href="/" aria-label="Voltar para a página inicial do IRIS" className="shrink-0">
            <img src={LOGO_PATH} alt="IRIS" className="h-auto w-[70px] sm:w-[76px]" />
          </a>

          <div className="flex w-full max-w-md flex-col items-end gap-3 pt-1">
            <p className="hidden text-right text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79] sm:block">
              Onboarding cognitivo
            </p>

            <div className="w-full">
              <EmotionalProgressBar />
            </div>
          </div>
        </header>

        <section className="flex flex-1 items-center justify-center py-8 lg:py-10">
          <OnboardingContentFrame>{children}</OnboardingContentFrame>
        </section>
      </div>
    </main>
  );
}
TSX

cat > src/app/onboarding/welcome/page.tsx <<'TSX'
import { WelcomeContinueButton } from './components/WelcomeContinueButton';
import { WelcomeInfoCard } from './components/WelcomeInfoCard';

const welcomeCards = [
  {
    eyebrow: 'Memória',
    title: 'Guarde o que importa.',
    description:
      'A IRIS organiza registros, cartas, momentos e afetos em um espaço silencioso, sem ruído visual.',
  },
  {
    eyebrow: 'Privacidade',
    title: 'Você decide o que aparece.',
    description:
      'Cada informação nasce protegida. Depois, você escolhe o que continua privado, compartilhado ou visível por afinidade.',
  },
  {
    eyebrow: 'Identidade',
    title: 'Sua história em blocos vivos.',
    description:
      'O onboarding ajuda a IRIS a entender sua identidade com cuidado, para construir um espaço mais humano e coerente.',
  },
];

export default function WelcomePage() {
  return (
    <section className="relative isolate overflow-hidden rounded-[40px] border border-[#E2E7E3]/80 bg-white/[0.34] shadow-[0_28px_90px_rgba(17,17,17,0.08)] backdrop-blur-[2px]">
      <style>
        {`
          @keyframes iris-welcome-enter {
            from {
              opacity: 0;
              transform: translateY(18px);
              filter: blur(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
              filter: blur(0);
            }
          }

          @keyframes iris-welcome-card {
            from {
              opacity: 0;
              transform: translateY(16px) scale(0.985);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .iris-welcome-enter {
            animation: iris-welcome-enter 720ms cubic-bezier(0.22, 1, 0.36, 1) both;
          }

          .iris-welcome-card {
            opacity: 0;
            animation: iris-welcome-card 700ms cubic-bezier(0.22, 1, 0.36, 1) both;
          }

          @media (prefers-reduced-motion: reduce) {
            .iris-welcome-enter,
            .iris-welcome-card {
              animation: none !important;
              opacity: 1 !important;
              transform: none !important;
              filter: none !important;
            }
          }
        `}
      </style>

      <div className="relative z-10 grid min-h-[660px] gap-10 px-6 py-10 sm:px-8 lg:grid-cols-[1.04fr_0.96fr] lg:px-12 lg:py-12 xl:px-14">
        <div className="iris-welcome-enter flex flex-col justify-end pt-24 md:pt-32 lg:pt-0">
          <div className="max-w-xl">
            <p className="mb-5 inline-flex rounded-full border border-[#DDE6DA] bg-white/72 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#002c1f] shadow-sm backdrop-blur">
              Primeiro passo
            </p>

            <h1 className="font-display text-[2.8rem] leading-[0.98] tracking-[-0.045em] text-[#002c1f] sm:text-[3.7rem] lg:text-[4.35rem]">
              Bem-vindo ao seu espaço de permanência.
            </h1>

            <p className="mt-6 max-w-md text-base leading-8 text-[#476153] sm:text-lg">
              Antes de entrar, a IRIS vai conhecer sua forma de lembrar, proteger e organizar o que faz parte da sua história.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <WelcomeContinueButton />

              <p className="max-w-xs text-sm leading-6 text-[#747D79]">
                Leva poucos minutos. Você pode ajustar suas respostas depois.
              </p>
            </div>
          </div>
        </div>

        <div className="grid content-end gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {welcomeCards.map((card, index) => (
            <WelcomeInfoCard
              key={card.title}
              eyebrow={card.eyebrow}
              title={card.title}
              index={index}
            >
              {card.description}
            </WelcomeInfoCard>
          ))}
        </div>
      </div>
    </section>
  );
}
TSX

echo "✅ FE-IRIS-025 aplicado: background agora fica em todo o fundo do onboarding."
