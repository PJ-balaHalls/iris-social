'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Eye,
  EyeOff,
  Fingerprint,
  LockKeyhole,
  MapPinOff,
  ShieldCheck,
  UserCheck,
  UsersRound,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { OnboardingBottomActions } from '@/components/onboarding/OnboardingBottomActions';
import { OnboardingFieldLine } from '@/components/onboarding/OnboardingFieldLine';
import { OnboardingMinimalStep } from '@/components/onboarding/OnboardingMinimalStep';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { PrivacyChoiceQuestion } from '@/components/onboarding/privacy/PrivacyChoiceQuestion';
import { PrivacyProtectionGrid } from '@/components/onboarding/privacy/PrivacyProtectionGrid';
import { PrivacyFinalReview } from '@/components/onboarding/privacy/PrivacyFinalReview';

type PrivacyLevel = 'private' | 'friends' | 'public';

type PrivacyDraft = {
  level: PrivacyLevel | '';
  memoryDefault: string;
  aiUse: string;
  protections: string[];
};

type PrivacyStepKey = 'level' | 'memoryDefault' | 'aiUse' | 'protections' | 'review';

const labels: Record<string, string> = {
  private: 'Privado',
  friends: 'Por vínculo',
  public: 'Público controlado',
  locked: 'Sempre privadas',
  selective: 'Perguntar ao salvar',
  circle: 'Vínculos próximos',
  ai_off: 'IA limitada',
  ai_assisted: 'IA assistida',
  ai_personalized: 'IA personalizada',
  confirm_sensitive: 'Confirmar conteúdos sensíveis',
  hide_location: 'Ocultar localização',
  hide_age: 'Ocultar idade',
  review_before_share: 'Revisar antes de compartilhar',
  blur_media: 'Desfocar mídia sensível',
  quiet_mode: 'Modo silencioso',
};

const steps: Array<{ key: PrivacyStepKey; shortLabel: string }> = [
  { key: 'level', shortLabel: 'Perfil' },
  { key: 'memoryDefault', shortLabel: 'Memórias' },
  { key: 'aiUse', shortLabel: 'IA' },
  { key: 'protections', shortLabel: 'Proteções' },
  { key: 'review', shortLabel: 'Revisão' },
];

function createInitialDraft(
  privacyLevel: PrivacyLevel,
  privacyData: any
): PrivacyDraft {
  return {
    level: privacyData?.level || privacyLevel || 'private',
    memoryDefault: privacyData?.memoryDefault || 'selective',
    aiUse: privacyData?.aiUse || 'ai_assisted',
    protections: Array.isArray(privacyData?.protections)
      ? privacyData.protections
      : ['confirm_sensitive', 'review_before_share'],
  };
}

