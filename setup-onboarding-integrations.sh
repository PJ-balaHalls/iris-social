#!/usr/bin/env bash
set -euo pipefail

mkdir -p src/app/onboarding/integrations
mkdir -p src/components/onboarding/integrations
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

cat > src/components/onboarding/integrations/IntegrationOptionGrid.tsx <<'TSX'
'use client';

import type { LucideIcon } from 'lucide-react';

type IntegrationOption = {
  value: string;
  label: string;
  icon: LucideIcon;
};

type IntegrationOptionGridProps = {
  title: string;
  value: string[];
  options: IntegrationOption[];
  onChange: (value: string[]) => void;
};

export function IntegrationOptionGrid({
  title,
  value,
  options,
  onChange,
}: IntegrationOptionGridProps) {
  function toggle(optionValue: string) {
    if (value.includes(optionValue)) {
      onChange(value.filter((item) => item !== optionValue));
      return;
    }

    onChange([...value, optionValue]);
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
              onClick={() => toggle(option.value)}
              aria-pressed={selected}
              className={[
                'flex min-h-14 items-center gap-3 rounded-[20px] border px-4 text-left text-sm font-semibold transition-all duration-200',
                selected
                  ? 'border-emerald-800 bg-emerald-800 text-white shadow-[0_10px_24px_rgba(0,44,31,0.18)]'
                  : 'border-white/70 bg-white/[0.28] text-[#002c1f] hover:border-emerald-800/20 hover:bg-emerald-800/[0.065]',
              ].join(' ')}
            >
              <Icon size={17} strokeWidth={1.8} />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
TSX

cat > src/components/onboarding/integrations/IntegrationChoiceQuestion.tsx <<'TSX'
'use client';

import type { LucideIcon } from 'lucide-react';

type IntegrationChoiceOption = {
  value: string;
  label: string;
};

type IntegrationChoiceQuestionProps = {
  title: string;
  value: string;
  options: IntegrationChoiceOption[];
  icon?: LucideIcon;
  onChange: (value: string) => void;
};

export function IntegrationChoiceQuestion({
  title,
  value,
  options,
  icon: Icon,
  onChange,
}: IntegrationChoiceQuestionProps) {
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

cat > src/components/onboarding/integrations/IntegrationFinalReview.tsx <<'TSX'
import { CheckCircle2 } from 'lucide-react';

type IntegrationFinalReviewProps = {
  selected: string[];
  accessMode: string;
  syncMode: string;
  labels: Record<string, string>;
};

export function IntegrationFinalReview({
  selected,
  accessMode,
  syncMode,
  labels,
}: IntegrationFinalReviewProps) {
  const items = [
    ...selected.map((item) => labels[item] || item),
    labels[accessMode] || accessMode,
    labels[syncMode] || syncMode,
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
          <CheckCircle2 size={17} strokeWidth={1.8} />
        </span>

        <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
          Integrações preparadas.
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
            Fontes
          </p>

          <p className="mt-2 font-display text-3xl text-[#002c1f]">
            {selected.length}
          </p>
        </div>

        <div className="rounded-[22px] border border-white/70 bg-white/[0.26] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Acesso
          </p>

          <p className="mt-2 font-display text-2xl text-[#002c1f]">
            {labels[accessMode] || '—'}
          </p>
        </div>

        <div className="rounded-[22px] border border-white/70 bg-white/[0.26] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Sincronia
          </p>

          <p className="mt-2 font-display text-2xl text-[#002c1f]">
            {labels[syncMode] || '—'}
          </p>
        </div>
      </div>
    </div>
  );
}
TSX

cat > src/app/onboarding/integrations/page.tsx <<'TSX'
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CalendarDays,
  Cloud,
  Image,
  Mail,
  MapPin,
  Music2,
  ShieldCheck,
  Smartphone,
  UsersRound,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { OnboardingBottomActions } from '@/components/onboarding/OnboardingBottomActions';
import { OnboardingFieldLine } from '@/components/onboarding/OnboardingFieldLine';
import { OnboardingMinimalStep } from '@/components/onboarding/OnboardingMinimalStep';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { IntegrationOptionGrid } from '@/components/onboarding/integrations/IntegrationOptionGrid';
import { IntegrationChoiceQuestion } from '@/components/onboarding/integrations/IntegrationChoiceQuestion';
import { IntegrationFinalReview } from '@/components/onboarding/integrations/IntegrationFinalReview';

type IntegrationsDraft = {
  selected: string[];
  accessMode: string;
  syncMode: string;
};

type IntegrationStepKey = 'sources' | 'access' | 'sync' | 'review';

const labels: Record<string, string> = {
  calendar: 'Calendário',
  photos: 'Fotos',
  contacts: 'Contatos',
  location: 'Lugares',
  notifications: 'Notificações',
  email: 'E-mail',
  music: 'Música',
  cloud: 'Arquivos',
  manual: 'Manual',
  assisted: 'Assistido',
  connected: 'Conectado',
  ask_first: 'Perguntar antes',
  weekly: 'Semanal',
  automatic: 'Automático',
};

const steps: Array<{ key: IntegrationStepKey; shortLabel: string }> = [
  { key: 'sources', shortLabel: 'Fontes' },
  { key: 'access', shortLabel: 'Acesso' },
  { key: 'sync', shortLabel: 'Sincronia' },
  { key: 'review', shortLabel: 'Revisão' },
];

const integrationOptions = [
  { value: 'calendar', label: 'Calendário', icon: CalendarDays },
  { value: 'photos', label: 'Fotos', icon: Image },
  { value: 'contacts', label: 'Contatos', icon: UsersRound },
  { value: 'location', label: 'Lugares', icon: MapPin },
  { value: 'notifications', label: 'Notificações', icon: Bell },
  { value: 'email', label: 'E-mail', icon: Mail },
  { value: 'music', label: 'Música', icon: Music2 },
  { value: 'cloud', label: 'Arquivos', icon: Cloud },
];

function createInitialDraft(integrationPreferences: string[], integrationData: any): IntegrationsDraft {
  return {
    selected: Array.isArray(integrationData?.selected)
      ? integrationData.selected
      : Array.isArray(integrationPreferences)
        ? integrationPreferences
        : [],
    accessMode: integrationData?.accessMode || 'ask_first',
    syncMode: integrationData?.syncMode || 'manual',
  };
}

export default function IntegrationsPage() {
  const router = useRouter();
  const { integrationPreferences, integrationData, updateField } = useOnboardingStore();

  const [draft, setDraft] = useState<IntegrationsDraft>(() =>
    createInitialDraft(integrationPreferences, integrationData)
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [alert, setAlert] = useState('');

  const currentStep = steps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isReviewStep = currentStep.key === 'review';

  const completed =
    draft.selected.length > 0 &&
    Boolean(draft.accessMode) &&
    Boolean(draft.syncMode);

  function updateDraft<Key extends keyof IntegrationsDraft>(
    key: Key,
    value: IntegrationsDraft[Key]
  ) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
    setAlert('');
  }

  function currentStepIsReady() {
    if (currentStep.key === 'sources') return draft.selected.length > 0;
    if (currentStep.key === 'access') return Boolean(draft.accessMode);
    if (currentStep.key === 'sync') return Boolean(draft.syncMode);
    return completed;
  }

  function goNext() {
    if (!currentStepIsReady()) {
      if (currentStep.key === 'sources') {
        setAlert('Escolha pelo menos uma fonte ou integração.');
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
      setAlert('Finalize as preferências de integração para continuar.');
      return;
    }

    const finalIntegrationData = {
      ...draft,
      selectedLabels: draft.selected.map((item) => labels[item] || item),
      completedAt: new Date().toISOString(),
      oauthConnected: false,
    };

    updateField('integrationPreferences', draft.selected);
    updateField('integrationData', finalIntegrationData);

    router.push('/onboarding/intention');
  }

  function renderCurrentStep() {
    switch (currentStep.key) {
      case 'sources':
        return (
          <IntegrationOptionGrid
            title="O que a IRIS pode preparar para conectar?"
            value={draft.selected}
            options={integrationOptions}
            onChange={(value) => updateDraft('selected', value)}
          />
        );

      case 'access':
        return (
          <IntegrationChoiceQuestion
            icon={ShieldCheck}
            title="Como prefere controlar o acesso?"
            value={draft.accessMode}
            onChange={(value) => updateDraft('accessMode', value)}
            options={[
              { value: 'ask_first', label: 'Sempre perguntar antes' },
              { value: 'assisted', label: 'Sugerir, mas eu aprovo' },
              { value: 'connected', label: 'Conectar quando eu ativar' },
            ]}
          />
        );

      case 'sync':
        return (
          <IntegrationChoiceQuestion
            icon={Smartphone}
            title="Qual ritmo de sincronia combina?"
            value={draft.syncMode}
            onChange={(value) => updateDraft('syncMode', value)}
            options={[
              { value: 'manual', label: 'Manual' },
              { value: 'weekly', label: 'Semanal' },
              { value: 'automatic', label: 'Automático' },
            ]}
          />
        );

      case 'review':
        return (
          <IntegrationFinalReview
            selected={draft.selected}
            accessMode={draft.accessMode}
            syncMode={draft.syncMode}
            labels={labels}
          />
        );

      default:
        return null;
    }
  }

  return (
    <OnboardingMinimalStep
      eyebrow="Integrações"
      title="Conecte só o necessário."
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
                Esta etapa não conecta contas automaticamente. Ela salva quais integrações a IRIS deve preparar para você ativar depois.
              </p>
              <p>
                A ideia é manter controle: você escolhe fontes, nível de permissão e ritmo de sincronia.
              </p>
              <p>
                Conexões reais com Google, fotos, e-mail ou outros serviços devem passar por autorização explícita.
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

echo "✅ FE-IRIS-037 aplicado: integrations criado com seleção por etapas, controle de acesso e revisão."
