#!/usr/bin/env bash
set -euo pipefail

mkdir -p src/app/onboarding/accessibility
mkdir -p src/components/onboarding/accessibility
mkdir -p src/components/accessibility
mkdir -p src/lib/accessibility
mkdir -p src/lib/store

cat > src/lib/accessibility/preferences.ts <<'TS'
export type IrisThemePreference = 'system' | 'light' | 'dark' | 'sepia';
export type IrisFontPreference = 'default' | 'readable' | 'dyslexia' | 'serif';
export type IrisSpacingPreference = 'compact' | 'default' | 'comfortable' | 'spacious';
export type IrisMotionPreference = 'full' | 'reduced';
export type IrisContrastPreference = 'default' | 'high';

export type IrisAccessibilityPreferences = {
  theme: IrisThemePreference;
  font: IrisFontPreference;
  fontScale: number;
  spacing: IrisSpacingPreference;
  motion: IrisMotionPreference;
  contrast: IrisContrastPreference;
};

export const IRIS_ACCESSIBILITY_STORAGE_KEY = 'iris-accessibility-preferences';

export const DEFAULT_ACCESSIBILITY_PREFERENCES: IrisAccessibilityPreferences = {
  theme: 'system',
  font: 'default',
  fontScale: 100,
  spacing: 'default',
  motion: 'full',
  contrast: 'default',
};

const fontFamilies: Record<IrisFontPreference, string> = {
  default: 'inherit',
  readable:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  dyslexia:
    'Arial, Verdana, Tahoma, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  serif:
    'Georgia, "Times New Roman", ui-serif, serif',
};

const spacingTokens: Record<
  IrisSpacingPreference,
  {
    lineHeight: string;
    letterSpacing: string;
    wordSpacing: string;
  }
> = {
  compact: {
    lineHeight: '1.42',
    letterSpacing: '0em',
    wordSpacing: '0em',
  },
  default: {
    lineHeight: '1.58',
    letterSpacing: '0em',
    wordSpacing: '0em',
  },
  comfortable: {
    lineHeight: '1.74',
    letterSpacing: '0.01em',
    wordSpacing: '0.04em',
  },
  spacious: {
    lineHeight: '1.9',
    letterSpacing: '0.025em',
    wordSpacing: '0.08em',
  },
};

function normalizePreferences(
  preferences?: Partial<IrisAccessibilityPreferences>
): IrisAccessibilityPreferences {
  return {
    ...DEFAULT_ACCESSIBILITY_PREFERENCES,
    ...(preferences || {}),
  };
}

function ensureRuntimeStyle() {
  if (typeof document === 'undefined') return;

  const existing = document.getElementById('iris-accessibility-runtime-style');

  if (existing) return;

  const style = document.createElement('style');
  style.id = 'iris-accessibility-runtime-style';
  style.innerHTML = `
    html {
      --iris-accessibility-font-scale: 1;
      --iris-accessibility-line-height: 1.58;
      --iris-accessibility-letter-spacing: 0em;
      --iris-accessibility-word-spacing: 0em;
      --iris-accessibility-font-family: inherit;
    }

    body {
      font-family: var(--iris-accessibility-font-family);
      font-size: calc(16px * var(--iris-accessibility-font-scale));
      line-height: var(--iris-accessibility-line-height);
      letter-spacing: var(--iris-accessibility-letter-spacing);
      word-spacing: var(--iris-accessibility-word-spacing);
    }

    html[data-iris-theme='light'] body {
      color-scheme: light;
      background-color: #FAF7F2;
      color: #002c1f;
    }

    html[data-iris-theme='dark'] body {
      color-scheme: dark;
      background-color: #0d1411 !important;
      color: #F8F4EA;
    }

    html[data-iris-theme='sepia'] body {
      color-scheme: light;
      background-color: #F8F0DE !important;
      color: #2A2118;
    }

    html[data-iris-contrast='high'] body {
      --color-text-primary: #001810;
      --color-text-muted: #33443c;
    }

    html[data-iris-contrast='high'] a,
    html[data-iris-contrast='high'] button,
    html[data-iris-contrast='high'] input,
    html[data-iris-contrast='high'] textarea,
    html[data-iris-contrast='high'] select {
      outline-offset: 3px;
    }

    html[data-iris-motion='reduced'] *,
    html[data-iris-motion='reduced'] *::before,
    html[data-iris-motion='reduced'] *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      scroll-behavior: auto !important;
      transition-duration: 0.001ms !important;
    }

    html[data-iris-font='dyslexia'] p,
    html[data-iris-font='dyslexia'] span,
    html[data-iris-font='dyslexia'] label,
    html[data-iris-font='dyslexia'] input,
    html[data-iris-font='dyslexia'] button,
    html[data-iris-font='dyslexia'] textarea {
      letter-spacing: max(var(--iris-accessibility-letter-spacing), 0.025em);
      word-spacing: max(var(--iris-accessibility-word-spacing), 0.08em);
    }
  `;

  document.head.appendChild(style);
}

