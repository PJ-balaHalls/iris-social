'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import {
  ArrowLeft,
  CaseSensitive,
  GalleryHorizontalEnd,
  LayoutGrid,
  Moon,
  Move,
  Palette,
  Ruler,
  Save,
  ShoppingBag,
  Sparkles,
  Sun,
  Type,
  Monitor,
} from 'lucide-react';
import { useIrisTheme } from '@/components/theme/IrisThemeProvider';
import { saveThemePreferenceAction } from '@/lib/actions/theme.actions';
import type { IrisAppearancePreferences, IrisThemeMode } from '@/lib/themes/themeTypes';
import { AppearanceThemeCarousel } from './_components/AppearanceThemeCarousel';

const preferenceGroups = [
  {
    key: 'fontStyle',
    title: 'Estilo das fontes',
    description: 'Define a personalidade tipográfica da interface.',
    icon: Type,
    options: [
      ['editorial', 'Editorial'],
      ['modern', 'Moderna'],
      ['soft', 'Suave'],
      ['mono', 'Mono'],
    ],
  },
  {
    key: 'fontScale',
    title: 'Tamanho das fontes',
    description: 'Ajusta a escala geral da leitura.',
    icon: CaseSensitive,
    options: [
      ['small', 'Menor'],
      ['normal', 'Normal'],
      ['large', 'Maior'],
    ],
  },
  {
    key: 'spacing',
    title: 'Espaçamento',
    description: 'Controla a densidade visual das telas.',
    icon: Ruler,
    options: [
      ['compact', 'Compacto'],
      ['comfortable', 'Confortável'],
      ['airy', 'Aberto'],
    ],
  },
  {
    key: 'radius',
    title: 'Arredondamento',
    description: 'Muda o formato dos cards e controles.',
    icon: LayoutGrid,
    options: [
      ['sharp', 'Reto'],
      ['soft', 'Suave'],
      ['dream', 'Dream'],
    ],
  },
  {
    key: 'motion',
    title: 'Movimento',
    description: 'Define animações, transições e fundos vivos.',
    icon: Move,
    options: [
      ['reduced', 'Reduzido'],
      ['balanced', 'Equilibrado'],
      ['expressive', 'Expressivo'],
    ],
  },
  {
    key: 'glass',
    title: 'Transparência',
    description: 'Controla o nível de vidro/blur.',
    icon: GalleryHorizontalEnd,
    options: [
      ['none', 'Mínimo'],
      ['soft', 'Suave'],
      ['strong', 'Forte'],
    ],
  },
] as const;

