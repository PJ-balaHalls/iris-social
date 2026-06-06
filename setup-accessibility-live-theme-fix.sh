#!/usr/bin/env bash
set -euo pipefail

mkdir -p src/lib/accessibility
mkdir -p src/components/accessibility
mkdir -p src/components/onboarding

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
  serif: 'Georgia, "Times New Roman", ui-serif, serif',
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

      --iris-accessibility-page-bg: #FAF7F2;
      --iris-accessibility-surface-bg: rgba(255, 255, 255, 0.22);
      --iris-accessibility-soft-bg: rgba(255, 255, 255, 0.30);
      --iris-accessibility-option-bg: rgba(255, 255, 255, 0.28);
      --iris-accessibility-text: #002c1f;
      --iris-accessibility-muted: #476153;
      --iris-accessibility-subtle: #747D79;
      --iris-accessibility-border: rgba(255, 255, 255, 0.70);
      --iris-accessibility-line: rgba(255, 255, 255, 0.70);
      --iris-accessibility-accent: #002c1f;
      --iris-accessibility-accent-text: #ffffff;
      --iris-accessibility-shadow: rgba(0, 44, 31, 0.14);
      --iris-accessibility-botanical-opacity: 0.92;
      --iris-accessibility-botanical-blend: multiply;
    }

    html[data-iris-theme='light'] {
      color-scheme: light;
      --iris-accessibility-page-bg: #FAF7F2;
      --iris-accessibility-surface-bg: rgba(255, 255, 255, 0.22);
      --iris-accessibility-soft-bg: rgba(255, 255, 255, 0.30);
      --iris-accessibility-option-bg: rgba(255, 255, 255, 0.28);
      --iris-accessibility-text: #002c1f;
      --iris-accessibility-muted: #476153;
      --iris-accessibility-subtle: #747D79;
      --iris-accessibility-border: rgba(255, 255, 255, 0.70);
      --iris-accessibility-line: rgba(255, 255, 255, 0.70);
      --iris-accessibility-accent: #002c1f;
      --iris-accessibility-accent-text: #ffffff;
      --iris-accessibility-botanical-opacity: 0.92;
      --iris-accessibility-botanical-blend: multiply;
    }

    html[data-iris-theme='dark'] {
      color-scheme: dark;
      --iris-accessibility-page-bg: #0d1411;
      --iris-accessibility-surface-bg: rgba(255, 255, 255, 0.055);
      --iris-accessibility-soft-bg: rgba(255, 255, 255, 0.075);
      --iris-accessibility-option-bg: rgba(255, 255, 255, 0.065);
      --iris-accessibility-text: #F8F4EA;
      --iris-accessibility-muted: #C9D2CD;
      --iris-accessibility-subtle: #9BA8A2;
      --iris-accessibility-border: rgba(255, 255, 255, 0.14);
      --iris-accessibility-line: rgba(255, 255, 255, 0.13);
      --iris-accessibility-accent: #DDE6DA;
      --iris-accessibility-accent-text: #0d1411;
      --iris-accessibility-shadow: rgba(0, 0, 0, 0.32);
      --iris-accessibility-botanical-opacity: 0.18;
      --iris-accessibility-botanical-blend: screen;
    }

    html[data-iris-theme='sepia'] {
      color-scheme: light;
      --iris-accessibility-page-bg: #F8F0DE;
      --iris-accessibility-surface-bg: rgba(255, 250, 239, 0.34);
      --iris-accessibility-soft-bg: rgba(255, 250, 239, 0.44);
      --iris-accessibility-option-bg: rgba(255, 250, 239, 0.38);
      --iris-accessibility-text: #2A2118;
      --iris-accessibility-muted: #645345;
      --iris-accessibility-subtle: #806D5E;
      --iris-accessibility-border: rgba(255, 255, 255, 0.72);
      --iris-accessibility-line: rgba(255, 255, 255, 0.74);
      --iris-accessibility-accent: #4A3828;
      --iris-accessibility-accent-text: #ffffff;
      --iris-accessibility-botanical-opacity: 0.82;
      --iris-accessibility-botanical-blend: multiply;
    }

    @media (prefers-color-scheme: dark) {
      html[data-iris-theme='system'] {
        color-scheme: dark;
        --iris-accessibility-page-bg: #0d1411;
        --iris-accessibility-surface-bg: rgba(255, 255, 255, 0.055);
        --iris-accessibility-soft-bg: rgba(255, 255, 255, 0.075);
        --iris-accessibility-option-bg: rgba(255, 255, 255, 0.065);
        --iris-accessibility-text: #F8F4EA;
        --iris-accessibility-muted: #C9D2CD;
        --iris-accessibility-subtle: #9BA8A2;
        --iris-accessibility-border: rgba(255, 255, 255, 0.14);
        --iris-accessibility-line: rgba(255, 255, 255, 0.13);
        --iris-accessibility-accent: #DDE6DA;
        --iris-accessibility-accent-text: #0d1411;
        --iris-accessibility-shadow: rgba(0, 0, 0, 0.32);
        --iris-accessibility-botanical-opacity: 0.18;
        --iris-accessibility-botanical-blend: screen;
      }
    }

    body {
      font-family: var(--iris-accessibility-font-family);
      font-size: calc(16px * var(--iris-accessibility-font-scale));
      line-height: var(--iris-accessibility-line-height);
      letter-spacing: var(--iris-accessibility-letter-spacing);
      word-spacing: var(--iris-accessibility-word-spacing);
      background-color: var(--iris-accessibility-page-bg) !important;
      color: var(--iris-accessibility-text);
      transition:
        background-color 180ms ease,
        color 180ms ease,
        font-size 180ms ease,
        letter-spacing 180ms ease,
        word-spacing 180ms ease;
    }

    [data-iris-onboarding-root] {
      background-color: var(--iris-accessibility-page-bg) !important;
      color: var(--iris-accessibility-text) !important;
      transition:
        background-color 180ms ease,
        color 180ms ease;
    }

    [data-iris-onboarding-root] h1,
    [data-iris-onboarding-root] h2,
    [data-iris-onboarding-root] h3,
    [data-iris-onboarding-root] legend,
    [data-iris-onboarding-root] label,
    [data-iris-onboarding-root] .text-\\[\\#002c1f\\] {
      color: var(--iris-accessibility-text) !important;
    }

    [data-iris-onboarding-root] p,
    [data-iris-onboarding-root] .text-\\[\\#476153\\] {
      color: var(--iris-accessibility-muted) !important;
    }

    [data-iris-onboarding-root] .text-\\[\\#747D79\\],
    [data-iris-onboarding-root] .text-\\[\\#9AA4A1\\] {
      color: var(--iris-accessibility-subtle) !important;
    }

    [data-iris-onboarding-root] [data-iris-onboarding-surface] {
      background-color: var(--iris-accessibility-surface-bg) !important;
      border-color: var(--iris-accessibility-border) !important;
    }

    [data-iris-onboarding-root] [data-iris-field-line] {
      border-color: var(--iris-accessibility-line) !important;
    }

    [data-iris-onboarding-root] input,
    [data-iris-onboarding-root] textarea,
    [data-iris-onboarding-root] select {
      background-color: var(--iris-accessibility-soft-bg) !important;
      border-color: var(--iris-accessibility-border) !important;
      color: var(--iris-accessibility-text) !important;
    }

    [data-iris-onboarding-root] input::placeholder,
    [data-iris-onboarding-root] textarea::placeholder {
      color: var(--iris-accessibility-subtle) !important;
    }

    [data-iris-onboarding-root] button[aria-pressed='false'] {
      background-color: var(--iris-accessibility-option-bg) !important;
      border-color: var(--iris-accessibility-border) !important;
      color: var(--iris-accessibility-text) !important;
    }

    [data-iris-onboarding-root] button[aria-pressed='false'] * {
      color: var(--iris-accessibility-text) !important;
    }

    [data-iris-onboarding-root] button[aria-pressed='true'] {
      background-color: var(--iris-accessibility-accent) !important;
      border-color: var(--iris-accessibility-accent) !important;
      color: var(--iris-accessibility-accent-text) !important;
    }

    [data-iris-onboarding-root] button[aria-pressed='true'] * {
      color: var(--iris-accessibility-accent-text) !important;
    }

    [data-iris-botanical-base] {
      background-color: var(--iris-accessibility-page-bg) !important;
    }

    [data-iris-botanical-image] {
      opacity: var(--iris-accessibility-botanical-opacity) !important;
      mix-blend-mode: var(--iris-accessibility-botanical-blend) !important;
    }

    html[data-iris-contrast='high'] {
      --iris-accessibility-text: #000f0a;
      --iris-accessibility-muted: #1c2c25;
      --iris-accessibility-subtle: #27362f;
      --iris-accessibility-border: rgba(0, 44, 31, 0.34);
      --iris-accessibility-line: rgba(0, 44, 31, 0.22);
    }

    html[data-iris-theme='dark'][data-iris-contrast='high'],
    html[data-iris-theme='system'][data-iris-contrast='high'] {
      --iris-accessibility-text: #ffffff;
      --iris-accessibility-muted: #EEF4F1;
      --iris-accessibility-subtle: #D9E3DE;
      --iris-accessibility-border: rgba(255, 255, 255, 0.34);
      --iris-accessibility-line: rgba(255, 255, 255, 0.22);
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

cat > src/app/onboarding/layout.tsx <<'TSX'
import type { ReactNode } from 'react';
import { AccessibilityRuntime } from '@/components/accessibility/AccessibilityRuntime';
import { EmotionalProgressBar } from '@/components/onboarding/EmotionalProgressBar';
import { OnboardingContentFrame } from '@/components/onboarding/OnboardingContentFrame';
import { OnboardingBotanicalBackground } from '@/components/onboarding/OnboardingBotanicalBackground';

const LOGO_PATH = '/iris/brand/logotipo/svg/iris-logotipo-colorido.svg';

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <main
      data-iris-onboarding-root
      className="relative min-h-screen overflow-x-hidden bg-[#FAF7F2] font-sans text-[#002c1f]"
    >
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

cat > src/components/onboarding/OnboardingBotanicalBackground.tsx <<'TSX'
const ONBOARDING_BACKGROUNDS = {
  desktop: '/iris/brand/backgrounds/desktop/fundo-botanico-suave.svg',
  tablet: '/iris/brand/backgrounds/tablet/fundo-botanico-suave.svg',
  mobile: '/iris/brand/backgrounds/mobile/fundo-botanico-suave.svg',
};

export function OnboardingBotanicalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div data-iris-botanical-base className="absolute inset-0 bg-[#FAF7F2]" />

      <div
        data-iris-botanical-image
        className="iris-onboarding-bg absolute inset-0 hidden opacity-[0.96] mix-blend-multiply lg:block"
        style={{
          backgroundImage: `url(${ONBOARDING_BACKGROUNDS.desktop})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
        }}
      />

      <div
        data-iris-botanical-image
        className="iris-onboarding-bg absolute inset-0 hidden opacity-[0.96] mix-blend-multiply md:block lg:hidden"
        style={{
          backgroundImage: `url(${ONBOARDING_BACKGROUNDS.tablet})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
        }}
      />

      <div
        data-iris-botanical-image
        className="iris-onboarding-bg absolute inset-0 opacity-[0.96] mix-blend-multiply md:hidden"
        style={{
          backgroundImage: `url(${ONBOARDING_BACKGROUNDS.mobile})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 14% 12%, rgba(0,44,31,0.08), transparent 32%), radial-gradient(circle at 88% 86%, rgba(154,124,167,0.10), transparent 38%)',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, transparent 0%, var(--iris-accessibility-page-bg) 88%)',
          opacity: 0.68,
        }}
      />
    </div>
  );
}
TSX

cat > src/components/onboarding/OnboardingFieldLine.tsx <<'TSX'
import type { ReactNode } from 'react';

type OnboardingFieldLineProps = {
  children: ReactNode;
  className?: string;
};

export function OnboardingFieldLine({
  children,
  className = '',
}: OnboardingFieldLineProps) {
  return (
    <div
      data-iris-field-line
      className={`border-t border-white/70 py-4 first:border-t-0 first:pt-0 last:pb-0 ${className}`}
    >
      {children}
    </div>
  );
}
TSX

node <<'NODE'
const fs = require('fs');
const path = 'src/app/onboarding/accessibility/page.tsx';

if (!fs.existsSync(path)) {
  console.error('Arquivo não encontrado:', path);
  process.exit(1);
}

let file = fs.readFileSync(path, 'utf8');

const oldUpdate = `  function updateDraft<Key extends keyof IrisAccessibilityPreferences>(
    key: Key,
    value: IrisAccessibilityPreferences[Key]
  ) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  }`;

const newUpdate = `  function updateDraft<Key extends keyof IrisAccessibilityPreferences>(
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
  }`;

if (!file.includes(oldUpdate)) {
  console.error('Não encontrei o bloco updateDraft esperado. O arquivo pode ter sido alterado.');
  process.exit(1);
}

file = file.replace(oldUpdate, newUpdate);

file = file.replace(
  `<div className="rounded-[26px] bg-white/[0.22] px-4 py-2 backdrop-blur-sm">`,
  `<div data-iris-onboarding-surface className="rounded-[26px] bg-white/[0.22] px-4 py-2 backdrop-blur-sm">`
);

fs.writeFileSync(path, file);
console.log('✅ accessibility/page.tsx atualizado para aplicar tema no clique.');
NODE

node <<'NODE'
const fs = require('fs');
const files = [
  'src/app/onboarding/basic-info/page.tsx',
  'src/app/onboarding/avatar/page.tsx',
  'src/app/onboarding/username/page.tsx',
  'src/app/onboarding/personality/page.tsx',
  'src/app/onboarding/culture/page.tsx',
  'src/app/onboarding/integrations/page.tsx',
  'src/app/onboarding/intention/page.tsx',
  'src/app/onboarding/privacy/page.tsx',
];

for (const path of files) {
  if (!fs.existsSync(path)) continue;

  let file = fs.readFileSync(path, 'utf8');

  file = file.replaceAll(
    `<div className="rounded-[26px] bg-white/[0.22] px-4 py-2 backdrop-blur-sm">`,
    `<div data-iris-onboarding-surface className="rounded-[26px] bg-white/[0.22] px-4 py-2 backdrop-blur-sm">`
  );

  fs.writeFileSync(path, file);
}

console.log('✅ surfaces do onboarding marcadas para tema dinâmico.');
NODE

echo "✅ FE-IRIS-041 aplicado: tema, fonte, espaçamento, movimento e contraste agora atualizam no clique."