export function applyAccessibilityPreferences(
  preferences?: Partial<IrisAccessibilityPreferences>
) {
  if (typeof document === 'undefined') return;

  const finalPreferences = normalizePreferences(preferences);
  const root = document.documentElement;
  const spacing = spacingTokens[finalPreferences.spacing];

  ensureRuntimeStyle();

  root.dataset.irisTheme = finalPreferences.theme;
  root.dataset.irisFont = finalPreferences.font;
  root.dataset.irisSpacing = finalPreferences.spacing;
  root.dataset.irisMotion = finalPreferences.motion;
  root.dataset.irisContrast = finalPreferences.contrast;

  root.style.setProperty(
    '--iris-accessibility-font-scale',
    String(finalPreferences.fontScale / 100)
  );
  root.style.setProperty('--iris-accessibility-line-height', spacing.lineHeight);
  root.style.setProperty('--iris-accessibility-letter-spacing', spacing.letterSpacing);
  root.style.setProperty('--iris-accessibility-word-spacing', spacing.wordSpacing);
  root.style.setProperty('--iris-accessibility-font-family', fontFamilies[finalPreferences.font]);

  window.localStorage.setItem(
    IRIS_ACCESSIBILITY_STORAGE_KEY,
    JSON.stringify(finalPreferences)
  );
}

export function readStoredAccessibilityPreferences() {
  if (typeof window === 'undefined') {
    return DEFAULT_ACCESSIBILITY_PREFERENCES;
  }

  try {
    const raw = window.localStorage.getItem(IRIS_ACCESSIBILITY_STORAGE_KEY);

    if (!raw) return DEFAULT_ACCESSIBILITY_PREFERENCES;

    return normalizePreferences(JSON.parse(raw));
  } catch {
    return DEFAULT_ACCESSIBILITY_PREFERENCES;
  }
}
TS

cat > src/components/accessibility/AccessibilityRuntime.tsx <<'TSX'
'use client';

import { useEffect } from 'react';
import {
  applyAccessibilityPreferences,
  readStoredAccessibilityPreferences,
} from '@/lib/accessibility/preferences';

export function AccessibilityRuntime() {
  useEffect(() => {
    applyAccessibilityPreferences(readStoredAccessibilityPreferences());

    function handleStorage(event: StorageEvent) {
      if (event.key === 'iris-accessibility-preferences') {
        applyAccessibilityPreferences(readStoredAccessibilityPreferences());
      }
    }

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return null;
}
TSX

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
  intentionData: any;
  privacyLevel: 'private' | 'friends' | 'public';
  privacyData: any;
  accessibilityData: any;
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
  intentionData: {},
  privacyLevel: 'private' as const,
  privacyData: {},
  accessibilityData: {},
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

cat > src/app/onboarding/layout.tsx <<'TSX'
import type { ReactNode } from 'react';
import { AccessibilityRuntime } from '@/components/accessibility/AccessibilityRuntime';
import { EmotionalProgressBar } from '@/components/onboarding/EmotionalProgressBar';
import { OnboardingContentFrame } from '@/components/onboarding/OnboardingContentFrame';
import { OnboardingBotanicalBackground } from '@/components/onboarding/OnboardingBotanicalBackground';

const LOGO_PATH = '/iris/brand/logotipo/svg/iris-logotipo-colorido.svg';

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#FAF7F2] font-sans text-[#002c1f]">
      <AccessibilityRuntime />

      <style>
        {`
          @keyframes iris-onboarding-bg {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.012); }
          }

          .iris-onboarding-bg {
            animation: iris-onboarding-bg 16s ease-in-out infinite;
            transform-origin: center;
          }

          @media (prefers-reduced-motion: reduce) {
            .iris-onboarding-bg {
              animation: none !important;
              transform: none !important;
            }
          }
        `}
      </style>

      <OnboardingBotanicalBackground />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="grid w-full grid-cols-[auto_1fr_auto] items-start gap-4">
          <a href="/" aria-label="Voltar para a página inicial do IRIS" className="shrink-0">
            <img src={LOGO_PATH} alt="IRIS" className="h-auto w-[66px] sm:w-[72px]" />
          </a>

          <div className="flex justify-center pt-1">
            <EmotionalProgressBar />
          </div>

          <div className="hidden w-[72px] sm:block" aria-hidden="true" />
        </header>

        <section className="flex flex-1 items-center justify-center py-8 lg:py-10">
          <OnboardingContentFrame>{children}</OnboardingContentFrame>
        </section>
      </div>
    </main>
  );
}
TSX

