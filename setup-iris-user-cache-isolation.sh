#!/usr/bin/env bash
set -euo pipefail

mkdir -p src/lib/store
mkdir -p src/components/auth
mkdir -p src/components/iris
mkdir -p src/app/iris

cat > src/lib/store/onboardingStore.ts <<'TS'
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FloraInclinacao } from '@/types/flora';

interface OnboardingState {
  ownerUserId: string;

  firstName: string;
  socialName: string;
  cpf: string;
  birthDate: string;
  avatarUrl: string;
  coverUrl: string;
  colorSymbol: string;
  username: string;

  personalityData: any;
  cultureTags: string[];
  cultureData: any;
  integrationPreferences: string[];
  integrationData: any;
  intention: FloraInclinacao;
  intentionData: any;
  privacyLevel: 'private' | 'friends' | 'public';
  privacyData: any;
  accessibilityData: any;
  usLifeInviteData: any;
  plan: string;
  planData: any;

  updateField: (
    field: keyof Omit<OnboardingState, 'updateField' | 'clearStore'>,
    value: any
  ) => void;

  clearStore: () => void;
}

const initialState = {
  ownerUserId: '',

  firstName: '',
  socialName: '',
  cpf: '',
  birthDate: '',
  avatarUrl: '',
  coverUrl: '',
  colorSymbol: '#1B3A2E',
  username: '',

  personalityData: {},
  cultureTags: [],
  cultureData: {},
  integrationPreferences: [],
  integrationData: {},
  intention: 'INTROSPECTIVA' as FloraInclinacao,
  intentionData: {},
  privacyLevel: 'private' as const,
  privacyData: {},
  accessibilityData: {},
  usLifeInviteData: {},
  plan: 'free',
  planData: {},
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialState,

      updateField: (field, value) =>
        set((state) => ({
          ...state,
          [field]: value,
        })),

      clearStore: () => set({ ...initialState }),
    }),
    {
      name: 'iris-onboarding-storage',
      version: 2,
    }
  )
);
TS

cat > src/components/auth/AuthScopedStoreGate.tsx <<'TSX'
'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useOnboardingStore } from '@/lib/store/onboardingStore';

type AuthScopedStoreGateProps = {
  children: ReactNode;
};

export function AuthScopedStoreGate({ children }: AuthScopedStoreGateProps) {
  const router = useRouter();

  const ownerUserId = useOnboardingStore((state) => state.ownerUserId);
  const updateField = useOnboardingStore((state) => state.updateField);
  const clearStore = useOnboardingStore((state) => state.clearStore);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function scopeStoreToUser() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) return;

      if (!user) {
        clearStore();
        router.replace('/auth/login');
        return;
      }

      if (ownerUserId && ownerUserId !== user.id) {
        clearStore();
      }

      updateField('ownerUserId', user.id);

      if (active) setReady(true);
    }

    scopeStoreToUser();

    return () => {
      active = false;
    };
  }, [clearStore, ownerUserId, router, updateField]);

  if (!ready) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-full border border-white/70 bg-white/60 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#747D79] shadow-[0_18px_45px_rgba(0,44,31,0.10)] backdrop-blur-xl">
          Validando sessão
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
TSX

cat > src/components/iris/IrisProfileProvider.tsx <<'TSX'
'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useOnboardingStore } from '@/lib/store/onboardingStore';

type IrisProfileProviderProps = {
  children: ReactNode;
};

type Status = 'loading' | 'ready' | 'redirecting' | 'error';

