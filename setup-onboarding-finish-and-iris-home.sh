#!/usr/bin/env bash
set -euo pipefail

mkdir -p src/app/onboarding/finish
mkdir -p src/app/iris
mkdir -p src/components/onboarding/finish
mkdir -p src/lib/onboarding
mkdir -p src/lib/store

cat > src/lib/store/onboardingStore.ts <<'TS'
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FloraInclinacao } from '@/types/flora';

interface OnboardingState {
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
      updateField: (field, value) => set((state) => ({ ...state, [field]: value })),
      clearStore: () => set({ ...initialState }),
    }),
    { name: 'iris-onboarding-storage' }
  )
);
TS

cat > src/lib/onboarding/onboardingSnapshot.ts <<'TS'
type OnboardingStateLike = {
  firstName?: string;
  socialName?: string;
  cpf?: string;
  birthDate?: string;
  avatarUrl?: string;
  coverUrl?: string;
  colorSymbol?: string;
  username?: string;
  personalityData?: any;
  cultureTags?: string[];
  cultureData?: any;
  integrationPreferences?: string[];
  integrationData?: any;
  intention?: string;
  intentionData?: any;
  privacyLevel?: string;
  privacyData?: any;
  accessibilityData?: any;
  usLifeInviteData?: any;
  plan?: string;
  planData?: any;
};

export function buildOnboardingSnapshot(state: OnboardingStateLike) {
  return {
    basicInfo: {
      firstName: state.firstName || '',
      socialName: state.socialName || '',
      cpf: state.cpf || '',
      birthDate: state.birthDate || '',
    },
    identity: {
      avatarUrl: state.avatarUrl || '',
      coverUrl: state.coverUrl || '',
      colorSymbol: state.colorSymbol || '',
      username: state.username || '',
    },
    personality: state.personalityData || {},
    culture: {
      cultureTags: state.cultureTags || [],
      cultureData: state.cultureData || {},
    },
    integrations: {
      integrationPreferences: state.integrationPreferences || [],
      integrationData: state.integrationData || {},
    },
    intention: {
      intention: state.intention || '',
      intentionData: state.intentionData || {},
    },
    privacy: {
      privacyLevel: state.privacyLevel || '',
      privacyData: state.privacyData || {},
    },
    accessibility: state.accessibilityData || {},
    usLifeInvite: state.usLifeInviteData || {},
    plan: {
      plan: state.plan || '',
      planData: state.planData || {},
    },
  };
}

export function buildOnboardingSections(snapshot: ReturnType<typeof buildOnboardingSnapshot>) {
  return [
    {
      title: 'Dados básicos',
      data: snapshot.basicInfo,
    },
    {
      title: 'Identidade',
      data: snapshot.identity,
    },
    {
      title: 'Personalidade',
      data: snapshot.personality,
    },
    {
      title: 'Cultura',
      data: snapshot.culture,
    },
    {
      title: 'Integrações',
      data: snapshot.integrations,
    },
    {
      title: 'Intenção',
      data: snapshot.intention,
    },
    {
      title: 'Privacidade',
      data: snapshot.privacy,
    },
    {
      title: 'Acessibilidade',
      data: snapshot.accessibility,
    },
    {
      title: 'usLIFE',
      data: snapshot.usLifeInvite,
    },
    {
      title: 'Plano',
      data: snapshot.plan,
    },
  ];
}

