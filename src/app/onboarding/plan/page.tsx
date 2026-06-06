'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Crown,
  Gem,
  Leaf,
  MessageCircle,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { OnboardingBottomActions } from '@/components/onboarding/OnboardingBottomActions';
import { OnboardingFieldLine } from '@/components/onboarding/OnboardingFieldLine';
import { OnboardingMinimalStep } from '@/components/onboarding/OnboardingMinimalStep';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { PlanChoiceGrid, type PlanOption } from '@/components/onboarding/plan/PlanChoiceGrid';
import { PlanCodeField } from '@/components/onboarding/plan/PlanCodeField';
import { PlanFinalReview } from '@/components/onboarding/plan/PlanFinalReview';
import { PlanStartQuestion } from '@/components/onboarding/plan/PlanStartQuestion';

type PlanStepKey = 'start' | 'plan' | 'code' | 'demand' | 'review';

type PlanDraft = {
  planIntent: string;
  billingCycle: string;
  selectedPlan: string;
  hasCode: boolean;
  code: string;
  demandNote: string;
};

const steps: Array<{ key: PlanStepKey; shortLabel: string }> = [
  { key: 'start', shortLabel: 'Começo' },
  { key: 'plan', shortLabel: 'Plano' },
  { key: 'code', shortLabel: 'Código' },
  { key: 'demand', shortLabel: 'Sob demanda' },
  { key: 'review', shortLabel: 'Revisão' },
];

const planOptions: PlanOption[] = [
  {
    value: 'free',
    label: 'IRIS Free',
    eyebrow: 'Gratuito',
    description: 'Para entrar, testar e começar sem pagamento.',
    monthlyPrice: 'R$0',
    annualPrice: 'R$0',
    icon: Leaf,
    highlights: ['sem pagamento', 'essencial', 'início'],
    drawerTitle: 'IRIS Free',
    drawer: [
      'O Free permite finalizar o onboarding e começar a usar a IRIS sem checkout.',
      'É a melhor opção para quem ainda está conhecendo a plataforma ou não quer decidir sobre pagamento agora.',
      'Você poderá trocar para Plus, Pro, Família ou Sob demanda depois, quando o billing estiver conectado.',
    ],
  },
  {
    value: 'plus',
    label: 'IRIS Plus',
    eyebrow: 'Uso pessoal',
    description: 'Para organizar memórias e preferências com mais profundidade.',
    monthlyPrice: 'R$19',
    annualPrice: 'R$190',
    icon: Sparkles,
    highlights: ['mais IA', 'memórias', 'personalização'],
    drawerTitle: 'IRIS Plus',
    drawer: [
      'O Plus é pensado para uso pessoal contínuo, com mais personalização, recomendações e organização de memórias.',
      'Ele fica acima do Free por liberar uma experiência mais completa e menos limitada.',
      'No anual, a ideia é oferecer continuidade e previsibilidade. O desconto final será definido quando o billing for implementado.',
    ],
  },
  {
    value: 'pro',
    label: 'IRIS Pro',
    eyebrow: 'Avançado',
    description: 'Para quem quer IA, integrações e organização mais intensa.',
    monthlyPrice: 'R$39',
    annualPrice: 'R$390',
    icon: Crown,
    highlights: ['IA avançada', 'integrações', 'prioridade'],
    drawerTitle: 'IRIS Pro',
    drawer: [
      'O Pro é voltado para quem quer usar a IRIS como sistema principal de organização pessoal, memórias e inteligência contextual.',
      'A diferença para o Plus está na profundidade de IA, automações, integrações preparadas e limites maiores.',
      'Pagamento, trial, upgrade e downgrade ainda serão conectados depois.',
    ],
  },
  {
    value: 'family',
    label: 'IRIS Família',
    eyebrow: 'Compartilhado',
    description: 'Para vínculos, família ou espaços com mais de uma pessoa.',
    monthlyPrice: 'R$49',
    annualPrice: 'R$490',
    icon: UsersRound,
    highlights: ['vínculos', 'usLIFE', 'perfis'],
    drawerTitle: 'IRIS Família',
    drawer: [
      'O Família expande a lógica do usLIFE para espaços compartilhados, vínculos, datas, cartas e memórias em grupo.',
      'É diferente do Pro porque prioriza colaboração, permissões e múltiplas pessoas.',
      'A cobrança por membros, convites e permissões será definida em uma etapa futura do billing.',
    ],
  },
  {
    value: 'custom',
    label: 'Sob demanda',
    eyebrow: 'Personalizado',
    description: 'Para necessidades específicas, equipe, instituição ou caso especial.',
    monthlyPrice: 'A combinar',
    annualPrice: 'A combinar',
    icon: Gem,
    highlights: ['custom', 'consultivo', 'especial'],
    drawerTitle: 'Plano sob demanda',
    drawer: [
      'O plano sob demanda existe para casos que não cabem nos pacotes padrão.',
      'Pode envolver recursos especiais, limites diferentes, integrações, implantação acompanhada, uso institucional ou condições próprias.',
      'Não há pagamento automático agora. A IRIS apenas registra o interesse e o contexto para contato ou configuração posterior.',
    ],
  },
];

