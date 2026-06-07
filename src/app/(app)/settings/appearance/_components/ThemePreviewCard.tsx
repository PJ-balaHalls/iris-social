'use client';

import { Check, Palette } from 'lucide-react';
import type { IrisThemeDefinition } from '@/lib/themes/themeTypes';

export function ThemePreviewCard({
  theme,
  active,
  onActivate,
}: {
  theme: IrisThemeDefinition;
  active: boolean;
  onActivate: () => void;
}) {
  return (
    <article
      className={[
        'relative overflow-hidden rounded-[32px] border p-5 transition',
        active
          ? 'border-[var(--iris-color-primary)] bg-[var(--iris-bg-surface)] shadow-[0_24px_80px_var(--iris-color-shadow)]'
          : 'border-[var(--iris-color-border)] bg-white/58 hover:-translate-y-1 hover:bg-white',
      ].join(' ')}
    >
      <div
        className="h-36 rounded-[26px] border border-white/70 shadow-inner"
        style={{
          background: `
            radial-gradient(circle at 18% 18%, ${theme.lightTokens.primary}, transparent 35%),
            radial-gradient(circle at 82% 20%, ${theme.lightTokens.accent}, transparent 35%),
            linear-gradient(135deg, ${theme.lightTokens.background}, ${theme.lightTokens.accentSoft})
          `,
        }}
      />

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#747D79]">
            {theme.status === 'native' ? 'Nativo' : theme.priceLabel}
          </p>

          <h3 className="mt-2 font-display text-[1.8rem] leading-none tracking-[-0.05em] text-[#1B3A2E]">
            {theme.name}
          </h3>

          <p className="mt-3 text-sm leading-6 text-[#747D79]">
            {theme.shortDescription}
          </p>
        </div>

        {active ? (
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--iris-color-primary)] text-white">
            <Check size={17} strokeWidth={1.8} />
          </span>
        ) : (
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] text-[#747D79]">
            <Palette size={17} strokeWidth={1.8} />
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={onActivate}
        className={[
          'mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full px-5 text-sm font-semibold transition',
          active
            ? 'border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] text-[var(--iris-text-primary)]'
            : 'bg-[var(--iris-color-primary)] text-white hover:bg-[var(--iris-color-primary-deep)]',
        ].join(' ')}
      >
        {active ? 'Tema ativo' : 'Ativar tema'}
      </button>
    </article>
  );
}
