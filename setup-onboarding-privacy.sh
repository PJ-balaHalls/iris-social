#!/usr/bin/env bash
set -euo pipefail

mkdir -p src/app/onboarding/privacy
mkdir -p src/components/onboarding/privacy
mkdir -p src/lib/store

cat > src/lib/store/onboardingStore.ts <<'TS'
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FloraInclinacao, SubscriptionPlan } from '@/types/flora';

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
  plan: SubscriptionPlan;

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
  plan: 'free' as SubscriptionPlan,
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

cat > src/components/onboarding/privacy/PrivacyChoiceQuestion.tsx <<'TSX'
'use client';

import type { LucideIcon } from 'lucide-react';

type PrivacyChoiceOption = {
  value: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
};

type PrivacyChoiceQuestionProps = {
  title: string;
  value: string;
  options: PrivacyChoiceOption[];
  onChange: (value: string) => void;
};

export function PrivacyChoiceQuestion({
  title,
  value,
  options,
  onChange,
}: PrivacyChoiceQuestionProps) {
  return (
    <fieldset className="space-y-6">
      <legend className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
        {title}
      </legend>

      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const selected = value === option.value;
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={selected}
              className={[
                'min-h-20 rounded-[22px] border px-5 py-4 text-left transition-all duration-200',
                selected
                  ? 'border-emerald-800 bg-emerald-800 text-white shadow-[0_12px_28px_rgba(0,44,31,0.18)]'
                  : 'border-white/70 bg-white/[0.28] text-[#002c1f] hover:border-emerald-800/20 hover:bg-emerald-800/[0.065]',
              ].join(' ')}
            >
              <span className="flex items-start gap-3">
                {Icon && (
                  <Icon
                    size={17}
                    strokeWidth={1.8}
                    className={selected ? 'mt-0.5 text-white' : 'mt-0.5 text-[#002c1f]'}
                  />
                )}

                <span>
                  <span className="block text-sm font-semibold">
                    {option.label}
                  </span>

                  {option.description && (
                    <span
                      className={[
                        'mt-1 block text-xs leading-5',
                        selected ? 'text-white/78' : 'text-[#747D79]',
                      ].join(' ')}
                    >
                      {option.description}
                    </span>
                  )}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
TSX

cat > src/components/onboarding/privacy/PrivacyProtectionGrid.tsx <<'TSX'
'use client';

import type { LucideIcon } from 'lucide-react';

type PrivacyProtectionOption = {
  value: string;
  label: string;
  icon?: LucideIcon;
};

type PrivacyProtectionGridProps = {
  title: string;
  value: string[];
  options: PrivacyProtectionOption[];
  onChange: (value: string[]) => void;
};

export function PrivacyProtectionGrid({
  title,
  value,
  options,
  onChange,
}: PrivacyProtectionGridProps) {
  function toggleTag(tag: string) {
    if (value.includes(tag)) {
      onChange(value.filter((item) => item !== tag));
      return;
    }

    onChange([...value, tag]);
  }

  return (
    <fieldset className="space-y-5">
      <legend className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
        {title}
      </legend>

      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const selected = value.includes(option.value);
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleTag(option.value)}
              aria-pressed={selected}
              className={[
                'flex min-h-14 items-center gap-3 rounded-[20px] border px-4 text-left text-sm font-semibold transition-all duration-200',
                selected
                  ? 'border-emerald-800 bg-emerald-800 text-white shadow-[0_10px_24px_rgba(0,44,31,0.18)]'
                  : 'border-white/70 bg-white/[0.28] text-[#002c1f] hover:border-emerald-800/20 hover:bg-emerald-800/[0.065]',
              ].join(' ')}
            >
              {Icon && <Icon size={17} strokeWidth={1.8} />}
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
TSX

cat > src/components/onboarding/privacy/PrivacyFinalReview.tsx <<'TSX'
import { CheckCircle2 } from 'lucide-react';

type PrivacyFinalReviewProps = {
  level: string;
  memoryDefault: string;
  aiUse: string;
  protections: string[];
  labels: Record<string, string>;
};

export function PrivacyFinalReview({
  level,
  memoryDefault,
  aiUse,
  protections,
  labels,
}: PrivacyFinalReviewProps) {
  const items = [
    labels[level] || level,
    labels[memoryDefault] || memoryDefault,
    labels[aiUse] || aiUse,
    ...protections.map((item) => labels[item] || item),
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
          <CheckCircle2 size={17} strokeWidth={1.8} />
        </span>

        <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
          Privacidade definida.
        </h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/70 bg-white/[0.30] px-3 py-1.5 text-xs font-semibold text-[#002c1f]"
          >
            {item}
          </span>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-[22px] border border-white/70 bg-white/[0.26] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Perfil
          </p>
          <p className="mt-2 font-display text-2xl text-[#002c1f]">
            {labels[level] || '—'}
          </p>
        </div>

        <div className="rounded-[22px] border border-white/70 bg-white/[0.26] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Memórias
          </p>
          <p className="mt-2 font-display text-2xl text-[#002c1f]">
            {labels[memoryDefault] || '—'}
          </p>
        </div>

        <div className="rounded-[22px] border border-white/70 bg-white/[0.26] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Proteções
          </p>
          <p className="mt-2 font-display text-3xl text-[#002c1f]">
            {protections.length}
          </p>
        </div>
      </div>
    </div>
  );
}
TSX

cat > src/app/onboarding/privacy/page.tsx <<'TSX'
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Eye,
  EyeOff,
  Fingerprint,
  LockKeyhole,
  MapPinOff,
  ShieldCheck,
  UserCheck,
  UsersRound,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { OnboardingBottomActions } from '@/components/onboarding/OnboardingBottomActions';
import { OnboardingFieldLine } from '@/components/onboarding/OnboardingFieldLine';
import { OnboardingMinimalStep } from '@/components/onboarding/OnboardingMinimalStep';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { PrivacyChoiceQuestion } from '@/components/onboarding/privacy/PrivacyChoiceQuestion';
import { PrivacyProtectionGrid } from '@/components/onboarding/privacy/PrivacyProtectionGrid';
import { PrivacyFinalReview } from '@/components/onboarding/privacy/PrivacyFinalReview';

type PrivacyLevel = 'private' | 'friends' | 'public';

type PrivacyDraft = {
  level: PrivacyLevel | '';
  memoryDefault: string;
  aiUse: string;
  protections: string[];
};

type PrivacyStepKey = 'level' | 'memoryDefault' | 'aiUse' | 'protections' | 'review';

const labels: Record<string, string> = {
  private: 'Privado',
  friends: 'Por vínculo',
  public: 'Público controlado',
  locked: 'Sempre privadas',
  selective: 'Perguntar ao salvar',
  circle: 'Vínculos próximos',
  ai_off: 'IA limitada',
  ai_assisted: 'IA assistida',
  ai_personalized: 'IA personalizada',
  confirm_sensitive: 'Confirmar conteúdos sensíveis',
  hide_location: 'Ocultar localização',
  hide_age: 'Ocultar idade',
  review_before_share: 'Revisar antes de compartilhar',
  blur_media: 'Desfocar mídia sensível',
  quiet_mode: 'Modo silencioso',
};

const steps: Array<{ key: PrivacyStepKey; shortLabel: string }> = [
  { key: 'level', shortLabel: 'Perfil' },
  { key: 'memoryDefault', shortLabel: 'Memórias' },
  { key: 'aiUse', shortLabel: 'IA' },
  { key: 'protections', shortLabel: 'Proteções' },
  { key: 'review', shortLabel: 'Revisão' },
];

function createInitialDraft(
  privacyLevel: PrivacyLevel,
  privacyData: any
): PrivacyDraft {
  return {
    level: privacyData?.level || privacyLevel || 'private',
    memoryDefault: privacyData?.memoryDefault || 'selective',
    aiUse: privacyData?.aiUse || 'ai_assisted',
    protections: Array.isArray(privacyData?.protections)
      ? privacyData.protections
      : ['confirm_sensitive', 'review_before_share'],
  };
}

export default function PrivacyPage() {
  const router = useRouter();
  const { privacyLevel, privacyData, updateField } = useOnboardingStore();

  const [draft, setDraft] = useState<PrivacyDraft>(() =>
    createInitialDraft(privacyLevel, privacyData)
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [alert, setAlert] = useState('');

  const currentStep = steps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isReviewStep = currentStep.key === 'review';

  const completed =
    Boolean(draft.level) &&
    Boolean(draft.memoryDefault) &&
    Boolean(draft.aiUse);

  function updateDraft<Key extends keyof PrivacyDraft>(
    key: Key,
    value: PrivacyDraft[Key]
  ) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
    setAlert('');
  }

  function currentStepIsReady() {
    if (currentStep.key === 'level') return Boolean(draft.level);
    if (currentStep.key === 'memoryDefault') return Boolean(draft.memoryDefault);
    if (currentStep.key === 'aiUse') return Boolean(draft.aiUse);
    if (currentStep.key === 'protections') return true;
    return completed;
  }

  function goNext() {
    if (!currentStepIsReady()) {
      setAlert('Escolha uma opção para continuar.');
      return;
    }

    setAlert('');
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  }

  function goBack() {
    setAlert('');

    if (isFirstStep) {
      router.back();
      return;
    }

    setStepIndex((current) => Math.max(current - 1, 0));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!completed || !draft.level) {
      setAlert('Finalize suas preferências de privacidade para continuar.');
      return;
    }

    const finalPrivacyData = {
      ...draft,
      levelLabel: labels[draft.level] || draft.level,
      memoryDefaultLabel: labels[draft.memoryDefault] || draft.memoryDefault,
      aiUseLabel: labels[draft.aiUse] || draft.aiUse,
      protectionLabels: draft.protections.map((item) => labels[item] || item),
      completedAt: new Date().toISOString(),
    };

    updateField('privacyLevel', draft.level);
    updateField('privacyData', finalPrivacyData);

    router.push('/onboarding/accessibility');
  }

  function renderCurrentStep() {
    switch (currentStep.key) {
      case 'level':
        return (
          <PrivacyChoiceQuestion
            title="Quem pode encontrar seu perfil?"
            value={draft.level}
            onChange={(value) => updateDraft('level', value as PrivacyLevel)}
            options={[
              {
                value: 'private',
                label: 'Privado',
                description: 'Você controla convites, busca e visibilidade.',
                icon: EyeOff,
              },
              {
                value: 'friends',
                label: 'Por vínculo',
                description: 'Pessoas conectadas podem encontrar partes do seu espaço.',
                icon: UsersRound,
              },
              {
                value: 'public',
                label: 'Público controlado',
                description: 'Perfil descobrível, com conteúdo protegido por padrão.',
                icon: Eye,
              },
            ]}
          />
        );

      case 'memoryDefault':
        return (
          <PrivacyChoiceQuestion
            title="Como novas memórias devem nascer?"
            value={draft.memoryDefault}
            onChange={(value) => updateDraft('memoryDefault', value)}
            options={[
              {
                value: 'locked',
                label: 'Sempre privadas',
                description: 'Tudo começa fechado até você alterar.',
                icon: LockKeyhole,
              },
              {
                value: 'selective',
                label: 'Perguntar ao salvar',
                description: 'A IRIS confirma a visibilidade de cada memória.',
                icon: UserCheck,
              },
              {
                value: 'circle',
                label: 'Vínculos próximos',
                description: 'Memórias leves podem ir para pessoas confiáveis.',
                icon: UsersRound,
              },
            ]}
          />
        );

      case 'aiUse':
        return (
          <PrivacyChoiceQuestion
            title="Como a IA pode usar seu contexto?"
            value={draft.aiUse}
            onChange={(value) => updateDraft('aiUse', value)}
            options={[
              {
                value: 'ai_off',
                label: 'IA limitada',
                description: 'Menos personalização, mais controle manual.',
                icon: Bot,
              },
              {
                value: 'ai_assisted',
                label: 'IA assistida',
                description: 'Sugestões com contexto mínimo e aprovação sua.',
                icon: ShieldCheck,
              },
              {
                value: 'ai_personalized',
                label: 'IA personalizada',
                description: 'Mais contexto para recomendações e organização.',
                icon: Fingerprint,
              },
            ]}
          />
        );

      case 'protections':
        return (
          <PrivacyProtectionGrid
            title="Quais proteções extras deseja ativar?"
            value={draft.protections}
            onChange={(value) => updateDraft('protections', value)}
            options={[
              {
                value: 'confirm_sensitive',
                label: 'Confirmar conteúdos sensíveis',
                icon: ShieldCheck,
              },
              {
                value: 'hide_location',
                label: 'Ocultar localização',
                icon: MapPinOff,
              },
              {
                value: 'hide_age',
                label: 'Ocultar idade',
                icon: EyeOff,
              },
              {
                value: 'review_before_share',
                label: 'Revisar antes de compartilhar',
                icon: UserCheck,
              },
              {
                value: 'blur_media',
                label: 'Desfocar mídia sensível',
                icon: EyeOff,
              },
              {
                value: 'quiet_mode',
                label: 'Modo silencioso',
                icon: LockKeyhole,
              },
            ]}
          />
        );

      case 'review':
        return (
          <PrivacyFinalReview
            level={draft.level}
            memoryDefault={draft.memoryDefault}
            aiUse={draft.aiUse}
            protections={draft.protections}
            labels={labels}
          />
        );

      default:
        return null;
    }
  }

  return (
    <OnboardingMinimalStep
      eyebrow="Privacidade"
      title="Defina seus limites."
    >
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl">
        {alert && (
          <div className="mb-4 rounded-[20px] border border-[#E8CF8B] bg-[#FFF7DC]/70 px-4 py-3 text-sm leading-6 text-[#7A5A12]">
            {alert}
          </div>
        )}

        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between gap-4 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-[#747D79]">
            <span>{String(stepIndex + 1).padStart(2, '0')}</span>
            <span>{currentStep.shortLabel}</span>
            <span>{String(steps.length).padStart(2, '0')}</span>
          </div>

          <div className="h-[5px] overflow-hidden rounded-full bg-white/54">
            <div
              className="h-full rounded-full bg-[#002c1f] transition-all duration-300"
              style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="rounded-[26px] bg-white/[0.22] px-4 py-2 backdrop-blur-sm">
          <OnboardingFieldLine>
            {renderCurrentStep()}
          </OnboardingFieldLine>
        </div>

        <OnboardingBottomActions
          helpTitle="O que essa etapa faz"
          help={
            <>
              <p>
                Esta etapa define as regras iniciais de visibilidade, memória e uso de contexto pela IA.
              </p>
              <p>
                A IRIS parte do princípio de privacidade por padrão. Você pode abrir partes do espaço depois, com controle.
              </p>
              <p>
                Essas escolhas podem ser alteradas nas configurações de privacidade.
              </p>
            </>
          }
          left={
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="min-h-12 rounded-[18px] px-6 text-[#747D79] hover:text-[#002c1f]"
              onClick={goBack}
            >
              <ArrowLeft size={16} strokeWidth={1.8} />
              {isFirstStep ? 'Voltar' : 'Anterior'}
            </Button>
          }
          right={
            isReviewStep ? (
              <Button
                type="submit"
                variant="auth"
                size="lg"
                disabled={!completed}
                className="min-h-12 rounded-[18px] px-8"
              >
                Continuar
              </Button>
            ) : (
              <Button
                type="button"
                variant="auth"
                size="lg"
                disabled={!currentStepIsReady()}
                className="min-h-12 rounded-[18px] px-8"
                onClick={goNext}
              >
                Próxima
                <ArrowRight size={16} strokeWidth={1.8} />
              </Button>
            )
          }
        />
      </form>
    </OnboardingMinimalStep>
  );
}
TSX

echo "✅ FE-IRIS-039 aplicado: privacy criado com fluxo por etapas, limites, IA, proteções e revisão."
