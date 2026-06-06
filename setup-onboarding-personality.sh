#!/usr/bin/env bash
set -euo pipefail

mkdir -p src/app/onboarding/personality
mkdir -p src/components/onboarding/personality

cat > src/components/onboarding/personality/PersonalityChoiceGroup.tsx <<'TSX'
'use client';

type PersonalityChoiceOption = {
  value: string;
  label: string;
};

type PersonalityChoiceGroupProps = {
  title: string;
  value: string;
  options: PersonalityChoiceOption[];
  onChange: (value: string) => void;
};

export function PersonalityChoiceGroup({
  title,
  value,
  options,
  onChange,
}: PersonalityChoiceGroupProps) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-[#002c1f]">
        {title}
      </legend>

      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const selected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={[
                'min-h-12 rounded-[18px] border px-4 text-left text-sm font-semibold transition-all duration-200',
                selected
                  ? 'border-emerald-800 bg-emerald-800 text-white shadow-[0_10px_24px_rgba(0,44,31,0.18)]'
                  : 'border-emerald-800/10 bg-white/[0.34] text-[#002c1f] hover:border-emerald-800/24 hover:bg-emerald-800/10',
              ].join(' ')}
              aria-pressed={selected}
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

cat > src/components/onboarding/personality/PersonalityScaleField.tsx <<'TSX'
'use client';

type PersonalityScaleFieldProps = {
  title: string;
  minLabel: string;
  maxLabel: string;
  value: number;
  onChange: (value: number) => void;
};

export function PersonalityScaleField({
  title,
  minLabel,
  maxLabel,
  value,
  onChange,
}: PersonalityScaleFieldProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-4">
        <label className="text-sm font-semibold text-[#002c1f]">
          {title}
        </label>

        <span className="rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] px-3 py-1 text-xs font-semibold text-[#002c1f]">
          {value}/10
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

      <div className="mt-2 flex items-center justify-between gap-4 text-xs leading-5 text-[#747D79]">
        <span>{minLabel}</span>
        <span className="text-right">{maxLabel}</span>
      </div>
    </div>
  );
}
TSX

cat > src/components/onboarding/personality/PersonalitySummary.tsx <<'TSX'
type PersonalitySummaryProps = {
  energy: string;
  perception: string;
  decision: string;
  structure: string;
  socialRhythm: string;
  emotionalIntensity: number;
  openness: number;
  mbtiSignal: string;
};

function getLabel(value: string, map: Record<string, string>) {
  return map[value] || 'Ainda não definido';
}

