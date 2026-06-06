'use client';

import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Home,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { AccessibilityRuntime } from '@/components/accessibility/AccessibilityRuntime';
import { IrisProfileProvider } from '@/components/iris/IrisProfileProvider';
import { OnboardingDataPanel } from '@/components/onboarding/finish/OnboardingDataPanel';
import { ProfileCompletionCard } from '@/components/iris/profile-completion/ProfileCompletionCard';
import { useOnboardingStore } from '@/lib/store/onboardingStore';

const LOGO_PATH = '/iris/brand/logotipo/svg/iris-logotipo-colorido.svg';

function IrisDashboardContent() {
  const onboardingState = useOnboardingStore();

  const displayName =
    onboardingState.socialName ||
    onboardingState.firstName ||
    onboardingState.username ||
    'IRIS';

  return (
    <main
      data-iris-onboarding-root
      className="min-h-screen bg-[#FAF7F2] px-5 py-6 text-[#002c1f] sm:px-8 lg:px-10"
    >
      <AccessibilityRuntime />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" aria-label="Voltar para início">
            <img src={LOGO_PATH} alt="IRIS" className="h-auto w-[70px]" />
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/[0.28] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#747D79] backdrop-blur-sm">
            <Home size={14} strokeWidth={1.8} />
            Tela inicial
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <aside className="space-y-5 lg:sticky lg:top-8">
            <div className="rounded-[34px] border border-white/70 bg-white/[0.24] p-5 backdrop-blur-sm sm:p-7">
              {onboardingState.coverUrl && (
                <div className="mb-5 aspect-[16/7] overflow-hidden rounded-[24px] border border-white/70 bg-white/[0.28]">
                  <img
                    src={onboardingState.coverUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-emerald-800/[0.08] text-xl font-semibold text-[#002c1f]">
                  {onboardingState.avatarUrl ? (
                    <img
                      src={onboardingState.avatarUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    displayName.slice(0, 1).toUpperCase()
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
                    Bem-vindo
                  </p>

                  <h1 className="mt-1 font-display text-4xl leading-[1] tracking-[-0.055em] text-[#002c1f] sm:text-5xl">
                    {displayName}
                  </h1>

                  <p className="mt-2 font-mono text-sm text-[#476153]">
                    @{onboardingState.username || 'username'}
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] border border-white/70 bg-white/[0.28] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
                    Intenção
                  </p>
                  <p className="mt-2 font-display text-2xl text-[#002c1f]">
                    {onboardingState.intention || '—'}
                  </p>
                </div>

                <div className="rounded-[22px] border border-white/70 bg-white/[0.28] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
                    Plano
                  </p>
                  <p className="mt-2 font-display text-2xl text-[#002c1f]">
                    {onboardingState.plan || 'free'}
                  </p>
                </div>

                <div className="rounded-[22px] border border-white/70 bg-white/[0.28] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
                    Privacidade
                  </p>
                  <p className="mt-2 font-display text-2xl text-[#002c1f]">
                    {onboardingState.privacyLevel || 'private'}
                  </p>
                </div>

                <div className="rounded-[22px] border border-white/70 bg-white/[0.28] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
                    Status
                  </p>
                  <p className="mt-2 inline-flex items-center gap-2 font-display text-2xl text-[#002c1f]">
                    <CheckCircle2 size={18} strokeWidth={1.8} />
                    OK
                  </p>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/onboarding/basic-info?edit=1"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[18px] border border-emerald-800/18 px-5 text-sm font-semibold text-[#002c1f] transition-all hover:bg-emerald-800/10"
                >
                  <RotateCcw size={15} strokeWidth={1.8} />
                  Rever essencial
                </Link>

                <Link
                  href="/onboarding/avatar"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[18px] bg-emerald-800 px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(0,44,31,0.18)] transition-all hover:bg-emerald-900"
                >
                  Personalizar
                  <ArrowRight size={15} strokeWidth={1.8} />
                </Link>
              </div>
            </div>

            <ProfileCompletionCard state={onboardingState} />

            <div className="rounded-[26px] border border-white/70 bg-white/[0.24] p-5 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
                  <Sparkles size={17} strokeWidth={1.8} />
                </span>

                <div>
                  <h2 className="font-display text-2xl tracking-[-0.035em] text-[#002c1f]">
                    Tela inicial simplificada
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#476153]">
                    Esta página valida o fluxo e mostra todos os dados coletados.
                    Depois ela vira o dashboard real da IRIS.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <section>
            <div className="mb-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
                Todos os dados coletados
              </p>

              <h2 className="mt-2 font-display text-4xl tracking-[-0.055em] text-[#002c1f]">
                Snapshot do onboarding.
              </h2>
            </div>

            <OnboardingDataPanel state={onboardingState} />
          </section>
        </section>
      </div>
    </main>
  );
}

export default function IrisInitialPage() {
  return (
    <IrisProfileProvider>
      <IrisDashboardContent />
    </IrisProfileProvider>
  );
}
