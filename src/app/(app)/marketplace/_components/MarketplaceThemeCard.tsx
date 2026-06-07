'use client';

import { Check, Download, Star } from 'lucide-react';
import type { IrisThemeDefinition } from '@/lib/themes/themeTypes';

export function MarketplaceThemeCard({
  theme,
  active,
  onOpen,
  onInstall,
}: {
  theme: IrisThemeDefinition;
  active: boolean;
  onOpen: () => void;
  onInstall: () => void;
}) {
  return (
    <article className="group overflow-hidden rounded-[34px] border border-[var(--iris-color-border)] bg-white/58 p-4 shadow-[0_18px_60px_var(--iris-color-shadow)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white">
      <button
        type="button"
        onClick={onOpen}
        className="block w-full text-left"
      >
        <div
          className="relative h-52 overflow-hidden rounded-[28px] border border-white/70"
          style={{
            background: `
              radial-gradient(circle at 18% 18%, ${theme.lightTokens.primary}, transparent 35%),
              radial-gradient(circle at 82% 20%, ${theme.lightTokens.accent}, transparent 34%),
              linear-gradient(135deg, ${theme.lightTokens.background}, ${theme.lightTokens.accentSoft})
            `,
          }}
        >
          <div className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/60 px-3 py-1.5 text-xs font-semibold text-[#476153] backdrop-blur-md">
            {theme.priceLabel}
          </div>

          {active ? (
            <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--iris-color-primary)] text-white">
              <Check size={16} strokeWidth={1.8} />
            </div>
          ) : null}
        </div>

        <div className="mt-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#747D79]">
                {theme.category}
              </p>
              <h2 className="mt-2 font-display text-[2rem] leading-none tracking-[-0.055em]">
                {theme.name}
              </h2>
            </div>

            <div className="flex items-center gap-1 rounded-full border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] px-3 py-1.5 text-xs font-semibold">
              <Star size={13} strokeWidth={1.8} />
              {theme.ratingAverage.toFixed(1)}
            </div>
          </div>

          <p className="mt-3 text-sm leading-6 text-[#747D79]">
            {theme.shortDescription}
          </p>
        </div>
      </button>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={onOpen}
          className="min-h-10 flex-1 rounded-full border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] px-4 text-sm font-semibold"
        >
          Ver tema
        </button>

        <button
          type="button"
          onClick={onInstall}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[var(--iris-color-primary)] px-4 text-sm font-semibold text-white"
        >
          <Download size={15} strokeWidth={1.8} />
          Instalar
        </button>
      </div>
    </article>
  );
}
