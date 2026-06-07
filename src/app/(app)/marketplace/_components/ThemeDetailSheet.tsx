'use client';

import { X, Star, Download, Code2, UserRound, BadgeCheck } from 'lucide-react';
import type { IrisThemeDefinition } from '@/lib/themes/themeTypes';

export function ThemeDetailSheet({
  theme,
  open,
  active,
  installing,
  installProgress,
  onClose,
  onInstall,
}: {
  theme: IrisThemeDefinition | null;
  open: boolean;
  active: boolean;
  installing: boolean;
  installProgress: number;
  onClose: () => void;
  onInstall: () => void;
}) {
  if (!theme) return null;

  return (
    <div
      className={[
        'fixed inset-0 z-50 transition',
        open ? 'pointer-events-auto' : 'pointer-events-none',
      ].join(' ')}
    >
      <div
        className={[
          'absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity',
          open ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        onClick={onClose}
      />

      <aside
        className={[
          'absolute right-0 top-0 h-full w-full max-w-[560px] overflow-y-auto border-l border-[var(--iris-color-border)] bg-[var(--iris-bg-primary)] p-5 shadow-[-30px_0_100px_rgba(0,0,0,0.18)] transition-transform duration-300 sm:p-7',
          open ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <span className="rounded-full border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            {theme.priceLabel}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)]"
          >
            <X size={17} strokeWidth={1.8} />
          </button>
        </div>

        <div
          className="h-64 overflow-hidden rounded-[34px] border border-white/70"
          style={{
            background: `
              radial-gradient(circle at 18% 18%, ${theme.lightTokens.primary}, transparent 35%),
              radial-gradient(circle at 82% 20%, ${theme.lightTokens.accent}, transparent 34%),
              linear-gradient(135deg, ${theme.lightTokens.background}, ${theme.lightTokens.accentSoft})
            `,
          }}
        />

        <div className="mt-7">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
            {theme.category}
          </p>

          <h2 className="mt-2 font-display text-[3rem] leading-none tracking-[-0.065em]">
            {theme.name}
          </h2>

          <p className="mt-4 text-base leading-7 text-[#747D79]">
            {theme.longDescription}
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[24px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] p-4">
            <Star size={17} strokeWidth={1.8} />
            <p className="mt-3 text-sm font-semibold">
              {theme.ratingAverage.toFixed(1)}
            </p>
            <p className="mt-1 text-xs text-[#747D79]">
              {theme.ratingCount} avaliações
            </p>
          </div>

          <div className="rounded-[24px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] p-4">
            <UserRound size={17} strokeWidth={1.8} />
            <p className="mt-3 text-sm font-semibold">{theme.authorName}</p>
            <p className="mt-1 text-xs text-[#747D79]">Autor</p>
          </div>

          <div className="rounded-[24px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] p-4">
            <BadgeCheck size={17} strokeWidth={1.8} />
            <p className="mt-3 text-sm font-semibold">
              {theme.status === 'native' ? 'Nativo' : 'Publicado'}
            </p>
            <p className="mt-1 text-xs text-[#747D79]">Status</p>
          </div>
        </div>

        <section className="mt-7 rounded-[30px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] p-5">
          <h3 className="text-sm font-semibold">Exemplos no app</h3>

          <div className="mt-5 grid gap-4">
            <div className="rounded-[26px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-surface)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
                Card de memória
              </p>
              <p className="mt-2 font-display text-2xl leading-none tracking-[-0.05em]">
                Uma tarde guardada
              </p>
              <p className="mt-3 text-sm leading-6 text-[#747D79]">
                O tema muda a atmosfera sem quebrar a hierarquia visual.
              </p>
            </div>

            <button
              type="button"
              className="min-h-11 rounded-full bg-[var(--iris-color-primary)] px-5 text-sm font-semibold text-white"
            >
              Botão principal
            </button>
          </div>
        </section>

        <section className="mt-7 rounded-[30px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] p-5">
          <div className="flex items-center gap-2">
            <Code2 size={17} strokeWidth={1.8} />
            <h3 className="text-sm font-semibold">Código do tema</h3>
          </div>

          <pre className="mt-4 max-h-64 overflow-auto rounded-[22px] bg-black p-4 text-xs leading-5 text-white">
{JSON.stringify(
  {
    slug: theme.slug,
    lightTokens: theme.lightTokens,
    darkTokens: theme.darkTokens,
    background: theme.background,
    typography: theme.typography,
    layout: theme.layout,
    animation: theme.animation,
  },
  null,
  2,
)}
          </pre>
        </section>

        <div className="sticky bottom-0 mt-7 border-t border-[var(--iris-color-border)] bg-[var(--iris-bg-primary)] pt-5">
          {installing ? (
            <div className="rounded-[24px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] p-4">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>Baixando e instalando...</span>
                <span>{installProgress}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--iris-color-border)]">
                <div
                  className="h-full rounded-full bg-[var(--iris-color-primary)] transition-all"
                  style={{ width: `${installProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onInstall}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--iris-color-primary)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--iris-color-primary-deep)]"
            >
              <Download size={16} strokeWidth={1.8} />
              {active ? 'Tema ativo' : 'Baixar, instalar e ativar'}
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