function createInitialDraft(plan: string, planData: any): PlanDraft {
  const selectedPlan = planData?.selectedPlan || plan || 'free';

  return {
    planIntent: planData?.planIntent || (selectedPlan === 'free' ? 'free_now' : 'choose_plan'),
    billingCycle: planData?.billingCycle || 'monthly',
    selectedPlan,
    hasCode: Boolean(planData?.hasCode || planData?.code),
    code: planData?.code || '',
    demandNote: planData?.demandNote || '',
  };
}

function isValidCode(value: string) {
  if (!value) return true;
  return /^[A-Z0-9_-]{4,32}$/.test(value);
}

export default function PlanPage() {
  const router = useRouter();
  const { plan, planData, updateField } = useOnboardingStore();

  const [draft, setDraft] = useState<PlanDraft>(() => createInitialDraft(plan, planData));
  const [stepIndex, setStepIndex] = useState(0);
  const [alert, setAlert] = useState('');
  const [codeError, setCodeError] = useState('');

  const currentStep = steps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isReviewStep = currentStep.key === 'review';

  const selectedPlan = useMemo(
    () => planOptions.find((item) => item.value === draft.selectedPlan) || planOptions[0],
    [draft.selectedPlan]
  );

  const shouldShowDemandStep = draft.selectedPlan === 'custom';
  const isFreeNow = draft.planIntent === 'free_now';

  const completed =
    Boolean(draft.planIntent) &&
    Boolean(draft.billingCycle) &&
    Boolean(draft.selectedPlan) &&
    (!draft.hasCode || isValidCode(draft.code)) &&
    (!shouldShowDemandStep || draft.demandNote.trim().length >= 8);

  function updateDraft<Key extends keyof PlanDraft>(key: Key, value: PlanDraft[Key]) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));

    setAlert('');
    setCodeError('');
  }

  function chooseFreeNow() {
    setDraft((current) => ({
      ...current,
      planIntent: 'free_now',
      billingCycle: 'monthly',
      selectedPlan: 'free',
      hasCode: false,
      code: '',
      demandNote: '',
    }));

    setAlert('');
    setCodeError('');
  }

  function chooseCycle(cycle: 'monthly' | 'annual') {
    setDraft((current) => ({
      ...current,
      planIntent: 'choose_plan',
      billingCycle: cycle,
      selectedPlan: current.selectedPlan === 'free' ? 'plus' : current.selectedPlan,
    }));

    setAlert('');
    setCodeError('');
  }

  function currentStepIsReady() {
    if (currentStep.key === 'start') return Boolean(draft.planIntent);
    if (currentStep.key === 'plan') return Boolean(draft.selectedPlan);

    if (currentStep.key === 'code') {
      if (!draft.hasCode) return true;
      return Boolean(draft.code) && isValidCode(draft.code);
    }

    if (currentStep.key === 'demand') {
      if (!shouldShowDemandStep) return true;
      return draft.demandNote.trim().length >= 8;
    }

    return completed;
  }

  function nextStepIndex(current: number) {
    const next = Math.min(current + 1, steps.length - 1);

    if (isFreeNow && steps[next]?.key !== 'review') {
      return steps.findIndex((step) => step.key === 'review');
    }

    if (steps[next]?.key === 'demand' && !shouldShowDemandStep) {
      return Math.min(next + 1, steps.length - 1);
    }

    return next;
  }

  function previousStepIndex(current: number) {
    const previous = Math.max(current - 1, 0);

    if (steps[current]?.key === 'review' && isFreeNow) {
      return 0;
    }

    if (steps[previous]?.key === 'demand' && !shouldShowDemandStep) {
      return Math.max(previous - 1, 0);
    }

    return previous;
  }

  function goNext() {
    if (!currentStepIsReady()) {
      if (currentStep.key === 'code') {
        setCodeError('Use de 4 a 32 caracteres. Apenas letras, números, underline ou hífen.');
        return;
      }

      if (currentStep.key === 'demand') {
        setAlert('Descreva brevemente o que você precisa no plano sob demanda.');
        return;
      }

      setAlert('Escolha uma opção para continuar.');
      return;
    }

    setAlert('');
    setCodeError('');
    setStepIndex((current) => nextStepIndex(current));
  }

  function goBack() {
    setAlert('');
    setCodeError('');

    if (isFirstStep) {
      router.back();
      return;
    }

    setStepIndex((current) => previousStepIndex(current));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!completed) {
      setAlert('Finalize sua escolha de plano para continuar.');
      return;
    }

    const finalPlanData = {
      ...draft,
      selectedPlanLabel: selectedPlan.label,
      billingCycleLabel: draft.billingCycle === 'annual' ? 'Anual' : 'Mensal',
      paymentStatus: 'not_started',
      paymentRequiredLater: draft.selectedPlan !== 'free',
      couponValidationStatus: draft.hasCode && draft.code ? 'pending' : 'not_used',
      completedAt: new Date().toISOString(),
    };

    updateField('plan', draft.selectedPlan);
    updateField('planData', finalPlanData);

    router.push('/onboarding/finish');
  }

  function renderCurrentStep() {
    switch (currentStep.key) {
      case 'start':
        return (
          <PlanStartQuestion
            billingCycle={draft.billingCycle}
            planIntent={draft.planIntent}
            onChooseFree={chooseFreeNow}
            onChooseCycle={chooseCycle}
          />
        );

      case 'plan':
        return (
          <PlanChoiceGrid
            value={draft.selectedPlan}
            billingCycle={draft.billingCycle}
            options={planOptions}
            onChange={(value) => updateDraft('selectedPlan', value)}
          />
        );

      case 'code':
        return (
          <PlanCodeField
            enabled={draft.hasCode}
            code={draft.code}
            error={codeError}
            onEnabledChange={(value) => updateDraft('hasCode', value)}
            onCodeChange={(value) => updateDraft('code', value)}
          />
        );

      case 'demand':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
                <MessageCircle size={17} strokeWidth={1.8} />
              </span>

              <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
                O que você precisa?
              </h2>
            </div>

            <Input
              id="demandNote"
              name="demandNote"
              label="Contexto do plano sob demanda"
              value={draft.demandNote}
              onChange={(event) => updateDraft('demandNote', event.target.value)}
              placeholder="Ex.: uso familiar ampliado, equipe, escola, integrações especiais..."
              helper="Pagamento, contrato e escopo serão tratados depois."
            />
          </div>
        );

      case 'review':
        return (
          <PlanFinalReview
            planLabel={selectedPlan.label}
            billingCycle={draft.billingCycle}
            code={draft.code}
            hasCode={draft.hasCode}
            demandNote={draft.selectedPlan === 'custom' ? draft.demandNote : ''}
          />
        );

      default:
        return null;
    }
  }

  return (
    <OnboardingMinimalStep
      eyebrow="Plano"
      title="Escolha como começar."
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
                Esta etapa salva sua preferência de plano, mas não cobra nada agora.
              </p>
              <p>
                Você pode seguir gratuitamente e decidir depois. Os planos pagos, códigos, checkout e cobrança serão conectados em uma etapa futura.
              </p>
              <p>
                O plano sob demanda registra casos especiais que precisam de escopo, contato ou configuração própria.
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
