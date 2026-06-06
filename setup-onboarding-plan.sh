#!/usr/bin/env bash
set -euo pipefail

mkdir -p src/app/onboarding/plan
mkdir -p src/components/onboarding/plan
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

cat > src/components/onboarding/plan/PlanInfoDrawer.tsx <<'TSX'
'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Info } from 'lucide-react';

type PlanInfoDrawerProps = {
  title: string;
  triggerLabel?: string;
  children: ReactNode;
};

export function PlanInfoDrawer({
  title,
  triggerLabel = 'Detalhes',
  children,
}: PlanInfoDrawerProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setOpen(true);
        }}
        className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#747D79] transition-colors hover:text-[#002c1f] focus:outline-none focus:ring-4 focus:ring-emerald-800/10"
      >
        <Info size={13} strokeWidth={1.8} />
        {triggerLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Fechar detalhes do plano"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-[#0f1512]/24 backdrop-blur-[2px]"
          />

          <aside className="absolute bottom-0 right-0 top-0 flex h-full w-[92vw] max-w-[430px] flex-col border-l border-[#DDE6DA] bg-[#FAF7F2] p-6 shadow-[-24px_0_80px_rgba(0,44,31,0.18)] md:w-full md:p-7">
            <div className="mb-6 flex items-start justify-between gap-5 border-b border-[#DDE6DA] pb-5">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
                  Plano IRIS
                </p>

                <h2 className="mt-2 font-display text-3xl leading-tight tracking-[-0.035em] text-[#002c1f]">
                  {title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#DDE6DA] bg-white text-[#002c1f] transition-all hover:bg-emerald-800/10 focus:outline-none focus:ring-4 focus:ring-emerald-800/10"
                aria-label="Fechar drawer"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto text-sm leading-7 text-[#476153]">
              {children}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
TSX

cat > src/components/onboarding/plan/PlanCycleQuestion.tsx <<'TSX'
'use client';

import { CalendarDays, RefreshCcw } from 'lucide-react';
import { PlanInfoDrawer } from './PlanInfoDrawer';

type PlanCycleQuestionProps = {
  value: string;
  onChange: (value: string) => void;
};

export function PlanCycleQuestion({ value, onChange }: PlanCycleQuestionProps) {
  const options = [
    {
      value: 'monthly',
      label: 'Mensal',
      description: 'Mais flexível para começar.',
      icon: RefreshCcw,
    },
    {
      value: 'annual',
      label: 'Anual',
      description: 'Melhor para quem quer continuidade.',
      icon: CalendarDays,
    },
  ];

  return (
    <fieldset className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <legend className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
          Como prefere organizar o plano?
        </legend>

        <PlanInfoDrawer title="Planos anuais">
          <p>
            O plano anual serve para quem quer usar a IRIS como espaço contínuo, com menos interrupção e melhor previsibilidade.
          </p>
          <p>
            O pagamento, desconto final, emissão, cancelamento e cobrança ainda serão implementados depois. Nesta etapa, salvamos apenas sua preferência.
          </p>
          <p>
            O plano mensal continua sendo a opção mais flexível para começar sem compromisso longo.
          </p>
        </PlanInfoDrawer>
      </div>

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
                <Icon
                  size={17}
                  strokeWidth={1.8}
                  className={selected ? 'mt-0.5 text-white' : 'mt-0.5 text-[#002c1f]'}
                />

                <span>
                  <span className="block text-sm font-semibold">
                    {option.label}
                  </span>

                  <span
                    className={[
                      'mt-1 block text-xs leading-5',
                      selected ? 'text-white/78' : 'text-[#747D79]',
                    ].join(' ')}
                  >
                    {option.description}
                  </span>
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

cat > src/components/onboarding/plan/PlanChoiceGrid.tsx <<'TSX'
'use client';

import type { LucideIcon } from 'lucide-react';
import { PlanInfoDrawer } from './PlanInfoDrawer';

export type PlanOption = {
  value: string;
  label: string;
  eyebrow: string;
  description: string;
  monthlyPrice: string;
  annualPrice: string;
  icon: LucideIcon;
  drawerTitle: string;
  drawer: string[];
  highlights: string[];
};

type PlanChoiceGridProps = {
  value: string;
  billingCycle: string;
  options: PlanOption[];
  onChange: (value: string) => void;
};

export function PlanChoiceGrid({
  value,
  billingCycle,
  options,
  onChange,
}: PlanChoiceGridProps) {
  return (
    <fieldset className="space-y-6">
      <legend className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
        Escolha seu plano.
      </legend>

      <div className="grid gap-3">
        {options.map((option) => {
          const selected = value === option.value;
          const Icon = option.icon;
          const price = billingCycle === 'annual' ? option.annualPrice : option.monthlyPrice;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={selected}
              className={[
                'rounded-[24px] border px-5 py-4 text-left transition-all duration-200',
                selected
                  ? 'border-emerald-800 bg-emerald-800 text-white shadow-[0_14px_30px_rgba(0,44,31,0.18)]'
                  : 'border-white/70 bg-white/[0.28] text-[#002c1f] hover:border-emerald-800/20 hover:bg-emerald-800/[0.065]',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 gap-3">
                  <span
                    className={[
                      'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border',
                      selected
                        ? 'border-white/18 bg-white/12 text-white'
                        : 'border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]',
                    ].join(' ')}
                  >
                    <Icon size={17} strokeWidth={1.8} />
                  </span>

                  <span>
                    <span
                      className={[
                        'block text-[0.64rem] font-semibold uppercase tracking-[0.18em]',
                        selected ? 'text-white/70' : 'text-[#747D79]',
                      ].join(' ')}
                    >
                      {option.eyebrow}
                    </span>

                    <span className="mt-1 block text-base font-semibold">
                      {option.label}
                    </span>

                    <span
                      className={[
                        'mt-1 block text-xs leading-5',
                        selected ? 'text-white/78' : 'text-[#747D79]',
                      ].join(' ')}
                    >
                      {option.description}
                    </span>
                  </span>
                </div>

                <span className="shrink-0 text-right">
                  <span className="block font-display text-2xl leading-none tracking-[-0.035em]">
                    {price}
                  </span>

                  <span
                    className={[
                      'mt-1 block text-[0.64rem] font-semibold uppercase tracking-[0.14em]',
                      selected ? 'text-white/64' : 'text-[#747D79]',
                    ].join(' ')}
                  >
                    {billingCycle === 'annual' ? 'anual' : 'mensal'}
                  </span>
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {option.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className={[
                      'rounded-full border px-3 py-1 text-[0.68rem] font-semibold',
                      selected
                        ? 'border-white/18 bg-white/12 text-white/84'
                        : 'border-white/70 bg-white/[0.28] text-[#002c1f]',
                    ].join(' ')}
                  >
                    {highlight}
                  </span>
                ))}

                <span className={selected ? 'text-white/78' : ''}>
                  <PlanInfoDrawer title={option.drawerTitle}>
                    {option.drawer.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </PlanInfoDrawer>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
TSX

cat > src/components/onboarding/plan/PlanCodeField.tsx <<'TSX'
'use client';

import { useState } from 'react';
import { TicketPercent } from 'lucide-react';
import { Input } from '@/components/ui/Input';

type PlanCodeFieldProps = {
  enabled: boolean;
  code: string;
  error?: string;
  onEnabledChange: (value: boolean) => void;
  onCodeChange: (value: string) => void;
};

export function PlanCodeField({
  enabled,
  code,
  error,
  onEnabledChange,
  onCodeChange,
}: PlanCodeFieldProps) {
  const [localOpen, setLocalOpen] = useState(enabled);

  function toggle() {
    const next = !localOpen;
    setLocalOpen(next);
    onEnabledChange(next);

    if (!next) {
      onCodeChange('');
    }
  }

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={localOpen}
        className="group flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
            <TicketPercent size={17} strokeWidth={1.8} />
          </span>

          <span>
            <span className="block font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
              Tenho código.
            </span>

            <span className="mt-1 block text-sm leading-6 text-[#747D79]">
              Cupom, convite, benefício interno ou código de acesso.
            </span>
          </span>
        </span>

        <span
          className={[
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-lg leading-none transition-all',
            localOpen
              ? 'rotate-45 border-emerald-800/20 bg-emerald-800/10 text-[#002c1f]'
              : 'border-[#DDE6DA] bg-white/40 text-[#002c1f] group-hover:bg-emerald-800/10',
          ].join(' ')}
          aria-hidden="true"
        >
          +
        </span>
      </button>

      {localOpen && (
        <Input
          id="planCode"
          name="planCode"
          label="Código"
          value={code}
          onChange={(event) => onCodeChange(event.target.value.toUpperCase().replace(/\s+/g, ''))}
          placeholder="IRIS2026"
          autoComplete="off"
          error={error}
          helper="A validação real do código será conectada depois ao billing."
        />
      )}
    </div>
  );
}
TSX

cat > src/components/onboarding/plan/PlanFinalReview.tsx <<'TSX'
import { CheckCircle2 } from 'lucide-react';

type PlanFinalReviewProps = {
  planLabel: string;
  billingCycle: string;
  code: string;
  hasCode: boolean;
  demandNote: string;
};

export function PlanFinalReview({
  planLabel,
  billingCycle,
  code,
  hasCode,
  demandNote,
}: PlanFinalReviewProps) {
  const cycleLabel = billingCycle === 'annual' ? 'Anual' : 'Mensal';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
          <CheckCircle2 size={17} strokeWidth={1.8} />
        </span>

        <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
          Plano selecionado.
        </h2>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-white/70 bg-white/[0.30] px-3 py-1.5 text-xs font-semibold text-[#002c1f]">
          {planLabel}
        </span>

        <span className="rounded-full border border-white/70 bg-white/[0.30] px-3 py-1.5 text-xs font-semibold text-[#002c1f]">
          {cycleLabel}
        </span>

        {hasCode && code && (
          <span className="rounded-full border border-white/70 bg-white/[0.30] px-3 py-1.5 text-xs font-semibold text-[#002c1f]">
            Código: {code}
          </span>
        )}
      </div>

      {demandNote && (
        <div className="rounded-[22px] border border-white/70 bg-white/[0.26] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Sob demanda
          </p>

          <p className="mt-2 text-sm leading-6 text-[#476153]">
            {demandNote}
          </p>
        </div>
      )}

      <div className="rounded-[24px] border border-white/70 bg-white/[0.30] p-5">
        <p className="text-sm leading-6 text-[#476153]">
          O pagamento ainda não será processado nesta etapa. A IRIS salva sua escolha para ativação futura do billing.
        </p>
      </div>
    </div>
  );
}
TSX

cat > src/app/onboarding/plan/page.tsx <<'TSX'
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
import { PlanCycleQuestion } from '@/components/onboarding/plan/PlanCycleQuestion';
import { PlanFinalReview } from '@/components/onboarding/plan/PlanFinalReview';

type PlanStepKey = 'cycle' | 'plan' | 'code' | 'demand' | 'review';

type PlanDraft = {
  billingCycle: string;
  selectedPlan: string;
  hasCode: boolean;
  code: string;
  demandNote: string;
};

const steps: Array<{ key: PlanStepKey; shortLabel: string }> = [
  { key: 'cycle', shortLabel: 'Ciclo' },
  { key: 'plan', shortLabel: 'Plano' },
  { key: 'code', shortLabel: 'Código' },
  { key: 'demand', shortLabel: 'Sob demanda' },
  { key: 'review', shortLabel: 'Revisão' },
];

const planOptions: PlanOption[] = [
  {
    value: 'free',
    label: 'IRIS Free',
    eyebrow: 'Começar',
    description: 'Para experimentar a base do espaço pessoal.',
    monthlyPrice: 'R$0',
    annualPrice: 'R$0',
    icon: Leaf,
    highlights: ['essencial', 'manual', 'início'],
    drawerTitle: 'IRIS Free',
    drawer: [
      'O Free é a porta de entrada da IRIS. Ele mantém o onboarding, o perfil inicial e recursos essenciais para começar.',
      'É indicado para testar a experiência antes de ativar recursos mais avançados.',
      'Diferença principal: menos automações, menos recursos de IA e menor profundidade em espaços compartilhados.',
    ],
  },
  {
    value: 'plus',
    label: 'IRIS Plus',
    eyebrow: 'Uso pessoal',
    description: 'Para organizar memórias, preferências e rotina com mais profundidade.',
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
  return {
    billingCycle: planData?.billingCycle || 'monthly',
    selectedPlan: planData?.selectedPlan || plan || 'free',
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

  const completed =
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

  function currentStepIsReady() {
    if (currentStep.key === 'cycle') return Boolean(draft.billingCycle);
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

    if (steps[next]?.key === 'demand' && !shouldShowDemandStep) {
      return Math.min(next + 1, steps.length - 1);
    }

    return next;
  }

  function previousStepIndex(current: number) {
    const previous = Math.max(current - 1, 0);

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
      case 'cycle':
        return (
          <PlanCycleQuestion
            value={draft.billingCycle}
            onChange={(value) => updateDraft('billingCycle', value)}
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
                Esta etapa salva sua preferência de plano, ciclo mensal ou anual e código promocional, se houver.
              </p>
              <p>
                Nenhum pagamento será processado agora. Billing, checkout, cupom real, nota e assinatura serão conectados depois.
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
TSX

echo "✅ FE-IRIS-043 aplicado: plan criado com mensal/anual, drawers por plano, código e plano sob demanda."