export function buildProfilePayload(
  state: OnboardingStateLike,
  profileId: string
) {
  const now = new Date().toISOString();

  return {
    id: profileId,

    first_name: state.firstName || null,
    social_name: state.socialName || null,
    cpf: state.cpf || null,
    birth_date: state.birthDate || null,

    avatar_url: state.avatarUrl || null,
    cover_url: state.coverUrl || null,
    color_symbol: state.colorSymbol || null,
    username: state.username || null,

    personality_data: state.personalityData || {},
    personality_completed_at: state.personalityData?.completedAt || null,

    culture_tags: state.cultureTags || [],
    culture_data: state.cultureData || {},
    culture_completed_at: state.cultureData?.completedAt || null,

    integration_preferences: state.integrationPreferences || [],
    integration_data: state.integrationData || {},
    integrations_completed_at: state.integrationData?.completedAt || null,

    intention: state.intention || null,
    intention_data: state.intentionData || {},
    intention_completed_at: state.intentionData?.completedAt || null,

    privacy_level: state.privacyLevel || 'private',
    privacy_data: state.privacyData || {},
    privacy_completed_at: state.privacyData?.completedAt || null,

    accessibility_data: state.accessibilityData || {},
    accessibility_completed_at: state.accessibilityData?.completedAt || null,
    theme_preference:
      state.accessibilityData?.preferences?.theme ||
      state.accessibilityData?.theme ||
      'system',

    uslife_invite_data: state.usLifeInviteData || {},
    uslife_invite_completed_at: state.usLifeInviteData?.completedAt || null,

    plan_key: state.plan || 'free',
    plan_data: state.planData || {},
    plan_completed_at: state.planData?.completedAt || null,

    onboarding_status: 'completed',
    onboarding_completed_at: now,
    updated_at: now,
  };
}
TS

cat > src/lib/onboarding/saveOnboardingProfile.ts <<'TS'
import { createClient } from '@/lib/supabase/client';
import { buildProfilePayload } from './onboardingSnapshot';

type SaveOnboardingResult = {
  ok: boolean;
  message: string;
};

export async function saveOnboardingProfile(state: any): Promise<SaveOnboardingResult> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false,
      message: 'Não encontramos uma sessão ativa para salvar no banco.',
    };
  }

  const payload = buildProfilePayload(state, user.id);

  const { error } = await supabase
    .from('profiles')
    .upsert(payload, {
      onConflict: 'id',
    });

  if (error) {
    console.warn('[IRIS_ONBOARDING_FINISH_SAVE]', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });

    return {
      ok: false,
      message: error.message || 'Não foi possível salvar o onboarding agora.',
    };
  }

  return {
    ok: true,
    message: 'Onboarding salvo com sucesso.',
  };
}
TS

cat > src/components/onboarding/finish/OnboardingDataPanel.tsx <<'TSX'
'use client';

import { buildOnboardingSections, buildOnboardingSnapshot } from '@/lib/onboarding/onboardingSnapshot';

