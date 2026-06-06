#!/usr/bin/env bash
set -euo pipefail

mkdir -p src/components/onboarding
mkdir -p src/app/onboarding/welcome/components

cat > src/components/onboarding/OnboardingContentFrame.tsx <<'TSX'
'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

type OnboardingContentFrameProps = {
  children: ReactNode;
};

export function OnboardingContentFrame({ children }: OnboardingContentFrameProps) {
  const pathname = usePathname();
  const isWelcome = pathname === '/onboarding/welcome';

  return (
    <div
      className={[
        'w-full transition-all duration-300 ease-out',
        isWelcome ? 'max-w-6xl' : 'max-w-md',
      ].join(' ')}
    >
      {children}
    </div>
  );
}
TSX

cat > src/app/onboarding/layout.tsx <<'TSX'
import type { ReactNode } from 'react';
import { EmotionalProgressBar } from '@/components/onboarding/EmotionalProgressBar';
import { OnboardingContentFrame } from '@/components/onboarding/OnboardingContentFrame';

const LOGO_PATH = '/iris/brand/logotipo/svg/iris-logotipo-colorido.svg';

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#FAF7F2] font-sans text-[#002c1f]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(0,44,31,0.08),transparent_32%),radial-gradient(circle_at_90%_88%,rgba(154,124,167,0.10),transparent_36%)]"
        aria-hidden="true"
      />

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

cat > src/app/onboarding/welcome/components/WelcomeBotanicalBackground.tsx <<'TSX'
const WELCOME_BACKGROUNDS = {
  desktop: '/iris/brand/backgrounds/desktop/fundo-botanico-suave.svg',
  tablet: '/iris/brand/backgrounds/tablet/fundo-botanico-suave.svg',
  mobile: '/iris/brand/backgrounds/mobile/fundo-botanico-suave.svg',
};

export function WelcomeBotanicalBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[#FAF7F2]" />

      <div
        className="iris-welcome-breathe absolute inset-y-0 left-0 hidden w-[72%] opacity-[0.96] mix-blend-multiply lg:block"
        style={{
          backgroundImage: `url(${WELCOME_BACKGROUNDS.desktop})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left center',
          backgroundSize: 'auto 100%',
          WebkitMaskImage:
            'linear-gradient(to right, black 0%, black 62%, rgba(0,0,0,0.74) 76%, transparent 100%)',
          maskImage:
            'linear-gradient(to right, black 0%, black 62%, rgba(0,0,0,0.74) 76%, transparent 100%)',
        }}
      />

      <div
        className="iris-welcome-breathe absolute inset-y-0 left-0 hidden w-[76%] opacity-[0.94] mix-blend-multiply md:block lg:hidden"
        style={{
          backgroundImage: `url(${WELCOME_BACKGROUNDS.tablet})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left center',
          backgroundSize: 'auto 100%',
          WebkitMaskImage:
            'linear-gradient(to right, black 0%, black 60%, rgba(0,0,0,0.70) 78%, transparent 100%)',
          maskImage:
            'linear-gradient(to right, black 0%, black 60%, rgba(0,0,0,0.70) 78%, transparent 100%)',
        }}
      />

      <div
        className="iris-welcome-breathe absolute inset-0 opacity-[0.94] mix-blend-multiply md:hidden"
        style={{
          backgroundImage: `url(${WELCOME_BACKGROUNDS.mobile})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
        }}
      />

      <div className="absolute inset-y-0 left-[36%] hidden w-[46%] bg-gradient-to-r from-transparent via-[#FAF7F2]/82 to-[#FAF7F2] md:block" />
      <div className="absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-b from-transparent via-[#FAF7F2]/78 to-[#FAF7F2] md:hidden" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(0,44,31,0.07),transparent_34%),radial-gradient(circle_at_86%_76%,rgba(154,124,167,0.09),transparent_36%)]" />
    </div>
  );
}
TSX

cat > src/app/onboarding/welcome/components/WelcomeInfoCard.tsx <<'TSX'
import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

type WelcomeInfoCardProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
  index: number;
};

export function WelcomeInfoCard({ eyebrow, title, children, index }: WelcomeInfoCardProps) {
  return (
    <div
      className="iris-welcome-card"
      style={{ animationDelay: `${180 + index * 90}ms` }}
    >
      <Card
        hover={false}
        className="rounded-[28px] border border-[#DDE6DA]/90 !bg-white/[0.78] p-5 shadow-[0_18px_48px_rgba(17,17,17,0.06)] backdrop-blur-xl"
      >
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
          {eyebrow}
        </p>

        <h2 className="mt-3 font-display text-2xl leading-tight tracking-[-0.025em] text-[#002c1f]">
          {title}
        </h2>

        <p className="mt-3 text-sm leading-6 text-[#476153]">
          {children}
        </p>
      </Card>
    </div>
  );
}
TSX

cat > src/app/onboarding/welcome/components/WelcomeContinueButton.tsx <<'TSX'
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function WelcomeContinueButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="auth"
      size="lg"
      className="min-h-12 rounded-[18px] px-8"
      onClick={() => router.push('/onboarding/basic-info')}
    >
      Começar jornada
    </Button>
  );
}
TSX

cat > src/app/onboarding/welcome/page.tsx <<'TSX'
import { WelcomeBotanicalBackground } from './components/WelcomeBotanicalBackground';
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
    <section className="relative isolate overflow-hidden rounded-[40px] border border-[#E2E7E3]/90 bg-[#FAF7F2] shadow-[0_28px_90px_rgba(17,17,17,0.08)]">
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

          @keyframes iris-welcome-breathe {
            0%, 100% {
              transform: scale(1);
              opacity: 0.92;
            }
            50% {
              transform: scale(1.018);
              opacity: 1;
            }
          }

          .iris-welcome-enter {
            animation: iris-welcome-enter 720ms cubic-bezier(0.22, 1, 0.36, 1) both;
          }

          .iris-welcome-card {
            opacity: 0;
            animation: iris-welcome-card 700ms cubic-bezier(0.22, 1, 0.36, 1) both;
          }

          .iris-welcome-breathe {
            animation: iris-welcome-breathe 12s ease-in-out infinite;
            transform-origin: center;
          }

          @media (prefers-reduced-motion: reduce) {
            .iris-welcome-enter,
            .iris-welcome-card,
            .iris-welcome-breathe {
              animation: none !important;
              opacity: 1 !important;
              transform: none !important;
              filter: none !important;
            }
          }
        `}
      </style>

      <WelcomeBotanicalBackground />

      <div className="relative z-10 grid min-h-[660px] gap-10 px-6 py-10 sm:px-8 lg:grid-cols-[1.04fr_0.96fr] lg:px-12 lg:py-12 xl:px-14">
        <div className="iris-welcome-enter flex flex-col justify-end pt-24 md:pt-32 lg:pt-0">
          <div className="max-w-xl">
            <p className="mb-5 inline-flex rounded-full border border-[#DDE6DA] bg-white/70 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#002c1f] shadow-sm backdrop-blur">
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

echo "✅ FE-IRIS-024 aplicado: Welcome onboarding atualizado."
