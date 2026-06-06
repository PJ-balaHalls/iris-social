#!/usr/bin/env bash
set -euo pipefail

mkdir -p src/app/onboarding/personality
mkdir -p src/components/onboarding/personality

cat > src/components/onboarding/personality/PersonalityChoiceQuestion.tsx <<'TSX'
'use client';

import type { LucideIcon } from 'lucide-react';

type PersonalityChoiceOption = {
  value: string;
  label: string;
};

type PersonalityChoiceQuestionProps = {
  title: string;
  value: string;
  options: PersonalityChoiceOption[];
  icon?: LucideIcon;
  onChange: (value: string) => void;
};

export function PersonalityChoiceQuestion({
  title,
  value,
  options,
  icon: Icon,
  onChange,
}: PersonalityChoiceQuestionProps) {
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

cat > src/components/onboarding/personality/PersonalityScaleQuestion.tsx <<'TSX'
'use client';

import type { LucideIcon } from 'lucide-react';

type PersonalityScaleQuestionProps = {
  title: string;
  minLabel: string;
  maxLabel: string;
  value: number;
  icon?: LucideIcon;
  onChange: (value: number) => void;
};

export function PersonalityScaleQuestion({
  title,
  minLabel,
  maxLabel,
  value,
  icon: Icon,
  onChange,
}: PersonalityScaleQuestionProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        {Icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
            <Icon size={17} strokeWidth={1.8} />
          </span>
        )}

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

cat > src/components/onboarding/personality/PersonalityFinalReview.tsx <<'TSX'
import { CheckCircle2 } from 'lucide-react';

type PersonalityFinalReviewProps = {
  mbtiSignal: string;
  emotionalIntensity: number;
  openness: number;
  labels: string[];
};

export function PersonalityFinalReview({
  mbtiSignal,
  emotionalIntensity,
  openness,
  labels,
}: PersonalityFinalReviewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
          <CheckCircle2 size={17} strokeWidth={1.8} />
        </span>

        <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
          Revisão do seu sinal.
        </h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {labels.map((label) => (
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
            Sinal
          </p>
          <p className="mt-2 font-display text-3xl text-[#002c1f]">
            {mbtiSignal || '—'}
          </p>
        </div>

        <div className="rounded-[22px] border border-white/70 bg-white/[0.26] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Intensidade
          </p>
          <p className="mt-2 font-display text-3xl text-[#002c1f]">
            {emotionalIntensity}/10
          </p>
        </div>

        <div className="rounded-[22px] border border-white/70 bg-white/[0.26] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Abertura
          </p>
          <p className="mt-2 font-display text-3xl text-[#002c1f]">
            {openness}/10
          </p>
        </div>
      </div>
    </div>
  );
}
TSX

cat > src/app/onboarding/personality/page.tsx <<'TSX'
'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Compass,
  Heart,
  Layers3,
  Sparkles,
  UsersRound,
  Waves,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { OnboardingBottomActions } from '@/components/onboarding/OnboardingBottomActions';
import { OnboardingFieldLine } from '@/components/onboarding/OnboardingFieldLine';
import { OnboardingMinimalStep } from '@/components/onboarding/OnboardingMinimalStep';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { PersonalityChoiceQuestion } from '@/components/onboarding/personality/PersonalityChoiceQuestion';
import { PersonalityScaleQuestion } from '@/components/onboarding/personality/PersonalityScaleQuestion';
import { PersonalityFinalReview } from '@/components/onboarding/personality/PersonalityFinalReview';

type PersonalityDraft = {
  energy: string;
  perception: string;
  decision: string;
  structure: string;
  socialRhythm: string;
  emotionalIntensity: number;
  openness: number;
};

type PersonalityStepKey =
  | 'energy'
  | 'perception'
  | 'decision'
  | 'structure'
  | 'socialRhythm'
  | 'emotionalIntensity'
  | 'openness'
  | 'review';

function createInitialDraft(personalityData: any): PersonalityDraft {
  return {
    energy: personalityData?.energy || '',
    perception: personalityData?.perception || '',
    decision: personalityData?.decision || '',
    structure: personalityData?.structure || '',
    socialRhythm: personalityData?.socialRhythm || '',
    emotionalIntensity: Number(personalityData?.emotionalIntensity || 5),
    openness: Number(personalityData?.openness || 5),
  };
}

function getMbtiSignal(draft: PersonalityDraft) {
  const first = draft.energy === 'introvert' ? 'I' : draft.energy === 'extrovert' ? 'E' : '';
  const second =
    draft.perception === 'details' ? 'S' : draft.perception === 'patterns' ? 'N' : '';
  const third = draft.decision === 'logic' ? 'T' : draft.decision === 'feeling' ? 'F' : '';
  const fourth = draft.structure === 'planned' ? 'J' : draft.structure === 'fluid' ? 'P' : '';

  return `${first}${second}${third}${fourth}`;
}

const steps: Array<{
  key: PersonalityStepKey;
  shortLabel: string;
}> = [
  { key: 'energy', shortLabel: 'Energia' },
  { key: 'perception', shortLabel: 'Percepção' },
  { key: 'decision', shortLabel: 'Decisão' },
  { key: 'structure', shortLabel: 'Rotina' },
  { key: 'socialRhythm', shortLabel: 'Social' },
  { key: 'emotionalIntensity', shortLabel: 'Intensidade' },
  { key: 'openness', shortLabel: 'Abertura' },
  { key: 'review', shortLabel: 'Revisão' },
];

function getDraftLabels(draft: PersonalityDraft) {
  const labels: string[] = [];

  if (draft.energy === 'introvert') labels.push('recarrega no silêncio');
  if (draft.energy === 'extrovert') labels.push('recarrega na troca');

  if (draft.perception === 'details') labels.push('percebe detalhes');
  if (draft.perception === 'patterns') labels.push('percebe padrões');

  if (draft.decision === 'logic') labels.push('decide por clareza');
  if (draft.decision === 'feeling') labels.push('decide por sentido');

  if (draft.structure === 'planned') labels.push('prefere estrutura');
  if (draft.structure === 'fluid') labels.push('prefere fluidez');

  if (draft.socialRhythm === 'reserved') labels.push('presença reservada');
  if (draft.socialRhythm === 'expressive') labels.push('presença expressiva');

  return labels;
}

export default function PersonalityPage() {
  const router = useRouter();
  const { personalityData, updateField } = useOnboardingStore();

  const [draft, setDraft] = useState<PersonalityDraft>(() => createInitialDraft(personalityData));
  const [stepIndex, setStepIndex] = useState(0);
  const [alert, setAlert] = useState('');

  const currentStep = steps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isReviewStep = currentStep.key === 'review';
  const mbtiSignal = useMemo(() => getMbtiSignal(draft), [draft]);
  const labels = useMemo(() => getDraftLabels(draft), [draft]);

  const completed =
    Boolean(draft.energy) &&
    Boolean(draft.perception) &&
    Boolean(draft.decision) &&
    Boolean(draft.structure) &&
    Boolean(draft.socialRhythm);

  function updateDraft<Key extends keyof PersonalityDraft>(
    key: Key,
    value: PersonalityDraft[Key]
  ) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
    setAlert('');
  }

  function currentStepIsReady() {
    const key = currentStep.key;

    if (key === 'review') return completed;
    if (key === 'emotionalIntensity' || key === 'openness') return true;

    return Boolean(draft[key]);
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

    if (!completed) {
      setAlert('Finalize as escolhas principais para continuar.');
      return;
    }

    updateField('personalityData', {
      ...draft,
      mbtiSignal,
      completedAt: new Date().toISOString(),
    });

    router.push('/onboarding/culture');
  }

  function renderCurrentStep() {
    switch (currentStep.key) {
      case 'energy':
        return (
          <PersonalityChoiceQuestion
            icon={Sparkles}
            title="Onde você recarrega energia?"
            value={draft.energy}
            onChange={(value) => updateDraft('energy', value)}
            options={[
              { value: 'introvert', label: 'No silêncio' },
              { value: 'extrovert', label: 'Na troca' },
            ]}
          />
        );

      case 'perception':
        return (
          <PersonalityChoiceQuestion
            icon={Compass}
            title="Você percebe primeiro..."
            value={draft.perception}
            onChange={(value) => updateDraft('perception', value)}
            options={[
              { value: 'details', label: 'Detalhes concretos' },
              { value: 'patterns', label: 'Padrões e possibilidades' },
            ]}
          />
        );

      case 'decision':
        return (
          <PersonalityChoiceQuestion
            icon={Heart}
            title="Na hora de decidir, pesa mais..."
            value={draft.decision}
            onChange={(value) => updateDraft('decision', value)}
            options={[
              { value: 'logic', label: 'Clareza e lógica' },
              { value: 'feeling', label: 'Sentido e impacto humano' },
            ]}
          />
        );

      case 'structure':
        return (
          <PersonalityChoiceQuestion
            icon={Layers3}
            title="Você prefere viver com..."
            value={draft.structure}
            onChange={(value) => updateDraft('structure', value)}
            options={[
              { value: 'planned', label: 'Estrutura' },
              { value: 'fluid', label: 'Fluidez' },
            ]}
          />
        );

      case 'socialRhythm':
        return (
          <PersonalityChoiceQuestion
            icon={UsersRound}
            title="Seu ritmo social costuma ser..."
            value={draft.socialRhythm}
            onChange={(value) => updateDraft('socialRhythm', value)}
            options={[
              { value: 'reserved', label: 'Mais reservado' },
              { value: 'expressive', label: 'Mais expressivo' },
            ]}
          />
        );

      case 'emotionalIntensity':
        return (
          <PersonalityScaleQuestion
            icon={Waves}
            title="Qual sua intensidade emocional?"
            minLabel="Mais estável"
            maxLabel="Mais intensa"
            value={draft.emotionalIntensity}
            onChange={(value) => updateDraft('emotionalIntensity', value)}
          />
        );

      case 'openness':
        return (
          <PersonalityScaleQuestion
            icon={Brain}
            title="Sua abertura a novidades?"
            minLabel="Mais familiar"
            maxLabel="Mais explorador"
            value={draft.openness}
            onChange={(value) => updateDraft('openness', value)}
          />
        );

      case 'review':
        return (
          <PersonalityFinalReview
            mbtiSignal={mbtiSignal}
            emotionalIntensity={draft.emotionalIntensity}
            openness={draft.openness}
            labels={labels}
          />
        );

      default:
        return null;
    }
  }

  return (
    <OnboardingMinimalStep
      eyebrow="Personalidade"
      title="Como você funciona?"
    >
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl">
        {alert && (
          <div className="mb-4 rounded-[20px] border border-[#E8CF8B] bg-[#FFF7DC]/70 px-4 py-3 text-sm leading-6 text-[#7A5A12]">
            {alert}
          </div>
        )}

        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between gap-4 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-[#747D79]">
            <span>
              {String(stepIndex + 1).padStart(2, '0')}
            </span>

            <span>
              {currentStep.shortLabel}
            </span>

            <span>
              {String(steps.length).padStart(2, '0')}
            </span>
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
                Esta etapa cria um retrato inicial de como você tende a perceber, decidir e se relacionar.
              </p>
              <p>
                A IRIS usa isso para calibrar recomendações, linguagem, privacidade emocional e organização do seu espaço.
              </p>
              <p>
                O resultado não é um diagnóstico. É apenas um sinal inicial, editável depois.
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

echo "✅ FE-IRIS-035 aplicado: personality agora exibe uma pergunta por vez com progresso interno e lucide icons discretos."