export function AppearanceSettingsClient() {
  const {
    themeSlug,
    mode,
    resolvedMode,
    preferences,
    themes,
    activateTheme,
    setMode,
    setPreferences,
  } = useIrisTheme();
  const [pending, startTransition] = useTransition();

  function persist(nextThemeSlug: string, nextMode: IrisThemeMode, nextPreferences: IrisAppearancePreferences) {
    const formData = new FormData();

    formData.set('themeSlug', nextThemeSlug);
    formData.set('mode', nextMode);
    formData.set('fontStyle', nextPreferences.fontStyle);
    formData.set('fontScale', nextPreferences.fontScale);
    formData.set('spacing', nextPreferences.spacing);
    formData.set('radius', nextPreferences.radius);
    formData.set('motion', nextPreferences.motion);
    formData.set('glass', nextPreferences.glass);

    startTransition(async () => {
      await saveThemePreferenceAction(formData);
    });
  }

  function handleTheme(slug: string) {
    activateTheme(slug, mode, preferences, themes);
    persist(slug, mode, preferences);
  }

  function handleMode(nextMode: IrisThemeMode) {
    setMode(nextMode);
    persist(themeSlug, nextMode, preferences);
  }

  function handlePreference(key: keyof IrisAppearancePreferences, value: string) {
    const nextPreferences = {
      ...preferences,
      [key]: value,
    } as IrisAppearancePreferences;

    setPreferences(nextPreferences);
    persist(themeSlug, mode, nextPreferences);
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-5 py-8 text-[#1B3A2E] sm:px-8 lg:px-12 lg:py-10">
      <div className="mx-auto w-full max-w-[1560px]">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/settings"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#DDE6DA] bg-white/70 px-4 text-sm font-semibold text-[#1B3A2E] transition hover:bg-white"
          >
            <ArrowLeft size={15} strokeWidth={1.8} />
            Voltar
          </Link>

          <Link
            href="/marketplace"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#DDE6DA] bg-white/70 px-4 text-sm font-semibold text-[#476153] transition hover:bg-white hover:text-[#1B3A2E]"
          >
            <ShoppingBag size={15} strokeWidth={1.8} />
            Marketplace
          </Link>
        </div>

        <section className="iris-theme-card relative overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 iris-theme-swatch opacity-50" />

          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <div className="mb-8 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/40 px-3 py-1.5 text-xs font-medium text-[#476153] backdrop-blur-md">
                  <Palette size={13} strokeWidth={1.8} />
                  Aparência global
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/40 px-3 py-1.5 text-xs font-medium text-[#476153] backdrop-blur-md">
                  <Save size={13} strokeWidth={1.8} />
                  {pending ? 'Salvando...' : 'Aplicação imediata'}
                </span>
              </div>

              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#747D79]">
                Aparência
              </p>

              <h1 className="mt-3 max-w-4xl font-display text-[2.35rem] leading-[1.03] tracking-[-0.055em] text-[#1B3A2E] sm:text-[3.2rem] lg:text-[3.8rem]">
                Tema, leitura, espaço e movimento em todo o app.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-[#476153]">
                Agora a aparência muda a IRIS inteira: cores, modo escuro, fonte,
                espaçamento, radius, transparência e animações.
              </p>
            </div>

            <div className="rounded-[28px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] p-5">
              <p className="text-sm font-semibold">Estado atual</p>
              <p className="mt-2 font-display text-[2.15rem] leading-none tracking-[-0.06em]">
                {themes.find((theme) => theme.slug === themeSlug)?.name || themeSlug}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#747D79]">
                Modo resolvido: {resolvedMode === 'dark' ? 'Escuro' : 'Claro'}.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-8">
            <AppearanceThemeCarousel
              themes={themes}
              activeSlug={themeSlug}
              onActivate={handleTheme}
            />

            <section className="iris-theme-card p-5 sm:p-6">
              <div className="mb-6">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
                  Personalização
                </p>
                <h2 className="mt-2 font-display text-[2rem] leading-none tracking-[-0.055em]">
                  Leitura e comportamento visual
                </h2>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                {preferenceGroups.map((group) => {
                  const Icon = group.icon;
                  const current = preferences[group.key as keyof IrisAppearancePreferences];

                  return (
                    <article
                      key={group.key}
                      className="rounded-[28px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] p-5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--iris-color-primary)] text-white">
                          <Icon size={17} strokeWidth={1.8} />
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold">{group.title}</h3>
                          <p className="mt-1 text-sm leading-6 text-[#747D79]">
                            {group.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {group.options.map(([value, label]) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() =>
                              handlePreference(
                                group.key as keyof IrisAppearancePreferences,
                                value,
                              )
                            }
                            className={[
                              'rounded-full border px-4 py-2 text-sm font-semibold transition',
                              current === value
                                ? 'border-[var(--iris-color-primary)] bg-[var(--iris-color-primary)] text-white'
                                : 'border-[var(--iris-color-border)] bg-white/60 text-[var(--iris-text-primary)] hover:bg-white',
                            ].join(' ')}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </section>

          <aside className="space-y-6 xl:sticky xl:top-8 xl:self-start">
            <section className="iris-theme-card p-5">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
                Modo
              </p>
              <h3 className="mt-2 font-display text-[1.9rem] leading-none tracking-[-0.05em]">
                Claro, escuro ou sistema
              </h3>

              <div className="mt-6 space-y-3">
                {[
                  { key: 'light', label: 'Claro', icon: Sun },
                  { key: 'dark', label: 'Escuro', icon: Moon },
                  { key: 'system', label: 'Sistema', icon: Monitor },
                ].map((item) => {
                  const Icon = item.icon;
                  const active = mode === item.key;

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleMode(item.key as IrisThemeMode)}
                      className={[
                        'flex min-h-12 w-full items-center justify-between rounded-full border px-4 text-sm font-semibold transition',
                        active
                          ? 'border-[var(--iris-color-primary)] bg-[var(--iris-color-primary)] text-white'
                          : 'border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)]',
                      ].join(' ')}
                    >
                      <span className="inline-flex items-center gap-2">
                        <Icon size={16} strokeWidth={1.8} />
                        {item.label}
                      </span>
                      {active ? 'Ativo' : ''}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[32px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] p-5">
              <Sparkles size={20} strokeWidth={1.8} />
              <p className="mt-4 text-sm font-semibold">Prévia real</p>
              <p className="mt-2 text-sm leading-6 text-[#747D79]">
                Todo ajuste é aplicado no documento global, então páginas antigas e
                novas respondem juntas.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
