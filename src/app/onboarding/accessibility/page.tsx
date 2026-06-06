'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Contrast,
  Eye,
  LetterText,
  Monitor,
  Moon,
  MoveHorizontal,
  Paintbrush,
  Pilcrow,
  Sparkles,
  Sun,
  Type,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { OnboardingBottomActions } from '@/components/onboarding/OnboardingBottomActions';
import { OnboardingFieldLine } from '@/components/onboarding/OnboardingFieldLine';
import { OnboardingMinimalStep } from '@/components/onboarding/OnboardingMinimalStep';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import {
  applyAccessibilityPreferences,
  DEFAULT_ACCESSIBILITY_PREFERENCES,
  type IrisAccessibilityPreferences,
} from '@/lib/accessibility/preferences';
import { AccessibilityChoiceQuestion } from '@/components/onboarding/accessibility/AccessibilityChoiceQuestion';
import { AccessibilityScaleQuestion } from '@/components/onboarding/accessibility/AccessibilityScaleQuestion';
import { AccessibilityPreview } from '@/components/onboarding/accessibility/AccessibilityPreview';
import { AccessibilityFinalReview } from '@/components/onboarding/accessibility/AccessibilityFinalReview';

type AccessibilityStepKey =
  | 'theme'
  | 'font'
  | 'fontScale'
  | 'spacing'
  | 'motion'
  | 'contrast'
  | 'preview'
  | 'review';

const labels: Record<string, string> = {
  system: 'Sistema',
  light: 'Claro',
  dark: 'Escuro',
  sepia: 'Off-white quente',
  default: 'Padrão',
  readable: 'Leitura limpa',
  dyslexia: 'Apoio à dislexia',
  serif: 'Editorial',
  compact: 'Compacto',
  comfortable: 'Confortável',
  spacious: 'Espaçoso',
  full: 'Movimento completo',
  reduced: 'Movimento reduzido',
  high: 'Alto contraste',
};

const steps: Array<{ key: AccessibilityStepKey; shortLabel: string }> = [
  { key: 'theme', shortLabel: 'Tema' },
  { key: 'font', shortLabel: 'Fonte' },
  { key: 'fontScale', shortLabel: 'Tamanho' },
  { key: 'spacing', shortLabel: 'Espaço' },
  { key: 'motion', shortLabel: 'Movimento' },
  { key: 'contrast', shortLabel: 'Contraste' },
  { key: 'preview', shortLabel: 'Preview' },
  { key: 'review', shortLabel: 'Revisão' },
];

function createInitialDraft(accessibilityData: any): IrisAccessibilityPreferences {
  return {
    ...DEFAULT_ACCESSIBILITY_PREFERENCES,
    ...(accessibilityData?.preferences || accessibilityData || {}),
  };
}