export function PersonalitySummary({
  energy,
  perception,
  decision,
  structure,
  socialRhythm,
  emotionalIntensity,
  openness,
  mbtiSignal,
}: PersonalitySummaryProps) {
  const labels = {
    energy: {
      introvert: 'recarrega no silêncio',
      extrovert: 'recarrega na troca',
    },
    perception: {
      details: 'percebe detalhes',
      patterns: 'percebe padrões',
    },
    decision: {
      logic: 'decide por clareza',
      feeling: 'decide por sentido',
    },
    structure: {
      planned: 'prefere estrutura',
      fluid: 'prefere fluidez',
    },
    socialRhythm: {
      reserved: 'presença reservada',
      expressive: 'presença expressiva',
    },
  };

  return (
    <div>
      <p className="text-sm text-[#747D79]">
        Preview
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full border border-emerald-800/10 bg-white/[0.34] px-3 py-1.5 text-xs font-semibold text-[#002c1f]">
          {getLabel(energy, labels.energy)}
        </span>

        <span className="rounded-full border border-emerald-800/10 bg-white/[0.34] px-3 py-1.5 text-xs font-semibold text-[#002c1f]">
          {getLabel(perception, labels.perception)}
        </span>

        <span className="rounded-full border border-emerald-800/10 bg-white/[0.34] px-3 py-1.5 text-xs font-semibold text-[#002c1f]">
          {getLabel(decision, labels.decision)}
        </span>

        <span className="rounded-full border border-emerald-800/10 bg-white/[0.34] px-3 py-1.5 text-xs font-semibold text-[#002c1f]">
          {getLabel(structure, labels.structure)}
        </span>

        <span className="rounded-full border border-emerald-800/10 bg-white/[0.34] px-3 py-1.5 text-xs font-semibold text-[#002c1f]">
          {getLabel(socialRhythm, labels.socialRhythm)}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[20px] border border-white/70 bg-white/[0.28] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Sinal
          </p>
          <p className="mt-2 font-display text-2xl text-[#002c1f]">
            {mbtiSignal || '—'}
          </p>
        </div>

        <div className="rounded-[20px] border border-white/70 bg-white/[0.28] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Intensidade
          </p>
          <p className="mt-2 font-display text-2xl text-[#002c1f]">
            {emotionalIntensity}/10
          </p>
        </div>

        <div className="rounded-[20px] border border-white/70 bg-white/[0.28] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Abertura
          </p>
          <p className="mt-2 font-display text-2xl text-[#002c1f]">
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
import { Button } from '@/components/ui/Button';
import { OnboardingBottomActions } from '@/components/onboarding/OnboardingBottomActions';
import { OnboardingFieldLine } from '@/components/onboarding/OnboardingFieldLine';
import { OnboardingMinimalStep } from '@/components/onboarding/OnboardingMinimalStep';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { PersonalityChoiceGroup } from '@/components/onboarding/personality/PersonalityChoiceGroup';
import { PersonalityScaleField } from '@/components/onboarding/personality/PersonalityScaleField';
import { PersonalitySummary } from '@/components/onboarding/personality/PersonalitySummary';

type PersonalityDraft = {
  energy: string;
  perception: string;
  decision: string;
  structure: string;
  socialRhythm: string;
  emotionalIntensity: number;
  openness: number;
};

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

export default function PersonalityPage() {
  const router = useRouter();
  const { personalityData, updateField } = useOnboardingStore();

  const [draft, setDraft] = useState<PersonalityDraft>(() => createInitialDraft(personalityData));
  const [alert, setAlert] = useState('');

  const mbtiSignal = useMemo(() => getMbtiSignal(draft), [draft]);

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!completed) {
      setAlert('Responda as escolhas principais para continuar.');
      return;
    }

    updateField('personalityData', {
      ...draft,
      mbtiSignal,
      completedAt: new Date().toISOString(),
    });

    router.push('/onboarding/culture');
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

        <div className="rounded-[26px] bg-white/[0.22] px-4 py-2 backdrop-blur-sm">
          <OnboardingFieldLine>
            <PersonalityChoiceGroup
              title="Onde você recarrega energia?"
              value={draft.energy}
              onChange={(value) => updateDraft('energy', value)}
              options={[
                { value: 'introvert', label: 'No silêncio' },
                { value: 'extrovert', label: 'Na troca' },
              ]}
            />
          </OnboardingFieldLine>

          <OnboardingFieldLine>
            <PersonalityChoiceGroup
              title="Você percebe primeiro..."
              value={draft.perception}
              onChange={(value) => updateDraft('perception', value)}
              options={[
                { value: 'details', label: 'Detalhes concretos' },
                { value: 'patterns', label: 'Padrões e possibilidades' },
              ]}
            />
          </OnboardingFieldLine>

          <OnboardingFieldLine>
            <PersonalityChoiceGroup
              title="Na hora de decidir, pesa mais..."
              value={draft.decision}
              onChange={(value) => updateDraft('decision', value)}
              options={[
                { value: 'logic', label: 'Clareza e lógica' },
                { value: 'feeling', label: 'Sentido e impacto humano' },
              ]}
            />
          </OnboardingFieldLine>

          <OnboardingFieldLine>
            <PersonalityChoiceGroup
              title="Você prefere viver com..."
              value={draft.structure}
              onChange={(value) => updateDraft('structure', value)}
              options={[
                { value: 'planned', label: 'Estrutura' },
                { value: 'fluid', label: 'Fluidez' },
              ]}
            />
          </OnboardingFieldLine>

          <OnboardingFieldLine>
            <PersonalityChoiceGroup
              title="Seu ritmo social costuma ser..."
              value={draft.socialRhythm}
              onChange={(value) => updateDraft('socialRhythm', value)}
              options={[
                { value: 'reserved', label: 'Mais reservado' },
                { value: 'expressive', label: 'Mais expressivo' },
              ]}
            />
          </OnboardingFieldLine>

          <OnboardingFieldLine>
            <PersonalityScaleField
              title="Intensidade emocional"
              minLabel="Mais estável"
              maxLabel="Mais intensa"
              value={draft.emotionalIntensity}
              onChange={(value) => updateDraft('emotionalIntensity', value)}
            />
          </OnboardingFieldLine>

          <OnboardingFieldLine>
            <PersonalityScaleField
              title="Abertura a novidades"
              minLabel="Mais familiar"
              maxLabel="Mais explorador"
              value={draft.openness}
              onChange={(value) => updateDraft('openness', value)}
            />
          </OnboardingFieldLine>

          <OnboardingFieldLine>
            <PersonalitySummary
              energy={draft.energy}
              perception={draft.perception}
              decision={draft.decision}
              structure={draft.structure}
              socialRhythm={draft.socialRhythm}
              emotionalIntensity={draft.emotionalIntensity}
              openness={draft.openness}
              mbtiSignal={mbtiSignal}
            />
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
              onClick={() => router.back()}
            >
              Voltar
            </Button>
          }
          right={
            <Button
              type="submit"
              variant="auth"
              size="lg"
              disabled={!completed}
              className="min-h-12 rounded-[18px] px-8"
            >
              Continuar
            </Button>
          }
        />
      </form>
    </OnboardingMinimalStep>
  );
}
TSX

echo "✅ FE-IRIS-034 aplicado: personality refatorado com padrão minimalista, questionário completo e preview."
