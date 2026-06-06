#!/usr/bin/env bash
set -euo pipefail

mkdir -p src/app/onboarding/culture
mkdir -p src/components/onboarding/culture
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
  intention: FloraInclinacao;
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
  intention: 'INTROSPECTIVA' as FloraInclinacao,
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

cat > src/components/onboarding/culture/CultureTagGrid.tsx <<'TSX'
'use client';

import type { LucideIcon } from 'lucide-react';

type CultureTagOption = {
  value: string;
  label: string;
  icon?: LucideIcon;
};

type CultureTagGridProps = {
  title: string;
  value: string[];
  minSelected?: number;
  options: CultureTagOption[];
  onChange: (value: string[]) => void;
};

export function CultureTagGrid({
  title,
  value,
  minSelected = 0,
  options,
  onChange,
}: CultureTagGridProps) {
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
                'flex min-h-12 items-center gap-3 rounded-[18px] border px-4 text-left text-sm font-semibold transition-all duration-200',
                selected
                  ? 'border-emerald-800 bg-emerald-800 text-white shadow-[0_10px_24px_rgba(0,44,31,0.18)]'
                  : 'border-white/70 bg-white/[0.28] text-[#002c1f] hover:border-emerald-800/20 hover:bg-emerald-800/[0.065]',
              ].join(' ')}
            >
              {Icon && (
                <Icon
                  size={16}
                  strokeWidth={1.8}
                  className={selected ? 'text-white' : 'text-[#002c1f]'}
                />
              )}

              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
TSX

cat > src/components/onboarding/culture/CultureChoiceQuestion.tsx <<'TSX'
'use client';

import type { LucideIcon } from 'lucide-react';

type CultureChoiceOption = {
  value: string;
  label: string;
};

type CultureChoiceQuestionProps = {
  title: string;
  value: string;
  options: CultureChoiceOption[];
  icon?: LucideIcon;
  onChange: (value: string) => void;
};

