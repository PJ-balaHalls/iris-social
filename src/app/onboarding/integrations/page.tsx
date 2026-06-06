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