export function IrisProfileProvider({ children }: IrisProfileProviderProps) {
  const router = useRouter();

  const ownerUserId = useOnboardingStore((state) => state.ownerUserId);
  const updateField = useOnboardingStore((state) => state.updateField);
  const clearStore = useOnboardingStore((state) => state.clearStore);

  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('Sincronizando perfil');

  useEffect(() => {
    let active = true;

    async function hydrateProfile() {
      try {
        const supabase = createClient();

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (!active) return;

        if (userError || !user) {
          clearStore();
          setStatus('redirecting');
          router.replace('/auth/login');
          return;
        }

        if (ownerUserId && ownerUserId !== user.id) {
          clearStore();
        }

        updateField('ownerUserId', user.id);

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (!active) return;

        if (error) {
          console.warn('[IRIS_PROFILE_PROVIDER_HYDRATE_ERROR]', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
          });

          setMessage('Não foi possível carregar seu perfil');
          setStatus('error');
          return;
        }

        if (!data) {
          clearStore();
          updateField('ownerUserId', user.id);
          setStatus('redirecting');
          router.replace('/onboarding/basic-info');
          return;
        }

        const hasBasicInfo = Boolean(data.first_name && data.birth_date);
        const hasUsername = Boolean(data.username);

        if (!hasBasicInfo) {
          setStatus('redirecting');
          router.replace('/onboarding/basic-info');
          return;
        }

        if (!hasUsername) {
          setStatus('redirecting');
          router.replace('/onboarding/username');
          return;
        }

        const mappings: Array<[any, any]> = [
          ['ownerUserId', user.id],
          ['firstName', data.first_name || ''],
          ['socialName', data.social_name || ''],
          ['cpf', ''],
          ['birthDate', data.birth_date || ''],
          ['avatarUrl', data.avatar_url || ''],
          ['coverUrl', data.cover_url || ''],
          ['colorSymbol', data.color_symbol || '#1B3A2E'],
          ['username', data.username || ''],
          ['personalityData', data.personality_data || {}],
          ['cultureTags', data.culture_tags || []],
          ['cultureData', data.culture_data || {}],
          ['integrationPreferences', data.integration_preferences || []],
          ['integrationData', data.integration_data || {}],
          ['intention', data.intention || 'INTROSPECTIVA'],
          ['intentionData', data.intention_data || {}],
          ['privacyLevel', data.privacy_level || 'private'],
          ['privacyData', data.privacy_data || {}],
          ['accessibilityData', data.accessibility_data || {}],
          ['usLifeInviteData', data.uslife_invite_data || {}],
          ['plan', data.plan_key || 'free'],
          ['planData', data.plan_data || {}],
        ];

        mappings.forEach(([field, value]) => {
          updateField(field, value);
        });

        setStatus('ready');
      } catch (error) {
        console.warn('[IRIS_PROFILE_PROVIDER_UNKNOWN_ERROR]', error);
        if (!active) return;

        setMessage('Erro inesperado ao carregar o perfil');
        setStatus('error');
      }
    }

    hydrateProfile();

    return () => {
      active = false;
    };
  }, [clearStore, ownerUserId, router, updateField]);

  if (status !== 'ready') {
    return (
      <main
        data-iris-onboarding-root
        className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-5 text-[#002c1f]"
      >
        <div className="w-full max-w-md rounded-[30px] border border-white/70 bg-white/[0.28] p-6 text-center shadow-[0_24px_80px_rgba(0,44,31,0.10)] backdrop-blur-xl">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
            IRIS
          </p>

          <h1 className="mt-3 font-display text-4xl tracking-[-0.055em] text-[#002c1f]">
            {message}
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#476153]">
            Estamos garantindo que os dados exibidos pertencem ao usuário autenticado.
          </p>

          {status === 'error' && (
            <button
              type="button"
              onClick={() => router.refresh()}
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[16px] bg-emerald-800 px-5 text-sm font-semibold text-white"
            >
              Tentar novamente
            </button>
          )}
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
TSX

node <<'NODE'
const fs = require('fs');
const path = 'src/app/onboarding/layout.tsx';

if (!fs.existsSync(path)) {
  console.log('src/app/onboarding/layout.tsx não encontrado.');
  process.exit(0);
}

let file = fs.readFileSync(path, 'utf8');

if (!file.includes("AuthScopedStoreGate")) {
  file = file.replace(
    "import { AccessibilityRuntime } from '@/components/accessibility/AccessibilityRuntime';",
    "import { AccessibilityRuntime } from '@/components/accessibility/AccessibilityRuntime';\nimport { AuthScopedStoreGate } from '@/components/auth/AuthScopedStoreGate';"
  );
}

file = file.replace(
  '<OnboardingContentFrame>{children}</OnboardingContentFrame>',
  '<OnboardingContentFrame><AuthScopedStoreGate>{children}</AuthScopedStoreGate></OnboardingContentFrame>'
);

fs.writeFileSync(path, file);
console.log('✅ onboarding/layout.tsx protegido por AuthScopedStoreGate.');
NODE

cat > src/app/iris/page.tsx <<'TSX'
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
TSX

cat > src/lib/auth/logout.ts <<'TS'
'use client';

import { createClient } from '@/lib/supabase/client';

export async function logoutAndClearIrisCache() {
  try {
    window.localStorage.removeItem('iris-onboarding-storage');
    window.localStorage.removeItem('iris-accessibility-preferences');
  } catch {
    // localStorage indisponível
  }

  const supabase = createClient();
  await supabase.auth.signOut();

  window.location.assign('/auth/login');
}
TS

echo "✅ FE-IRIS-050 aplicado: isolamento por usuário, bloqueio contra cache visual e hidratação segura do perfil."
