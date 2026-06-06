#!/usr/bin/env bash
set -euo pipefail

mkdir -p src/app/onboarding/intention
mkdir -p src/components/onboarding/intention
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

cat > src/components/onboarding/intention/IntentionChoiceQuestion.tsx <<'TSX'
'use client';

import type { LucideIcon } from 'lucide-react';

type IntentionChoiceOption = {
  value: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
};

type IntentionChoiceQuestionProps = {
  title: string;
  value: string;
  options: IntentionChoiceOption[];
  onChange: (value: string) => void;
};

export function IntentionChoiceQuestion({
  title,
  value,
  options,
  onChange,
}: IntentionChoiceQuestionProps) {
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

cat > src/components/onboarding/intention/IntentionTagGrid.tsx <<'TSX'
'use client';

type IntentionTagOption = {
  value: string;
  label: string;
};

type IntentionTagGridProps = {
  title: string;
  value: string[];
  minSelected?: number;
  options: IntentionTagOption[];
  onChange: (value: string[]) => void;
};

export function IntentionTagGrid({
  title,
  value,
  minSelected = 0,
  options,
  onChange,
}: IntentionTagGridProps) {
  function toggleTag(tag: string) {
    if (value.includes(tag)) {
      onChange(value.filter((item) => item !== tag));
      return;
    }

    onChange([...value, tag]);
  }

  return (
    <fieldset className="space-y-5">
      <legend className="w-full">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
            {title}
          </h2>

          {minSelected > 0 && (
            <span className="shrink-0 rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] px-3 py-1 text-xs font-semibold text-[#002c1f]">
              {value.length}/{minSelected}+
            </span>
          )}
        </div>
      </legend>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value.includes(option.value);

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleTag(option.value)}
              aria-pressed={selected}
              className={[
                'min-h-11 rounded-full border px-4 text-sm font-semibold transition-all duration-200',
                selected
                  ? 'border-emerald-800 bg-emerald-800 text-white shadow-[0_10px_24px_rgba(0,44,31,0.16)]'
                  : 'border-white/70 bg-white/[0.30] text-[#002c1f] hover:border-emerald-800/20 hover:bg-emerald-800/[0.065]',
              ].join(' ')}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
TSX

cat > src/components/onboarding/intention/IntentionScaleQuestion.tsx <<'TSX'
'use client';

import { Gauge } from 'lucide-react';

type IntentionScaleQuestionProps = {
  title: string;
  minLabel: string;
  maxLabel: string;
  value: number;
  onChange: (value: number) => void;
};

export function IntentionScaleQuestion({
  title,
  minLabel,
  maxLabel,
  value,
  onChange,
}: IntentionScaleQuestionProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
          <Gauge size={17} strokeWidth={1.8} />
        </span>

        <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
          {title}
        </h2>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between gap-4">
          <span className="text-sm text-[#747D79]">
            {minLabel}
          </span>

          <span className="rounded-full border border-emerald-800/10 bg-emerald-800/[0.06] px-4 py-1.5 text-sm font-semibold text-[#002c1f]">
            {value}/10
          </span>

          <span className="text-right text-sm text-[#747D79]">
            {maxLabel}
          </span>
        </div>

        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full accent-emerald-800"
          aria-label={title}
        />

        <div className="mt-4 grid grid-cols-10 gap-1">
          {Array.from({ length: 10 }).map((_, index) => {
            const active = index + 1 <= value;

            return (
              <button
                key={index}
                type="button"
                onClick={() => onChange(index + 1)}
                className={[
                  'h-2 rounded-full transition-all',
                  active ? 'bg-emerald-800' : 'bg-white/60 hover:bg-emerald-800/20',
                ].join(' ')}
                aria-label={`Selecionar ${index + 1}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
TSX

cat > src/components/onboarding/intention/IntentionFinalReview.tsx <<'TSX'
import { CheckCircle2 } from 'lucide-react';

type IntentionFinalReviewProps = {
  primary: string;
  reasons: string[];
  timeHorizon: string;
  intensity: number;
  labels: Record<string, string>;
};

export function IntentionFinalReview({
  primary,
  reasons,
  timeHorizon,
  intensity,
  labels,
}: IntentionFinalReviewProps) {
  const items = [
    labels[primary] || primary,
    labels[timeHorizon] || timeHorizon,
    ...reasons.map((reason) => labels[reason] || reason),
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
          <CheckCircle2 size={17} strokeWidth={1.8} />
        </span>

        <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
          Intenção definida.
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
            Direção
          </p>
          <p className="mt-2 font-display text-2xl text-[#002c1f]">
            {labels[primary] || '—'}
          </p>
        </div>

        <div className="rounded-[22px] border border-white/70 bg-white/[0.26] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Horizonte
          </p>
          <p className="mt-2 font-display text-2xl text-[#002c1f]">
            {labels[timeHorizon] || '—'}
          </p>
        </div>

        <div className="rounded-[22px] border border-white/70 bg-white/[0.26] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Intensidade
          </p>
          <p className="mt-2 font-display text-3xl text-[#002c1f]">
            {intensity}/10
          </p>
        </div>
      </div>
    </div>
  );
}
TSX

cat > src/app/onboarding/intention/page.tsx <<'TSX'
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  BookHeart,
  Compass,
  Heart,
  LockKeyhole,
  Orbit,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { OnboardingBottomActions } from '@/components/onboarding/OnboardingBottomActions';
import { OnboardingFieldLine } from '@/components/onboarding/OnboardingFieldLine';
import { OnboardingMinimalStep } from '@/components/onboarding/OnboardingMinimalStep';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { IntentionChoiceQuestion } from '@/components/onboarding/intention/IntentionChoiceQuestion';
import { IntentionTagGrid } from '@/components/onboarding/intention/IntentionTagGrid';
import { IntentionScaleQuestion } from '@/components/onboarding/intention/IntentionScaleQuestion';
import { IntentionFinalReview } from '@/components/onboarding/intention/IntentionFinalReview';

type IntentionDraft = {
  primary: string;
  reasons: string[];
  timeHorizon: string;
  intensity: number;
};

type IntentionStepKey = 'primary' | 'reasons' | 'timeHorizon' | 'intensity' | 'review';

const labels: Record<string, string> = {
  INTROSPECTIVA: 'Introspectiva',
  MEMORIAL: 'Memorial',
  RELACIONAL: 'Relacional',
  CRIATIVA: 'Criativa',
  PROTETORA: 'Protetora',
  FUTURA: 'Futura',
  remember: 'Lembrar melhor',
  organize: 'Organizar minha história',
  connect: 'Cuidar de vínculos',
  create: 'Criar registros',
  protect: 'Proteger memórias',
  understand: 'Me entender',
  now: 'Agora',
  season: 'Próximos meses',
  long_term: 'Longo prazo',
};

const steps: Array<{ key: IntentionStepKey; shortLabel: string }> = [
  { key: 'primary', shortLabel: 'Direção' },
  { key: 'reasons', shortLabel: 'Motivos' },
  { key: 'timeHorizon', shortLabel: 'Tempo' },
  { key: 'intensity', shortLabel: 'Intensidade' },
  { key: 'review', shortLabel: 'Revisão' },
];

const primaryOptions = [
  {
    value: 'INTROSPECTIVA',
    label: 'Introspectiva',
    description: 'Entender melhor sua história, rotina e forma de sentir.',
    icon: Compass,
  },
  {
    value: 'MEMORIAL',
    label: 'Memorial',
    description: 'Guardar lembranças, cartas, fotos e registros importantes.',
    icon: BookHeart,
  },
  {
    value: 'RELACIONAL',
    label: 'Relacional',
    description: 'Cuidar de vínculos, presença e memórias compartilhadas.',
    icon: Heart,
  },
  {
    value: 'CRIATIVA',
    label: 'Criativa',
    description: 'Transformar experiências em textos, coleções e narrativas.',
    icon: Sparkles,
  },
  {
    value: 'PROTETORA',
    label: 'Protetora',
    description: 'Manter privacidade, limites e segurança emocional em primeiro lugar.',
    icon: LockKeyhole,
  },
  {
    value: 'FUTURA',
    label: 'Futura',
    description: 'Construir sonhos, planos e continuidade para os próximos ciclos.',
    icon: Orbit,
  },
];

const reasonOptions = [
  { value: 'remember', label: 'Lembrar melhor' },
  { value: 'organize', label: 'Organizar minha história' },
  { value: 'connect', label: 'Cuidar de vínculos' },
  { value: 'create', label: 'Criar registros' },
  { value: 'protect', label: 'Proteger memórias' },
  { value: 'understand', label: 'Me entender' },
];

function createInitialDraft(intention: string, intentionData: any): IntentionDraft {
  return {
    primary: intentionData?.primary || intention || '',
    reasons: Array.isArray(intentionData?.reasons) ? intentionData.reasons : [],
    timeHorizon: intentionData?.timeHorizon || '',
    intensity: Number(intentionData?.intensity || 5),
  };
}

export default function IntentionPage() {
  const router = useRouter();
  const { intention, intentionData, updateField } = useOnboardingStore();

  const [draft, setDraft] = useState<IntentionDraft>(() =>
    createInitialDraft(intention, intentionData)
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [alert, setAlert] = useState('');

  const currentStep = steps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isReviewStep = currentStep.key === 'review';

  const completed =
    Boolean(draft.primary) &&
    draft.reasons.length >= 2 &&
    Boolean(draft.timeHorizon) &&
    Boolean(draft.intensity);

  function updateDraft<Key extends keyof IntentionDraft>(
    key: Key,
    value: IntentionDraft[Key]
  ) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
    setAlert('');
  }

  function currentStepIsReady() {
    if (currentStep.key === 'primary') return Boolean(draft.primary);
    if (currentStep.key === 'reasons') return draft.reasons.length >= 2;
    if (currentStep.key === 'timeHorizon') return Boolean(draft.timeHorizon);
    if (currentStep.key === 'intensity') return Boolean(draft.intensity);
    return completed;
  }

  function goNext() {
    if (!currentStepIsReady()) {
      if (currentStep.key === 'reasons') {
        setAlert('Escolha pelo menos 2 motivos.');
        return;
      }

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

    if (!completed) {
      setAlert('Finalize sua intenção para continuar.');
      return;
    }

    const finalIntentionData = {
      ...draft,
      primaryLabel: labels[draft.primary] || draft.primary,
      reasonLabels: draft.reasons.map((reason) => labels[reason] || reason),
      timeHorizonLabel: labels[draft.timeHorizon] || draft.timeHorizon,
      completedAt: new Date().toISOString(),
    };

    updateField('intention', draft.primary);
    updateField('intentionData', finalIntentionData);

    router.push('/onboarding/privacy');
  }

  function renderCurrentStep() {
    switch (currentStep.key) {
      case 'primary':
        return (
          <IntentionChoiceQuestion
            title="Qual direção a IRIS deve priorizar?"
            value={draft.primary}
            options={primaryOptions}
            onChange={(value) => updateDraft('primary', value)}
          />
        );

      case 'reasons':
        return (
          <IntentionTagGrid
            title="Por que você quer usar a IRIS?"
            value={draft.reasons}
            minSelected={2}
            options={reasonOptions}
            onChange={(value) => updateDraft('reasons', value)}
          />
        );

      case 'timeHorizon':
        return (
          <IntentionChoiceQuestion
            title="Você pensa nisso para quando?"
            value={draft.timeHorizon}
            options={[
              {
                value: 'now',
                label: 'Agora',
                description: 'Quero organizar o presente e começar simples.',
              },
              {
                value: 'season',
                label: 'Próximos meses',
                description: 'Quero construir uma rotina e perceber evolução.',
              },
              {
                value: 'long_term',
                label: 'Longo prazo',
                description: 'Quero preservar continuidade, memória e futuro.',
              },
            ]}
            onChange={(value) => updateDraft('timeHorizon', value)}
          />
        );

      case 'intensity':
        return (
          <IntentionScaleQuestion
            title="Quão importante isso é agora?"
            minLabel="Leve"
            maxLabel="Essencial"
            value={draft.intensity}
            onChange={(value) => updateDraft('intensity', value)}
          />
        );

      case 'review':
        return (
          <IntentionFinalReview
            primary={draft.primary}
            reasons={draft.reasons}
            timeHorizon={draft.timeHorizon}
            intensity={draft.intensity}
            labels={labels}
          />
        );

      default:
        return null;
    }
  }

  return (
    <OnboardingMinimalStep
      eyebrow="Intenção"
      title="Qual é sua direção?"
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
                Esta etapa define a direção inicial da sua experiência na IRIS.
              </p>
              <p>
                A plataforma usa essa intenção para priorizar módulos, linguagem, recomendações e atalhos.
              </p>
              <p>
                Você poderá alterar sua intenção depois. Ela não limita o app, apenas orienta o começo.
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

echo "✅ FE-IRIS-038 aplicado: intention criado com fluxo por etapas, motivos, intensidade e revisão."