export function CultureChoiceQuestion({
  title,
  value,
  options,
  icon: Icon,
  onChange,
}: CultureChoiceQuestionProps) {
  return (
    <fieldset className="space-y-6">
      <legend className="w-full">
        <div className="flex items-center gap-3">
          {Icon && (
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
              <Icon size={17} strokeWidth={1.8} />
            </span>
          )}

          <span className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
            {title}
          </span>
        </div>
      </legend>

      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const selected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={selected}
              className={[
                'min-h-16 rounded-[22px] border px-5 text-left text-sm font-semibold transition-all duration-200',
                selected
                  ? 'border-emerald-800 bg-emerald-800 text-white shadow-[0_12px_28px_rgba(0,44,31,0.18)]'
                  : 'border-white/70 bg-white/[0.28] text-[#002c1f] hover:border-emerald-800/20 hover:bg-emerald-800/[0.065]',
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

cat > src/components/onboarding/culture/CultureFinalReview.tsx <<'TSX'
import { CheckCircle2 } from 'lucide-react';

type CultureFinalReviewProps = {
  tags: string[];
  formats: string[];
  tone: string;
  rhythm: string;
  labels: Record<string, string>;
};

export function CultureFinalReview({
  tags,
  formats,
  tone,
  rhythm,
  labels,
}: CultureFinalReviewProps) {
  const allTags = [
    ...tags.map((tag) => labels[tag] || tag),
    ...formats.map((format) => labels[format] || format),
    labels[tone] || tone,
    labels[rhythm] || rhythm,
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
          <CheckCircle2 size={17} strokeWidth={1.8} />
        </span>

        <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
          Seu repertório inicial.
        </h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {allTags.map((label) => (
          <span
            key={label}
            className="rounded-full border border-white/70 bg-white/[0.30] px-3 py-1.5 text-xs font-semibold text-[#002c1f]"
          >
            {label}
          </span>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-[22px] border border-white/70 bg-white/[0.26] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Temas
          </p>
          <p className="mt-2 font-display text-3xl text-[#002c1f]">
            {tags.length}
          </p>
        </div>

        <div className="rounded-[22px] border border-white/70 bg-white/[0.26] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Formatos
          </p>
          <p className="mt-2 font-display text-3xl text-[#002c1f]">
            {formats.length}
          </p>
        </div>

        <div className="rounded-[22px] border border-white/70 bg-white/[0.26] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Tom
          </p>
          <p className="mt-2 font-display text-2xl text-[#002c1f]">
            {labels[tone] || '—'}
          </p>
        </div>
      </div>
    </div>
  );
}
TSX

cat > src/app/onboarding/culture/page.tsx <<'TSX'
'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Camera,
  Clapperboard,
  Gamepad2,
  HeartHandshake,
  Leaf,
  Music2,
  Palette,
  PenLine,
  Sparkles,
  Utensils,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { OnboardingBottomActions } from '@/components/onboarding/OnboardingBottomActions';
import { OnboardingFieldLine } from '@/components/onboarding/OnboardingFieldLine';
import { OnboardingMinimalStep } from '@/components/onboarding/OnboardingMinimalStep';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { CultureTagGrid } from '@/components/onboarding/culture/CultureTagGrid';
import { CultureChoiceQuestion } from '@/components/onboarding/culture/CultureChoiceQuestion';
import { CultureFinalReview } from '@/components/onboarding/culture/CultureFinalReview';

type CultureDraft = {
  tags: string[];
  formats: string[];
  tone: string;
  rhythm: string;
};

type CultureStepKey = 'tags' | 'formats' | 'tone' | 'rhythm' | 'review';

const cultureLabels: Record<string, string> = {
  music: 'Música',
  cinema: 'Cinema',
  literature: 'Literatura',
  photography: 'Fotografia',
  art: 'Arte',
  tech: 'Tecnologia',
  nature: 'Natureza',
  games: 'Games',
  gastronomy: 'Gastronomia',
  spirituality: 'Espiritualidade',
  letters: 'Cartas',
  albums: 'Álbuns',
  lists: 'Listas',
  timeline: 'Linha do tempo',
  map: 'Mapa afetivo',
  journal: 'Diário',
  minimal: 'Minimalista',
  poetic: 'Poético',
  direct: 'Direto',
  warm: 'Acolhedor',
  calm: 'Calmo',
  intense: 'Intenso',
};

const steps: Array<{ key: CultureStepKey; shortLabel: string }> = [
  { key: 'tags', shortLabel: 'Temas' },
  { key: 'formats', shortLabel: 'Formatos' },
  { key: 'tone', shortLabel: 'Tom' },
  { key: 'rhythm', shortLabel: 'Ritmo' },
  { key: 'review', shortLabel: 'Revisão' },
];

const cultureTagOptions = [
  { value: 'music', label: 'Música', icon: Music2 },
  { value: 'cinema', label: 'Cinema', icon: Clapperboard },
  { value: 'literature', label: 'Literatura', icon: BookOpen },
  { value: 'photography', label: 'Fotografia', icon: Camera },
  { value: 'art', label: 'Arte', icon: Palette },
  { value: 'tech', label: 'Tecnologia', icon: Sparkles },
  { value: 'nature', label: 'Natureza', icon: Leaf },
  { value: 'games', label: 'Games', icon: Gamepad2 },
  { value: 'gastronomy', label: 'Gastronomia', icon: Utensils },
  { value: 'spirituality', label: 'Espiritualidade', icon: HeartHandshake },
];

const formatOptions = [
  { value: 'letters', label: 'Cartas' },
  { value: 'albums', label: 'Álbuns' },
  { value: 'lists', label: 'Listas' },
  { value: 'timeline', label: 'Linha do tempo' },
  { value: 'map', label: 'Mapa afetivo' },
  { value: 'journal', label: 'Diário' },
];

function createInitialDraft(cultureTags: string[], cultureData: any): CultureDraft {
  return {
    tags: Array.isArray(cultureData?.tags)
      ? cultureData.tags
      : Array.isArray(cultureTags)
        ? cultureTags
        : [],
    formats: Array.isArray(cultureData?.formats) ? cultureData.formats : [],
    tone: cultureData?.tone || '',
    rhythm: cultureData?.rhythm || '',
  };
}

export default function CulturePage() {
  const router = useRouter();
  const { cultureTags, cultureData, updateField } = useOnboardingStore();

  const [draft, setDraft] = useState<CultureDraft>(() =>
    createInitialDraft(cultureTags, cultureData)
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [alert, setAlert] = useState('');

  const currentStep = steps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isReviewStep = currentStep.key === 'review';

  const completed =
    draft.tags.length >= 3 &&
    draft.formats.length >= 2 &&
    Boolean(draft.tone) &&
    Boolean(draft.rhythm);

  const selectedLabels = useMemo(
    () => [
      ...draft.tags.map((tag) => cultureLabels[tag] || tag),
      ...draft.formats.map((format) => cultureLabels[format] || format),
    ],
    [draft.formats, draft.tags]
  );

  function updateDraft<Key extends keyof CultureDraft>(key: Key, value: CultureDraft[Key]) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
    setAlert('');
  }

  function currentStepIsReady() {
    if (currentStep.key === 'tags') return draft.tags.length >= 3;
    if (currentStep.key === 'formats') return draft.formats.length >= 2;
    if (currentStep.key === 'tone') return Boolean(draft.tone);
    if (currentStep.key === 'rhythm') return Boolean(draft.rhythm);
    return completed;
  }

  function goNext() {
    if (!currentStepIsReady()) {
      if (currentStep.key === 'tags') {
        setAlert('Escolha pelo menos 3 temas.');
        return;
      }

      if (currentStep.key === 'formats') {
        setAlert('Escolha pelo menos 2 formatos.');
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
      setAlert('Finalize as escolhas principais para continuar.');
      return;
    }

    const finalCultureData = {
      ...draft,
      selectedLabels,
      completedAt: new Date().toISOString(),
    };

    updateField('cultureTags', draft.tags);
    updateField('cultureData', finalCultureData);

    router.push('/onboarding/integrations');
  }

  function renderCurrentStep() {
    switch (currentStep.key) {
      case 'tags':
        return (
          <CultureTagGrid
            title="Quais temas fazem parte do seu repertório?"
            value={draft.tags}
            minSelected={3}
            options={cultureTagOptions}
            onChange={(value) => updateDraft('tags', value)}
          />
        );

      case 'formats':
        return (
          <CultureTagGrid
            title="Como você gosta de organizar memórias?"
            value={draft.formats}
            minSelected={2}
            options={formatOptions}
            onChange={(value) => updateDraft('formats', value)}
          />
        );

      case 'tone':
        return (
          <CultureChoiceQuestion
            icon={PenLine}
            title="Qual tom combina mais com você?"
            value={draft.tone}
            onChange={(value) => updateDraft('tone', value)}
            options={[
              { value: 'minimal', label: 'Minimalista' },
              { value: 'poetic', label: 'Poético' },
              { value: 'direct', label: 'Direto' },
              { value: 'warm', label: 'Acolhedor' },
            ]}
          />
        );

      case 'rhythm':
        return (
          <CultureChoiceQuestion
            icon={Sparkles}
            title="Qual ritmo você prefere?"
            value={draft.rhythm}
            onChange={(value) => updateDraft('rhythm', value)}
            options={[
              { value: 'calm', label: 'Calmo' },
              { value: 'intense', label: 'Intenso' },
            ]}
          />
        );

      case 'review':
        return (
          <CultureFinalReview
            tags={draft.tags}
            formats={draft.formats}
            tone={draft.tone}
            rhythm={draft.rhythm}
            labels={cultureLabels}
          />
        );

      default:
        return null;
    }
  }

  return (
    <OnboardingMinimalStep
      eyebrow="Cultura"
      title="Do que seu mundo é feito?"
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
                Esta etapa entende seu repertório cultural inicial: temas, formatos e tom de experiência.
              </p>
              <p>
                A IRIS usa isso para organizar memórias, cartas, recomendações e espaços visuais com mais coerência.
              </p>
              <p>
                Você poderá ajustar tudo depois.
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

echo "✅ FE-IRIS-036 aplicado: culture criado com fluxo minimalista, seleção por etapas e resumo final."
