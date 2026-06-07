'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState, useTransition } from 'react';
import {
  ArrowLeft,
  Brush,
  Code2,
  Filter,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useIrisTheme } from '@/components/theme/IrisThemeProvider';
import { installThemeAction } from '@/lib/actions/theme.actions';
import type {
  IrisAppearancePreferences,
  IrisThemeDefinition,
  IrisThemeMode,
  IrisThemePricingModel,
} from '@/lib/themes/themeTypes';
import { MarketplaceThemeCard } from './_components/MarketplaceThemeCard';
import { ThemeDetailSheet } from './_components/ThemeDetailSheet';
import { filterMarketplaceThemes } from './_utils/marketplaceSearch';

const categories = [
  ['all', 'Todos'],
  ['themes', 'Temas'],
  ['backgrounds', 'Backgrounds'],
  ['typography', 'Fontes'],
  ['icons', 'Ícones'],
  ['motion', 'Animações'],
  ['seasonal', 'Sazonais'],
] as const;

const pricingFilters = [
  ['all', 'Todos'],
  ['free', 'Gratuito'],
  ['subscription', 'Assinatura'],
  ['paid', 'Pago à parte'],
] as const;

export function MarketplaceClient({ initialThemes }: { initialThemes: IrisThemeDefinition[] }) {
  const { themeSlug, mode, preferences, activateTheme, themes } = useIrisTheme();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [pricing, setPricing] = useState<'all' | IrisThemePricingModel>('all');
  const [selected, setSelected] = useState<IrisThemeDefinition | null>(initialThemes[0] || null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [installingSlug, setInstallingSlug] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [, startTransition] = useTransition();

  const marketplaceThemes = useMemo(
    () => filterMarketplaceThemes(initialThemes, { query, category, pricing }),
    [initialThemes, query, category, pricing],
  );

  function persistInstall(
    theme: IrisThemeDefinition,
    nextMode: IrisThemeMode,
    nextPreferences: IrisAppearancePreferences,
  ) {
    const formData = new FormData();

    formData.set('themeSlug', theme.slug);
    formData.set('mode', nextMode);
    formData.set('fontStyle', nextPreferences.fontStyle);
    formData.set('fontScale', nextPreferences.fontScale);
    formData.set('spacing', nextPreferences.spacing);
    formData.set('radius', nextPreferences.radius);
    formData.set('motion', nextPreferences.motion);
    formData.set('glass', nextPreferences.glass);

    startTransition(async () => {
      await installThemeAction(formData);
    });
  }

  function installTheme(theme: IrisThemeDefinition) {
    setSelected(theme);
    setSheetOpen(true);
    setInstallingSlug(theme.slug);
    setProgress(8);

    const steps = [22, 44, 68, 86, 100];

    steps.forEach((step, index) => {
      window.setTimeout(() => {
        setProgress(step);

        if (step === 100) {
          activateTheme(theme.slug, mode, preferences, [...themes, ...initialThemes]);
          persistInstall(theme, mode, preferences);

          window.setTimeout(() => {
            setInstallingSlug(null);
            setProgress(0);
          }, 520);
        }
      }, 340 + index * 280);
    });
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-5 py-8 text-[#1B3A2E] sm:px-8 lg:px-12 lg:py-10">
      <div className="mx-auto w-full max-w-[1680px]">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/iris"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#DDE6DA] bg-white/70 px-4 text-sm font-semibold text-[#1B3A2E] transition hover:bg-white"
          >
            <ArrowLeft size={15} strokeWidth={1.8} />
            Voltar para IRIS
          </Link>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/marketplace/creator"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[var(--iris-color-primary)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--iris-color-primary-deep)]"
            >
              <Code2 size={15} strokeWidth={1.8} />
              Criar tema
            </Link>

            <Link
              href="/settings/appearance"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#DDE6DA] bg-white/70 px-4 text-sm font-semibold text-[#476153] transition hover:bg-white hover:text-[#1B3A2E]"
            >
              <Settings size={15} strokeWidth={1.8} />
              Aparência
            </Link>
          </div>
        </div>

        <section className="relative min-h-[460px] overflow-hidden rounded-[44px] border border-white/70 bg-[#111A16] p-6 text-white shadow-[0_34px_120px_rgba(15,21,18,0.22)] sm:p-8 lg:p-10">
          <Image
            src="/iris/brand/cards/marketplace.png"
            alt="IRIS Marketplace"
            fill
            priority
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/42 to-black/10" />

          <div className="relative grid min-h-[380px] gap-8 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-end">
            <div>
              <div className="mb-8 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/76 backdrop-blur-md">
                  <ShoppingBag size={13} strokeWidth={1.8} />
                  Marketplace
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/76 backdrop-blur-md">
                  <Sparkles size={13} strokeWidth={1.8} />
                  Temas e extensões visuais
                </span>
              </div>

              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-white/50">
                IRIS Marketplace
              </p>

              <h1 className="mt-3 max-w-4xl font-display text-[2.7rem] leading-[1.01] tracking-[-0.065em] sm:text-[4rem] lg:text-[5rem]">
                Personalize a atmosfera da sua IRIS.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-white/68">
                Temas, fundos, tipografia, animações e pacotes visuais. Começamos
                com o tema Lilás, mas a estrutura já aceita criações da comunidade.
              </p>
            </div>

            <div className="rounded-[34px] border border-white/12 bg-white/[0.08] p-5 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#111A16]">
                  <Brush size={24} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Busca inteligente</p>
                  <p className="mt-1 text-sm text-white/60">
                    Nome, autor, tags, categoria e preço.
                  </p>
                </div>
              </div>

              <div className="relative mt-6">
                <Search
                  size={17}
                  strokeWidth={1.8}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar: lilás, gratuito, autor, dark, animação..."
                  className="min-h-12 w-full rounded-full border border-white/14 bg-white/10 pl-11 pr-4 text-sm font-medium text-white outline-none placeholder:text-white/42 focus:border-white/50"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[34px] border border-[var(--iris-color-border)] bg-white/55 p-5 shadow-[0_20px_70px_var(--iris-color-shadow)] backdrop-blur-xl">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Filter size={16} strokeWidth={1.8} />
              Filtros
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  className={[
                    'shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition',
                    category === key
                      ? 'border-[var(--iris-color-primary)] bg-[var(--iris-color-primary)] text-white'
                      : 'border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)]',
                  ].join(' ')}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {pricingFilters.map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPricing(key)}
                  className={[
                    'shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition',
                    pricing === key
                      ? 'border-[var(--iris-color-primary)] bg-[var(--iris-color-primary)] text-white'
                      : 'border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)]',
                  ].join(' ')}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {marketplaceThemes.map((theme) => (
            <MarketplaceThemeCard
              key={theme.slug}
              theme={theme}
              active={theme.slug === themeSlug}
              onOpen={() => {
                setSelected(theme);
                setSheetOpen(true);
              }}
              onInstall={() => installTheme(theme)}
            />
          ))}
        </section>

        {marketplaceThemes.length === 0 ? (
          <section className="mt-8 rounded-[34px] border border-dashed border-[var(--iris-color-border)] bg-white/40 p-10 text-center">
            <p className="font-display text-[2.4rem] leading-none tracking-[-0.06em]">
              Nenhum tema encontrado.
            </p>
            <p className="mt-4 text-sm leading-6 text-[#747D79]">
              Tente buscar por gratuito, lilás, animação, dark, autor ou categoria.
            </p>
          </section>
        ) : null}

        <ThemeDetailSheet
          theme={selected}
          open={sheetOpen}
          active={Boolean(selected && selected.slug === themeSlug)}
          installing={Boolean(selected && installingSlug === selected.slug)}
          installProgress={progress}
          onClose={() => setSheetOpen(false)}
          onInstall={() => selected && installTheme(selected)}
        />
      </div>
    </main>
  );
}
