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

        <div data-iris-onboarding-surface className="rounded-[26px] bg-white/[0.22] px-4 py-2 backdrop-blur-sm">
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
