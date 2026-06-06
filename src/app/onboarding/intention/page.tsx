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