type OnboardingDataPanelProps = {
  state: any;
  compact?: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isEmptyValue(value: unknown) {
  if (value === null || value === undefined || value === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (isRecord(value) && Object.keys(value).length === 0) return true;
  return false;
}

function formatKey(value: string) {
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function DataValue({ value, depth = 0 }: { value: unknown; depth?: number }) {
  if (isEmptyValue(value)) {
    return <span className="text-[#9AA4A1]">—</span>;
  }

  if (typeof value === 'string') {
    if (value.startsWith('data:image/') || value.startsWith('http')) {
      return (
        <div className="space-y-2">
          <span className="break-all text-xs text-[#476153]">{value}</span>
          {(value.includes('avatar') ||
            value.includes('cover') ||
            value.startsWith('data:image/')) && (
            <img
              src={value}
              alt=""
              className="max-h-40 w-full max-w-xs rounded-[18px] border border-white/70 object-cover"
            />
          )}
        </div>
      );
    }

    return <span className="break-words text-[#002c1f]">{value}</span>;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return <span className="text-[#002c1f]">{String(value)}</span>;
  }

  if (Array.isArray(value)) {
    const onlyPrimitive = value.every(
      (item) => typeof item !== 'object' || item === null
    );

    if (onlyPrimitive) {
      return (
        <div className="flex flex-wrap gap-2">
          {value.map((item, index) => (
            <span
              key={`${String(item)}-${index}`}
              className="rounded-full border border-white/70 bg-white/[0.30] px-3 py-1 text-xs font-semibold text-[#002c1f]"
            >
              {String(item)}
            </span>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {value.map((item, index) => (
          <div
            key={index}
            className="rounded-[18px] border border-white/70 bg-white/[0.22] p-3"
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#747D79]">
              Item {index + 1}
            </p>
            <DataValue value={item} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  if (isRecord(value)) {
    return (
      <div className={depth > 0 ? 'space-y-2' : 'space-y-3'}>
        {Object.entries(value).map(([key, item]) => (
          <div
            key={key}
            className={[
              'grid gap-2',
              depth > 1 ? 'grid-cols-1' : 'sm:grid-cols-[180px_1fr]',
            ].join(' ')}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#747D79]">
              {formatKey(key)}
            </p>
            <div className="min-w-0 text-sm leading-6">
              <DataValue value={item} depth={depth + 1} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <span className="text-[#002c1f]">{String(value)}</span>;
}

export function OnboardingDataPanel({
  state,
  compact = false,
}: OnboardingDataPanelProps) {
  const snapshot = buildOnboardingSnapshot(state);
  const sections = buildOnboardingSections(snapshot);

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <section
          key={section.title}
          className="rounded-[26px] border border-white/70 bg-white/[0.24] p-4 backdrop-blur-sm"
        >
          <div className="mb-4 flex items-center justify-between gap-4 border-b border-white/70 pb-3">
            <h2 className="font-display text-2xl tracking-[-0.035em] text-[#002c1f]">
              {section.title}
            </h2>

            <span className="rounded-full border border-white/70 bg-white/[0.30] px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[#747D79]">
              onboarding
            </span>
          </div>

          <DataValue value={section.data} />
        </section>
      ))}

      {!compact && (
        <section className="rounded-[26px] border border-white/70 bg-white/[0.24] p-4 backdrop-blur-sm">
          <div className="mb-4 border-b border-white/70 pb-3">
            <h2 className="font-display text-2xl tracking-[-0.035em] text-[#002c1f]">
              JSON completo
            </h2>
            <p className="mt-1 text-sm text-[#747D79]">
              Todos os dados coletados no onboarding em formato bruto.
            </p>
          </div>

          <pre className="max-h-[520px] overflow-auto rounded-[20px] border border-white/70 bg-white/[0.30] p-4 text-xs leading-6 text-[#002c1f]">
            {JSON.stringify(snapshot, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}
TSX

cat > src/app/onboarding/finish/page.tsx <<'TSX'
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { OnboardingBottomActions } from '@/components/onboarding/OnboardingBottomActions';
import { OnboardingMinimalStep } from '@/components/onboarding/OnboardingMinimalStep';
import { OnboardingDataPanel } from '@/components/onboarding/finish/OnboardingDataPanel';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { saveOnboardingProfile } from '@/lib/onboarding/saveOnboardingProfile';

export default function FinishPage() {
  const router = useRouter();
  const onboardingState = useOnboardingStore();

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message: string;
  }>({
    type: 'idle',
    message: '',
  });

  async function handleSaveAndEnter() {
    setSaving(true);
    setStatus({ type: 'idle', message: '' });

    const result = await saveOnboardingProfile(onboardingState);

    setSaving(false);

    if (!result.ok) {
      setStatus({
        type: 'error',
        message: result.message,
      });
      return;
    }

    setStatus({
      type: 'success',
      message: result.message,
    });

    router.push('/iris');
  }

  return (
    <OnboardingMinimalStep
      eyebrow="Finalização"
      title="Tudo pronto."
    >
      <div className="mx-auto w-full max-w-4xl">
        <div
          data-iris-onboarding-surface
          className="mb-5 rounded-[26px] border border-white/70 bg-white/[0.22] p-5 backdrop-blur-sm"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
                  <CheckCircle2 size={18} strokeWidth={1.8} />
                </span>

                <h2 className="font-display text-3xl tracking-[-0.04em] text-[#002c1f]">
                  Revisão final do onboarding
                </h2>
              </div>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#476153]">
                Confira abaixo tudo que foi coletado. A próxima ação salva o perfil e abre a tela inicial simplificada da IRIS.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="md"
              className="min-h-11 rounded-[18px] border-emerald-800/18 px-5 text-emerald-900 hover:bg-emerald-800/10"
              onClick={() => router.push('/iris')}
            >
              Abrir sem salvar
              <ExternalLink size={15} strokeWidth={1.8} />
            </Button>
          </div>

          {status.message && (
            <div
              className={[
                'mt-5 rounded-[20px] border px-4 py-3 text-sm leading-6',
                status.type === 'success'
                  ? 'border-emerald-800/18 bg-emerald-800/[0.07] text-[#002c1f]'
                  : 'border-[#F3C9C7] bg-[#FCE8E8]/76 text-[#8F312D]',
              ].join(' ')}
            >
              {status.message}
            </div>
          )}
        </div>

        <OnboardingDataPanel state={onboardingState} />

        <OnboardingBottomActions
          helpTitle="O que essa etapa faz"
          help={
            <>
              <p>
                Esta etapa revisa todos os dados coletados no onboarding antes de entrar na IRIS.
              </p>
              <p>
                Ao salvar, a IRIS tenta gravar os campos na tabela profiles do Supabase.
              </p>
              <p>
                A tela inicial simplificada também mostra todos os dados para validação visual do fluxo completo.
              </p>
            </>
          }
          left={
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="min-h-12 rounded-[18px] px-6 text-[#747D79] hover:text-[#002c1f]"
              disabled={saving}
              onClick={() => router.back()}
            >
              <ArrowLeft size={16} strokeWidth={1.8} />
              Voltar
            </Button>
          }
          right={
            <Button
              type="button"
              variant="auth"
              size="lg"
              disabled={saving}
              className="min-h-12 rounded-[18px] px-8"
              onClick={handleSaveAndEnter}
            >
              {saving ? (
                <>
                  <Loader2 size={16} strokeWidth={1.8} className="animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar e entrar na IRIS'
              )}
            </Button>
          }
        />
      </div>
    </OnboardingMinimalStep>
  );
}
TSX

cat > src/app/iris/page.tsx <<'TSX'
'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Home, RotateCcw, Sparkles } from 'lucide-react';
import { AccessibilityRuntime } from '@/components/accessibility/AccessibilityRuntime';
import { OnboardingDataPanel } from '@/components/onboarding/finish/OnboardingDataPanel';
import { useOnboardingStore } from '@/lib/store/onboardingStore';

const LOGO_PATH = '/iris/brand/logotipo/svg/iris-logotipo-colorido.svg';

export default function IrisInitialPage() {
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
          <aside className="lg:sticky lg:top-8">
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
                  href="/onboarding/welcome"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[18px] border border-emerald-800/18 px-5 text-sm font-semibold text-[#002c1f] transition-all hover:bg-emerald-800/10"
                >
                  <RotateCcw size={15} strokeWidth={1.8} />
                  Rever onboarding
                </Link>

                <Link
                  href="/onboarding/finish"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[18px] bg-emerald-800 px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(0,44,31,0.18)] transition-all hover:bg-emerald-900"
                >
                  Dados completos
                  <ArrowRight size={15} strokeWidth={1.8} />
                </Link>
              </div>
            </div>

            <div className="mt-5 rounded-[26px] border border-white/70 bg-white/[0.24] p-5 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
                  <Sparkles size={17} strokeWidth={1.8} />
                </span>

                <div>
                  <h2 className="font-display text-2xl tracking-[-0.035em] text-[#002c1f]">
                    Tela inicial simplificada
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#476153]">
                    Esta página existe para validar se o fluxo inteiro está carregando os dados corretamente antes de construirmos o dashboard real.
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
TSX

echo "✅ FE-IRIS-045 aplicado: finish criado e tela inicial /iris criada com todos os dados do onboarding."