export default function PrivacyPage() {
  const router = useRouter();
  const { privacyLevel, privacyData, updateField } = useOnboardingStore();

  const [draft, setDraft] = useState<PrivacyDraft>(() =>
    createInitialDraft(privacyLevel, privacyData)
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [alert, setAlert] = useState('');

  const currentStep = steps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isReviewStep = currentStep.key === 'review';

  const completed =
    Boolean(draft.level) &&
    Boolean(draft.memoryDefault) &&
    Boolean(draft.aiUse);

  function updateDraft<Key extends keyof PrivacyDraft>(
    key: Key,
    value: PrivacyDraft[Key]
  ) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
    setAlert('');
  }

  function currentStepIsReady() {
    if (currentStep.key === 'level') return Boolean(draft.level);
    if (currentStep.key === 'memoryDefault') return Boolean(draft.memoryDefault);
    if (currentStep.key === 'aiUse') return Boolean(draft.aiUse);
    if (currentStep.key === 'protections') return true;
    return completed;
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

    if (!completed || !draft.level) {
      setAlert('Finalize suas preferências de privacidade para continuar.');
      return;
    }

    const finalPrivacyData = {
      ...draft,
      levelLabel: labels[draft.level] || draft.level,
      memoryDefaultLabel: labels[draft.memoryDefault] || draft.memoryDefault,
      aiUseLabel: labels[draft.aiUse] || draft.aiUse,
      protectionLabels: draft.protections.map((item) => labels[item] || item),
      completedAt: new Date().toISOString(),
    };

    updateField('privacyLevel', draft.level);
    updateField('privacyData', finalPrivacyData);

    router.push('/onboarding/accessibility');
  }

  function renderCurrentStep() {
    switch (currentStep.key) {
      case 'level':
        return (
          <PrivacyChoiceQuestion
            title="Quem pode encontrar seu perfil?"
            value={draft.level}
            onChange={(value) => updateDraft('level', value as PrivacyLevel)}
            options={[
              {
                value: 'private',
                label: 'Privado',
                description: 'Você controla convites, busca e visibilidade.',
                icon: EyeOff,
              },
              {
                value: 'friends',
                label: 'Por vínculo',
                description: 'Pessoas conectadas podem encontrar partes do seu espaço.',
                icon: UsersRound,
              },
              {
                value: 'public',
                label: 'Público controlado',
                description: 'Perfil descobrível, com conteúdo protegido por padrão.',
                icon: Eye,
              },
            ]}
          />
        );

      case 'memoryDefault':
        return (
          <PrivacyChoiceQuestion
            title="Como novas memórias devem nascer?"
            value={draft.memoryDefault}
            onChange={(value) => updateDraft('memoryDefault', value)}
            options={[
              {
                value: 'locked',
                label: 'Sempre privadas',
                description: 'Tudo começa fechado até você alterar.',
                icon: LockKeyhole,
              },
              {
                value: 'selective',
                label: 'Perguntar ao salvar',
                description: 'A IRIS confirma a visibilidade de cada memória.',
                icon: UserCheck,
              },
              {
                value: 'circle',
                label: 'Vínculos próximos',
                description: 'Memórias leves podem ir para pessoas confiáveis.',
                icon: UsersRound,
              },
            ]}
          />
        );

      case 'aiUse':
        return (
          <PrivacyChoiceQuestion
            title="Como a IA pode usar seu contexto?"
            value={draft.aiUse}
            onChange={(value) => updateDraft('aiUse', value)}
            options={[
              {
                value: 'ai_off',
                label: 'IA limitada',
                description: 'Menos personalização, mais controle manual.',
                icon: Bot,
              },
              {
                value: 'ai_assisted',
                label: 'IA assistida',
                description: 'Sugestões com contexto mínimo e aprovação sua.',
                icon: ShieldCheck,
              },
              {
                value: 'ai_personalized',
                label: 'IA personalizada',
                description: 'Mais contexto para recomendações e organização.',
                icon: Fingerprint,
              },
            ]}
          />
        );

      case 'protections':
        return (
          <PrivacyProtectionGrid
            title="Quais proteções extras deseja ativar?"
            value={draft.protections}
            onChange={(value) => updateDraft('protections', value)}
            options={[
              {
                value: 'confirm_sensitive',
                label: 'Confirmar conteúdos sensíveis',
                icon: ShieldCheck,
              },
              {
                value: 'hide_location',
                label: 'Ocultar localização',
                icon: MapPinOff,
              },
              {
                value: 'hide_age',
                label: 'Ocultar idade',
                icon: EyeOff,
              },
              {
                value: 'review_before_share',
                label: 'Revisar antes de compartilhar',
                icon: UserCheck,
              },
              {
                value: 'blur_media',
                label: 'Desfocar mídia sensível',
                icon: EyeOff,
              },
              {
                value: 'quiet_mode',
                label: 'Modo silencioso',
                icon: LockKeyhole,
              },
            ]}
          />
        );

      case 'review':
        return (
          <PrivacyFinalReview
            level={draft.level}
            memoryDefault={draft.memoryDefault}
            aiUse={draft.aiUse}
            protections={draft.protections}
            labels={labels}
          />
        );

      default:
        return null;
    }
  }

  return (
    <OnboardingMinimalStep
      eyebrow="Privacidade"
      title="Defina seus limites."
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
                Esta etapa define as regras iniciais de visibilidade, memória e uso de contexto pela IA.
              </p>
              <p>
                A IRIS parte do princípio de privacidade por padrão. Você pode abrir partes do espaço depois, com controle.
              </p>
              <p>
                Essas escolhas podem ser alteradas nas configurações de privacidade.
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