cat > src/components/onboarding/accessibility/AccessibilityChoiceQuestion.tsx <<'TSX'
'use client';

import type { LucideIcon } from 'lucide-react';

type AccessibilityChoiceOption = {
  value: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
};

type AccessibilityChoiceQuestionProps = {
  title: string;
  value: string;
  options: AccessibilityChoiceOption[];
  onChange: (value: string) => void;
};

export function AccessibilityChoiceQuestion({
  title,
  value,
  options,
  onChange,
}: AccessibilityChoiceQuestionProps) {
  return (
    <fieldset className="space-y-6">
      <legend className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
        {title}
      </legend>

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
                {Icon && (
                  <Icon
                    size={17}
                    strokeWidth={1.8}
                    className={selected ? 'mt-0.5 text-white' : 'mt-0.5 text-[#002c1f]'}
                  />
                )}

                <span>
                  <span className="block text-sm font-semibold">
                    {option.label}
                  </span>

                  {option.description && (
                    <span
                      className={[
                        'mt-1 block text-xs leading-5',
                        selected ? 'text-white/78' : 'text-[#747D79]',
                      ].join(' ')}
                    >
                      {option.description}
                    </span>
                  )}
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

cat > src/components/onboarding/accessibility/AccessibilityScaleQuestion.tsx <<'TSX'
'use client';

import type { LucideIcon } from 'lucide-react';

type AccessibilityScaleQuestionProps = {
  title: string;
  minLabel: string;
  maxLabel: string;
  value: number;
  min?: number;
  max?: number;
  icon?: LucideIcon;
  onChange: (value: number) => void;
};

export function AccessibilityScaleQuestion({
  title,
  minLabel,
  maxLabel,
  value,
  min = 90,
  max = 125,
  icon: Icon,
  onChange,
}: AccessibilityScaleQuestionProps) {
  const steps = [90, 100, 110, 120, 125];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        {Icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
            <Icon size={17} strokeWidth={1.8} />
          </span>
        )}

        <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
          {title}
        </h2>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between gap-4">
          <span className="text-sm text-[#747D79]">{minLabel}</span>

          <span className="rounded-full border border-emerald-800/10 bg-emerald-800/[0.06] px-4 py-1.5 text-sm font-semibold text-[#002c1f]">
            {value}%
          </span>

          <span className="text-right text-sm text-[#747D79]">{maxLabel}</span>
        </div>

        <input
          type="range"
          min={min}
          max={max}
          step="5"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full accent-emerald-800"
          aria-label={title}
        />

        <div className="mt-4 grid grid-cols-5 gap-1">
          {steps.map((step) => {
            const active = value >= step;

            return (
              <button
                key={step}
                type="button"
                onClick={() => onChange(step)}
                className={[
                  'h-2 rounded-full transition-all',
                  active ? 'bg-emerald-800' : 'bg-white/60 hover:bg-emerald-800/20',
                ].join(' ')}
                aria-label={`Selecionar ${step}%`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
TSX

cat > src/components/onboarding/accessibility/AccessibilityPreview.tsx <<'TSX'
import type { IrisAccessibilityPreferences } from '@/lib/accessibility/preferences';

type AccessibilityPreviewProps = {
  preferences: IrisAccessibilityPreferences;
};

export function AccessibilityPreview({ preferences }: AccessibilityPreviewProps) {
  return (
    <div className="space-y-5">
      <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
        Veja como fica.
      </h2>

      <div className="rounded-[24px] border border-white/70 bg-white/[0.30] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#747D79]">
          Preview dinâmico
        </p>

        <p className="mt-3 text-base text-[#002c1f]">
          A IRIS deve ser confortável para ler, navegar e sentir. Este texto muda junto com suas escolhas.
        </p>

        <p className="mt-3 text-sm text-[#476153]">
          Tema, fonte, tamanho, espaçamento, contraste e movimento passam a valer assim que você seleciona.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-white/70 bg-white/[0.30] px-3 py-1.5 text-xs font-semibold text-[#002c1f]">
          Tema: {preferences.theme}
        </span>

        <span className="rounded-full border border-white/70 bg-white/[0.30] px-3 py-1.5 text-xs font-semibold text-[#002c1f]">
          Fonte: {preferences.font}
        </span>

        <span className="rounded-full border border-white/70 bg-white/[0.30] px-3 py-1.5 text-xs font-semibold text-[#002c1f]">
          Texto: {preferences.fontScale}%
        </span>

        <span className="rounded-full border border-white/70 bg-white/[0.30] px-3 py-1.5 text-xs font-semibold text-[#002c1f]">
          Espaçamento: {preferences.spacing}
        </span>

        <span className="rounded-full border border-white/70 bg-white/[0.30] px-3 py-1.5 text-xs font-semibold text-[#002c1f]">
          Movimento: {preferences.motion}
        </span>

        <span className="rounded-full border border-white/70 bg-white/[0.30] px-3 py-1.5 text-xs font-semibold text-[#002c1f]">
          Contraste: {preferences.contrast}
        </span>
      </div>
    </div>
  );
}
TSX

cat > src/components/onboarding/accessibility/AccessibilityFinalReview.tsx <<'TSX'
import { CheckCircle2 } from 'lucide-react';
import type { IrisAccessibilityPreferences } from '@/lib/accessibility/preferences';

type AccessibilityFinalReviewProps = {
  preferences: IrisAccessibilityPreferences;
  labels: Record<string, string>;
};

export function AccessibilityFinalReview({
  preferences,
  labels,
}: AccessibilityFinalReviewProps) {
  const items = [
    labels[preferences.theme],
    labels[preferences.font],
    `${preferences.fontScale}%`,
    labels[preferences.spacing],
    labels[preferences.motion],
    labels[preferences.contrast],
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
          <CheckCircle2 size={17} strokeWidth={1.8} />
        </span>

        <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
          Acessibilidade definida.
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

      <div className="rounded-[24px] border border-white/70 bg-white/[0.30] p-5">
        <p className="text-sm text-[#476153]">
          Essas preferências já estão aplicadas e serão carregadas automaticamente nas próximas telas.
        </p>
      </div>
    </div>
  );
}
TSX

cat > src/app/onboarding/accessibility/page.tsx <<'TSX'
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
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
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
TSX

node <<'NODE'
const fs = require('fs');
const path = 'src/app/layout.tsx';

if (!fs.existsSync(path)) {
  console.log('ℹ️ src/app/layout.tsx não encontrado. Runtime aplicado no layout do onboarding.');
  process.exit(0);
}

let file = fs.readFileSync(path, 'utf8');

if (!file.includes("AccessibilityRuntime")) {
  file = `import { AccessibilityRuntime } from '@/components/accessibility/AccessibilityRuntime';\n${file}`;

  const bodyRegex = /(<body[^>]*>)/;

  if (bodyRegex.test(file)) {
    file = file.replace(bodyRegex, `$1\n        <AccessibilityRuntime />`);
    fs.writeFileSync(path, file);
    console.log('✅ AccessibilityRuntime inserido no root layout.');
  } else {
    fs.writeFileSync(path, file);
    console.log('⚠️ Import inserido, mas não encontrei <body>. Adicione <AccessibilityRuntime /> manualmente no root layout.');
  }
} else {
  console.log('✅ AccessibilityRuntime já existe no root layout.');
}
NODE

echo "✅ FE-IRIS-040 aplicado: accessibility criado com tema, fonte, dislexia, tamanho, espaçamento, movimento e contraste dinâmicos."