export default function AccessibilityPage() {
  const router = useRouter();
  const { accessibilityData, updateField } = useOnboardingStore();

  const [draft, setDraft] = useState<IrisAccessibilityPreferences>(() =>
    createInitialDraft(accessibilityData)
  );
  const [stepIndex, setStepIndex] = useState(0);

  const currentStep = steps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isReviewStep = currentStep.key === 'review';

  useEffect(() => {
    applyAccessibilityPreferences(draft);

    updateField('accessibilityData', {
      preferences: draft,
      liveApplied: true,
      updatedAt: new Date().toISOString(),
    });
  }, [draft, updateField]);

  function updateDraft<Key extends keyof IrisAccessibilityPreferences>(
    key: Key,
    value: IrisAccessibilityPreferences[Key]
  ) {
    setDraft((current) => {
      const next = {
        ...current,
        [key]: value,
      };

      applyAccessibilityPreferences(next);

      return next;
    });
  }

  function goNext() {
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  }

  function goBack() {
    if (isFirstStep) {
      router.back();
      return;
    }

    setStepIndex((current) => Math.max(current - 1, 0));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const finalAccessibilityData = {
      preferences: draft,
      labels: {
        theme: labels[draft.theme],
        font: labels[draft.font],
        spacing: labels[draft.spacing],
        motion: labels[draft.motion],
        contrast: labels[draft.contrast],
      },
      liveApplied: true,
      completedAt: new Date().toISOString(),
    };

    applyAccessibilityPreferences(draft);
    updateField('accessibilityData', finalAccessibilityData);

    router.push('/onboarding/uslife-invite');
  }

  function renderCurrentStep() {
    switch (currentStep.key) {
      case 'theme':
        return (
          <AccessibilityChoiceQuestion
            title="Qual tema fica melhor para você?"
            value={draft.theme}
            onChange={(value) => updateDraft('theme', value as IrisAccessibilityPreferences['theme'])}
            options={[
              {
                value: 'system',
                label: 'Sistema',
                description: 'Segue o tema do dispositivo.',
                icon: Monitor,
              },
              {
                value: 'light',
                label: 'Claro',
                description: 'Base clara e limpa.',
                icon: Sun,
              },
              {
                value: 'dark',
                label: 'Escuro',
                description: 'Menos luz na tela.',
                icon: Moon,
              },
              {
                value: 'sepia',
                label: 'Off-white quente',
                description: 'Tom suave para leitura prolongada.',
                icon: Paintbrush,
              },
            ]}
          />
        );

      case 'font':
        return (
          <AccessibilityChoiceQuestion
            title="Qual fonte prefere?"
            value={draft.font}
            onChange={(value) => updateDraft('font', value as IrisAccessibilityPreferences['font'])}
            options={[
              {
                value: 'default',
                label: 'Padrão IRIS',
                description: 'Mantém a identidade visual original.',
                icon: Type,
              },
              {
                value: 'readable',
                label: 'Leitura limpa',
                description: 'Fonte mais neutra para leitura.',
                icon: LetterText,
              },
              {
                value: 'dyslexia',
                label: 'Apoio à dislexia',
                description: 'Mais espaçamento e formas simples.',
                icon: Eye,
              },
              {
                value: 'serif',
                label: 'Editorial',
                description: 'Mais literária e clássica.',
                icon: Pilcrow,
              },
            ]}
          />
        );

      case 'fontScale':
        return (
          <AccessibilityScaleQuestion
            icon={Type}
            title="Qual tamanho de texto?"
            minLabel="Menor"
            maxLabel="Maior"
            value={draft.fontScale}
            onChange={(value) => updateDraft('fontScale', value)}
          />
        );

      case 'spacing':
        return (
          <AccessibilityChoiceQuestion
            title="Qual espaçamento ajuda mais?"
            value={draft.spacing}
            onChange={(value) => updateDraft('spacing', value as IrisAccessibilityPreferences['spacing'])}
            options={[
              {
                value: 'compact',
                label: 'Compacto',
                description: 'Mais conteúdo por tela.',
                icon: MoveHorizontal,
              },
              {
                value: 'default',
                label: 'Padrão',
                description: 'Equilíbrio visual da IRIS.',
                icon: MoveHorizontal,
              },
              {
                value: 'comfortable',
                label: 'Confortável',
                description: 'Mais respiro entre linhas.',
                icon: MoveHorizontal,
              },
              {
                value: 'spacious',
                label: 'Espaçoso',
                description: 'Mais distância para leitura calma.',
                icon: MoveHorizontal,
              },
            ]}
          />
        );

      case 'motion':
        return (
          <AccessibilityChoiceQuestion
            title="Como prefere os movimentos?"
            value={draft.motion}
            onChange={(value) => updateDraft('motion', value as IrisAccessibilityPreferences['motion'])}
            options={[
              {
                value: 'full',
                label: 'Movimento completo',
                description: 'Animações suaves da interface.',
                icon: Sparkles,
              },
              {
                value: 'reduced',
                label: 'Movimento reduzido',
                description: 'Reduz transições e animações.',
                icon: MoveHorizontal,
              },
            ]}
          />
        );

      case 'contrast':
        return (
          <AccessibilityChoiceQuestion
            title="Qual contraste prefere?"
            value={draft.contrast}
            onChange={(value) => updateDraft('contrast', value as IrisAccessibilityPreferences['contrast'])}
            options={[
              {
                value: 'default',
                label: 'Padrão',
                description: 'Contraste visual da marca.',
                icon: Contrast,
              },
              {
                value: 'high',
                label: 'Alto contraste',
                description: 'Mais definição entre texto e fundo.',
                icon: Eye,
              },
            ]}
          />
        );

      case 'preview':
        return <AccessibilityPreview preferences={draft} />;

      case 'review':
        return <AccessibilityFinalReview preferences={draft} labels={labels} />;

      default:
        return null;
    }
  }

  return (
    <OnboardingMinimalStep
      eyebrow="Acessibilidade"
      title="Ajuste para você."
    >
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl">
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
                Esta etapa ajusta tema, fonte, tamanho, espaçamento, contraste e movimento.
              </p>
              <p>
                As mudanças são aplicadas em tempo real e já ficam salvas como preferência oficial.
              </p>
              <p>
                Você poderá alterar tudo depois nas configurações de acessibilidade.
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
                className="min-h-12 rounded-[18px] px-8"
              >
                Continuar
              </Button>
            ) : (
              <Button
                type="button"
                variant="auth"
                size="lg"
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
