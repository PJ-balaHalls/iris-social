'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Camera,
  Clapperboard,
  Gamepad2,
  HeartHandshake,
  Leaf,
  Music2,
  Palette,
  PenLine,
  Sparkles,
  Utensils,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { OnboardingBottomActions } from '@/components/onboarding/OnboardingBottomActions';
import { OnboardingFieldLine } from '@/components/onboarding/OnboardingFieldLine';
import { OnboardingMinimalStep } from '@/components/onboarding/OnboardingMinimalStep';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { CultureTagGrid } from '@/components/onboarding/culture/CultureTagGrid';
import { CultureChoiceQuestion } from '@/components/onboarding/culture/CultureChoiceQuestion';
import { CultureFinalReview } from '@/components/onboarding/culture/CultureFinalReview';

type CultureDraft = {
  tags: string[];
  formats: string[];
  tone: string;
  rhythm: string;
};

type CultureStepKey = 'tags' | 'formats' | 'tone' | 'rhythm' | 'review';

const cultureLabels: Record<string, string> = {
  music: 'Música',
  cinema: 'Cinema',
  literature: 'Literatura',
  photography: 'Fotografia',
  art: 'Arte',
  tech: 'Tecnologia',
  nature: 'Natureza',
  games: 'Games',
  gastronomy: 'Gastronomia',
  spirituality: 'Espiritualidade',
  letters: 'Cartas',
  albums: 'Álbuns',
  lists: 'Listas',
  timeline: 'Linha do tempo',
  map: 'Mapa afetivo',
  journal: 'Diário',
  minimal: 'Minimalista',
  poetic: 'Poético',
  direct: 'Direto',
  warm: 'Acolhedor',
  calm: 'Calmo',
  intense: 'Intenso',
};

const steps: Array<{ key: CultureStepKey; shortLabel: string }> = [
  { key: 'tags', shortLabel: 'Temas' },
  { key: 'formats', shortLabel: 'Formatos' },
  { key: 'tone', shortLabel: 'Tom' },
  { key: 'rhythm', shortLabel: 'Ritmo' },
  { key: 'review', shortLabel: 'Revisão' },
];

const cultureTagOptions = [
  { value: 'music', label: 'Música', icon: Music2 },
  { value: 'cinema', label: 'Cinema', icon: Clapperboard },
  { value: 'literature', label: 'Literatura', icon: BookOpen },
  { value: 'photography', label: 'Fotografia', icon: Camera },
  { value: 'art', label: 'Arte', icon: Palette },
  { value: 'tech', label: 'Tecnologia', icon: Sparkles },
  { value: 'nature', label: 'Natureza', icon: Leaf },
  { value: 'games', label: 'Games', icon: Gamepad2 },
  { value: 'gastronomy', label: 'Gastronomia', icon: Utensils },
  { value: 'spirituality', label: 'Espiritualidade', icon: HeartHandshake },
];

const formatOptions = [
  { value: 'letters', label: 'Cartas' },
  { value: 'albums', label: 'Álbuns' },
  { value: 'lists', label: 'Listas' },
  { value: 'timeline', label: 'Linha do tempo' },
  { value: 'map', label: 'Mapa afetivo' },
  { value: 'journal', label: 'Diário' },
];

function createInitialDraft(cultureTags: string[], cultureData: any): CultureDraft {
  return {
    tags: Array.isArray(cultureData?.tags)
      ? cultureData.tags
      : Array.isArray(cultureTags)
        ? cultureTags
        : [],
    formats: Array.isArray(cultureData?.formats) ? cultureData.formats : [],
    tone: cultureData?.tone || '',
    rhythm: cultureData?.rhythm || '',
  };
}

export default function CulturePage() {
  const router = useRouter();
  const { cultureTags, cultureData, updateField } = useOnboardingStore();

  const [draft, setDraft] = useState<CultureDraft>(() =>
    createInitialDraft(cultureTags, cultureData)
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [alert, setAlert] = useState('');

  const currentStep = steps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isReviewStep = currentStep.key === 'review';

  const completed =
    draft.tags.length >= 3 &&
    draft.formats.length >= 2 &&
    Boolean(draft.tone) &&
    Boolean(draft.rhythm);

  const selectedLabels = useMemo(
    () => [
      ...draft.tags.map((tag) => cultureLabels[tag] || tag),
      ...draft.formats.map((format) => cultureLabels[format] || format),
    ],
    [draft.formats, draft.tags]
  );

  function updateDraft<Key extends keyof CultureDraft>(key: Key, value: CultureDraft[Key]) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
    setAlert('');
  }

  function currentStepIsReady() {
    if (currentStep.key === 'tags') return draft.tags.length >= 3;
    if (currentStep.key === 'formats') return draft.formats.length >= 2;
    if (currentStep.key === 'tone') return Boolean(draft.tone);
    if (currentStep.key === 'rhythm') return Boolean(draft.rhythm);
    return completed;
  }

  function goNext() {
    if (!currentStepIsReady()) {
      if (currentStep.key === 'tags') {
        setAlert('Escolha pelo menos 3 temas.');
        return;
      }

      if (currentStep.key === 'formats') {
        setAlert('Escolha pelo menos 2 formatos.');
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
      setAlert('Finalize as escolhas principais para continuar.');
      return;
    }

    const finalCultureData = {
      ...draft,
      selectedLabels,
      completedAt: new Date().toISOString(),
    };

    updateField('cultureTags', draft.tags);
    updateField('cultureData', finalCultureData);

    router.push('/onboarding/integrations');
  }

  function renderCurrentStep() {
    switch (currentStep.key) {
      case 'tags':
        return (
          <CultureTagGrid
            title="Quais temas fazem parte do seu repertório?"
            value={draft.tags}
            minSelected={3}
            options={cultureTagOptions}
            onChange={(value) => updateDraft('tags', value)}
          />
        );

      case 'formats':
        return (
          <CultureTagGrid
            title="Como você gosta de organizar memórias?"
            value={draft.formats}
            minSelected={2}
            options={formatOptions}
            onChange={(value) => updateDraft('formats', value)}
          />
        );

      case 'tone':
        return (
          <CultureChoiceQuestion
            icon={PenLine}
            title="Qual tom combina mais com você?"
            value={draft.tone}
            onChange={(value) => updateDraft('tone', value)}
            options={[
              { value: 'minimal', label: 'Minimalista' },
              { value: 'poetic', label: 'Poético' },
              { value: 'direct', label: 'Direto' },
              { value: 'warm', label: 'Acolhedor' },
            ]}
          />
        );

      case 'rhythm':
        return (
          <CultureChoiceQuestion
            icon={Sparkles}
            title="Qual ritmo você prefere?"
            value={draft.rhythm}
            onChange={(value) => updateDraft('rhythm', value)}
            options={[
              { value: 'calm', label: 'Calmo' },
              { value: 'intense', label: 'Intenso' },
            ]}
          />
        );

      case 'review':
        return (
          <CultureFinalReview
            tags={draft.tags}
            formats={draft.formats}
            tone={draft.tone}
            rhythm={draft.rhythm}
            labels={cultureLabels}
          />
        );

      default:
        return null;
    }
  }

  return (
    <OnboardingMinimalStep
      eyebrow="Cultura"
      title="Do que seu mundo é feito?"
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
                Esta etapa entende seu repertório cultural inicial: temas, formatos e tom de experiência.
              </p>
              <p>
                A IRIS usa isso para organizar memórias, cartas, recomendações e espaços visuais com mais coerência.
              </p>
              <p>
                Você poderá ajustar tudo depois.
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
