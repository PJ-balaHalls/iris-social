'use client';

import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import type { IrisThemeDefinition } from '@/lib/themes/themeTypes';

export function AppearanceThemeCarousel({
  themes,
  activeSlug,
  onActivate,
}: {
  themes: IrisThemeDefinition[];
  activeSlug: string;
  onActivate: (slug: string) => void;
}) {
  return (
    <section className="overflow-hidden rounded-[34px] border border-[var(--iris-color-border)] bg-white/55 p-5 shadow-[0_20px_70px_var(--iris-color-shadow)] backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
            Biblioteca
          </p>
          <h2 className="mt-2 font-display text-[2rem] leading-none tracking-[-0.055em]">
            Temas adquiridos
          </h2>
        </div>

        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--iris-color-border)] bg-white/70"
          >
            <ChevronLeft size={16} strokeWidth={1.8} />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--iris-color-border)] bg-white/70"
          >
            <ChevronRight size={16} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <div className="flex snap-x gap-4 overflow-x-auto pb-2">
        {themes.map((theme) => {
          const active = theme.slug === activeSlug;

          return (
            <article
              key={theme.slug}
              className="min-w-[280px] snap-start rounded-[28px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] p-4"
            >
              <div
                className="h-36 rounded-[24px] border border-white/70"
                style={{
                  background: `
                    radial-gradient(circle at 18% 18%, ${theme.lightTokens.primary}, transparent 35%),
                    radial-gradient(circle at 82% 22%, ${theme.lightTokens.accent}, transparent 34%),
                    linear-gradient(135deg, ${theme.lightTokens.background}, ${theme.lightTokens.accentSoft})
                  `,
                }}
              />

              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-[1.55rem] leading-none tracking-[-0.05em]">
                    {theme.name}
                  </h3>
                  <p className="mt-2 text-sm leading-5 text-[#747D79]">
                    {theme.priceLabel}
                  </p>
                </div>

                {active ? (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--iris-color-primary)] text-white">
                    <Check size={16} strokeWidth={1.8} />
                  </span>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => onActivate(theme.slug)}
                className={[
                  'mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-full px-4 text-sm font-semibold transition',
                  active
                    ? 'border border-[var(--iris-color-border)] bg-white/70 text-[var(--iris-text-primary)]'
                    : 'bg-[var(--iris-color-primary)] text-white',
                ].join(' ')}
              >
                {active ? 'Ativo' : 'Usar tema'}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
