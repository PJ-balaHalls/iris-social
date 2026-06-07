'use client';

import Link from 'next/link';
import { useMemo, useState, useTransition } from 'react';
import {
  ArrowLeft,
  Check,
  Code2,
  Eye,
  Image as ImageIcon,
  Palette,
  Send,
  Sparkles,
  Type,
} from 'lucide-react';
import { publishThemeAction } from '@/lib/actions/marketplace-theme.actions';
import type { IrisThemeDefinition } from '@/lib/themes/themeTypes';

const defaultTheme = {
  name: 'Aurora Particular',
  slug: 'aurora-particular',
  authorName: 'Criador IRIS',
  shortDescription: 'Um tema autoral com aura suave e visual editorial.',
  longDescription:
    'Tema criado no editor da IRIS com tokens próprios, versão escura, background configurável e atmosfera personalizada.',
  coverImagePath: '/iris/brand/cards/marketplace.png',
  category: 'themes',
  pricingModel: 'free',
  priceCents: 0,
  tags: 'autoral, editorial, suave',
  light: {
    primary: '#6F4BB2',
    primaryDeep: '#4E347F',
    primarySoft: '#EFE7F6',
    accent: '#9A7CA7',
    accentSoft: '#F7F1FA',
    emotion: '#B899D6',
    background: '#FAF7F2',
    surface: '#FFFFFF',
    surfaceSoft: '#FFFDF8',
    text: '#3A295F',
    textSecondary: '#5E4A76',
    textMuted: '#887898',
    border: '#E6DDF0',
  },
  dark: {
    primary: '#C8A8FF',
    primaryDeep: '#EFE3FF',
    primarySoft: '#2A1F3A',
    accent: '#B899D6',
    accentSoft: '#22172F',
    emotion: '#D8B9F4',
    background: '#0F0B16',
    surface: '#171021',
    surfaceSoft: '#20162D',
    text: '#FAF7FF',
    textSecondary: '#D8CEE6',
    textMuted: '#A89CB8',
    border: '#3A2B4A',
  },
  backgroundType: 'aurora-lilac',
  backgroundAnimated: true,
  backgroundIntensity: 'soft',
  fontStyle: 'editorial',
  radius: 'dream',
  spacing: 'comfortable',
  glass: 'soft',
  motion: 'balanced',
  backgroundAnimation: 'slow-aurora',
};

type CreatorState = typeof defaultTheme;

function colorFields(prefix: 'light' | 'dark', values: CreatorState, setValues: (value: CreatorState) => void) {
  const tokenSet = values[prefix];

  return Object.entries(tokenSet).map(([key, value]) => (
    <label key={`${prefix}-${key}`} className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#747D79]">
        {key}
      </span>
      <div className="mt-2 flex items-center gap-3 rounded-[18px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] p-2">
        <input
          type="color"
          value={value}
          onChange={(event) =>
            setValues({
              ...values,
              [prefix]: {
                ...tokenSet,
                [key]: event.target.value,
              },
            })
          }
          className="h-10 w-12 rounded-xl border-0 bg-transparent"
        />
        <input
          value={value}
          onChange={(event) =>
            setValues({
              ...values,
              [prefix]: {
                ...tokenSet,
                [key]: event.target.value,
              },
            })
          }
          className="min-h-10 flex-1 bg-transparent px-2 text-sm font-semibold outline-none"
        />
      </div>
    </label>
  ));
}

export function ThemeCreatorClient() {
  const [values, setValues] = useState<CreatorState>(defaultTheme);
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [result, setResult] = useState<string>('');
  const [pending, startTransition] = useTransition();

  const previewTokens = values[mode];

  const themeJson = useMemo(
    () => ({
      slug: values.slug,
      name: values.name,
      authorName: values.authorName,
      category: values.category,
      pricingModel: values.pricingModel,
      priceCents: values.priceCents,
      coverImagePath: values.coverImagePath,
      lightTokens: values.light,
      darkTokens: values.dark,
      background: {
        type: values.backgroundType,
        animated: values.backgroundAnimated,
        intensity: values.backgroundIntensity,
      },
      typography: {
        fontStyle: values.fontStyle,
      },
      layout: {
        radius: values.radius,
        spacing: values.spacing,
        glass: values.glass,
      },
      animation: {
        motion: values.motion,
        backgroundAnimation: values.backgroundAnimation,
      },
      tags: values.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    }),
    [values],
  );

  function publish() {
    const formData = new FormData();

    formData.set('name', values.name);
    formData.set('slug', values.slug);
    formData.set('authorName', values.authorName);
    formData.set('shortDescription', values.shortDescription);
    formData.set('longDescription', values.longDescription);
    formData.set('coverImagePath', values.coverImagePath);
    formData.set('category', values.category);
    formData.set('pricingModel', values.pricingModel);
    formData.set('priceCents', String(values.priceCents));
    formData.set('tags', values.tags);
    formData.set('backgroundType', values.backgroundType);
    formData.set('backgroundAnimated', String(values.backgroundAnimated));
    formData.set('backgroundIntensity', values.backgroundIntensity);
    formData.set('fontStyle', values.fontStyle);
    formData.set('radius', values.radius);
    formData.set('spacing', values.spacing);
    formData.set('glass', values.glass);
    formData.set('motion', values.motion);
    formData.set('backgroundAnimation', values.backgroundAnimation);

    Object.entries(values.light).forEach(([key, value]) => {
      formData.set(`light_${key}`, value);
    });

    Object.entries(values.dark).forEach(([key, value]) => {
      formData.set(`dark_${key}`, value);
    });

    startTransition(async () => {
      const response = await publishThemeAction(formData);
      setResult(response.ok ? `Tema publicado: ${response.slug}` : `Erro: ${response.error}`);
    });
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-5 py-8 text-[#1B3A2E] sm:px-8 lg:px-12 lg:py-10">
      <div className="mx-auto w-full max-w-[1680px]">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/marketplace"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#DDE6DA] bg-white/70 px-4 text-sm font-semibold text-[#1B3A2E] transition hover:bg-white"
          >
            <ArrowLeft size={15} strokeWidth={1.8} />
            Voltar ao marketplace
          </Link>

          <button
            type="button"
            onClick={publish}
            disabled={pending}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--iris-color-primary)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--iris-color-primary-deep)] disabled:opacity-60"
          >
            <Send size={15} strokeWidth={1.8} />
            {pending ? 'Publicando...' : 'Publicar tema'}
          </button>
        </div>

        <section className="relative overflow-hidden rounded-[44px] border border-white/70 bg-[#111A16] p-6 text-white shadow-[0_34px_120px_rgba(15,21,18,0.22)] sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_8%,rgba(154,124,167,0.35),transparent_32%),radial-gradient(circle_at_90%_12%,rgba(111,75,178,0.26),transparent_34%)]" />

          <div className="relative max-w-5xl">
            <div className="mb-8 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/76 backdrop-blur-md">
                <Code2 size={13} strokeWidth={1.8} />
                Creator Studio
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/76 backdrop-blur-md">
                <Sparkles size={13} strokeWidth={1.8} />
                Qualquer usuário autenticado pode publicar
              </span>
            </div>

            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-white/48">
              Criar e publicar temas
            </p>
            <h1 className="mt-3 font-display text-[2.7rem] leading-[1.01] tracking-[-0.065em] sm:text-[4rem] lg:text-[5rem]">
              Desenhe uma atmosfera completa para a IRIS.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/68">
              Configure capa, autor, descrição, light mode, dark mode, background,
              tipografia, espaçamento, radius, glass e animações com prévia real.
            </p>
          </div>
        </section>

        <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_560px]">
          <section className="space-y-6">
            <div className="iris-theme-card p-5">
              <div className="mb-5 flex items-center gap-2">
                <ImageIcon size={18} strokeWidth={1.8} />
                <h2 className="text-sm font-semibold">Informações públicas</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ['name', 'Nome do tema'],
                  ['slug', 'Slug'],
                  ['authorName', 'Autor'],
                  ['coverImagePath', 'Capa / URL pública'],
                  ['shortDescription', 'Descrição curta'],
                  ['tags', 'Tags separadas por vírgula'],
                ].map(([key, label]) => (
                  <label key={key} className="block">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#747D79]">
                      {label}
                    </span>
                    <input
                      value={String(values[key as keyof CreatorState])}
                      onChange={(event) =>
                        setValues({
                          ...values,
                          [key]: event.target.value,
                        })
                      }
                      className="mt-2 min-h-12 w-full rounded-[18px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] px-4 text-sm font-semibold outline-none"
                    />
                  </label>
                ))}
              </div>

              <label className="mt-4 block">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#747D79]">
                  Sobre o tema
                </span>
                <textarea
                  value={values.longDescription}
                  onChange={(event) =>
                    setValues({
                      ...values,
                      longDescription: event.target.value,
                    })
                  }
                  className="mt-2 min-h-32 w-full rounded-[22px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] p-4 text-sm leading-6 outline-none"
                />
              </label>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#747D79]">
                    Categoria
                  </span>
                  <select
                    value={values.category}
                    onChange={(event) =>
                      setValues({
                        ...values,
                        category: event.target.value,
                      })
                    }
                    className="mt-2 min-h-12 w-full rounded-[18px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] px-4 text-sm font-semibold"
                  >
                    <option value="themes">Temas</option>
                    <option value="backgrounds">Backgrounds</option>
                    <option value="typography">Fontes</option>
                    <option value="icons">Ícones</option>
                    <option value="motion">Animações</option>
                    <option value="seasonal">Sazonais</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#747D79]">
                    Preço
                  </span>
                  <select
                    value={values.pricingModel}
                    onChange={(event) =>
                      setValues({
                        ...values,
                        pricingModel: event.target.value,
                      })
                    }
                    className="mt-2 min-h-12 w-full rounded-[18px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] px-4 text-sm font-semibold"
                  >
                    <option value="free">Gratuito</option>
                    <option value="subscription">Assinatura</option>
                    <option value="paid">Pago à parte</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#747D79]">
                    Valor em centavos
                  </span>
                  <input
                    type="number"
                    value={values.priceCents}
                    onChange={(event) =>
                      setValues({
                        ...values,
                        priceCents: Number(event.target.value),
                      })
                    }
                    className="mt-2 min-h-12 w-full rounded-[18px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] px-4 text-sm font-semibold"
                  />
                </label>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="iris-theme-card p-5">
                <div className="mb-5 flex items-center gap-2">
                  <Palette size={18} strokeWidth={1.8} />
                  <h2 className="text-sm font-semibold">Light mode</h2>
                </div>
                <div className="grid gap-4">
                  {colorFields('light', values, setValues)}
                </div>
              </section>

              <section className="iris-theme-card p-5">
                <div className="mb-5 flex items-center gap-2">
                  <Palette size={18} strokeWidth={1.8} />
                  <h2 className="text-sm font-semibold">Dark mode</h2>
                </div>
                <div className="grid gap-4">
                  {colorFields('dark', values, setValues)}
                </div>
              </section>
            </div>

            <section className="iris-theme-card p-5">
              <div className="mb-5 flex items-center gap-2">
                <Type size={18} strokeWidth={1.8} />
                <h2 className="text-sm font-semibold">Comportamento visual</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ['backgroundType', 'Background', ['plain', 'radial-soft', 'aurora-lilac', 'editorial-grid']],
                  ['fontStyle', 'Fonte', ['editorial', 'modern', 'soft', 'mono']],
                  ['radius', 'Radius', ['sharp', 'soft', 'dream']],
                  ['spacing', 'Espaçamento', ['compact', 'comfortable', 'airy']],
                  ['glass', 'Glass', ['none', 'soft', 'strong']],
                  ['motion', 'Movimento', ['reduced', 'balanced', 'expressive']],
                  ['backgroundAnimation', 'Animação de fundo', ['none', 'slow-aurora', 'grain', 'float']],
                ].map(([key, label, options]) => (
                  <label key={String(key)} className="block">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#747D79]">
                      {String(label)}
                    </span>
                    <select
                      value={String(values[key as keyof CreatorState])}
                      onChange={(event) =>
                        setValues({
                          ...values,
                          [key as keyof CreatorState]: event.target.value as never,
                        })
                      }
                      className="mt-2 min-h-12 w-full rounded-[18px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] px-4 text-sm font-semibold"
                    >
                      {(options as string[]).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>

              <label className="mt-5 flex items-center gap-3 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={values.backgroundAnimated}
                  onChange={(event) =>
                    setValues({
                      ...values,
                      backgroundAnimated: event.target.checked,
                    })
                  }
                />
                Background animado
              </label>
            </section>
          </section>

          <aside className="space-y-6 xl:sticky xl:top-8 xl:self-start">
            <section
              className="overflow-hidden rounded-[38px] border border-white/70 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.16)]"
              style={{
                background: `
                  radial-gradient(circle at 18% 18%, ${previewTokens.primary}, transparent 35%),
                  radial-gradient(circle at 82% 16%, ${previewTokens.accent}, transparent 35%),
                  linear-gradient(135deg, ${previewTokens.background}, ${previewTokens.accentSoft})
                `,
                color: previewTokens.text,
              }}
            >
              <div className="mb-5 flex justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setMode('light')}
                  className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-black"
                >
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => setMode('dark')}
                  className="rounded-full bg-black/70 px-4 py-2 text-sm font-semibold text-white"
                >
                  Dark
                </button>
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">
                Preview real
              </p>
              <h2 className="mt-3 font-display text-[3rem] leading-none tracking-[-0.07em]">
                {values.name}
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-6 opacity-75">
                {values.shortDescription}
              </p>

              <div
                className="mt-6 rounded-[28px] border p-5"
                style={{
                  borderColor: previewTokens.border,
                  background: previewTokens.surface,
                  color: previewTokens.text,
                }}
              >
                <p className="text-sm font-semibold">Card de exemplo</p>
                <p className="mt-2 text-sm leading-6" style={{ color: previewTokens.textMuted }}>
                  É assim que cards, textos e superfícies podem ficar no app.
                </p>
                <button
                  type="button"
                  className="mt-5 min-h-10 rounded-full px-5 text-sm font-semibold text-white"
                  style={{ background: previewTokens.primary }}
                >
                  Botão principal
                </button>
              </div>
            </section>

            <section className="iris-theme-card p-5">
              <div className="mb-4 flex items-center gap-2">
                <Eye size={18} strokeWidth={1.8} />
                <h2 className="text-sm font-semibold">JSON em tempo real</h2>
              </div>
              <pre className="max-h-[520px] overflow-auto rounded-[24px] bg-black p-4 text-xs leading-5 text-white">
{JSON.stringify(themeJson, null, 2)}
              </pre>
            </section>

            {result ? (
              <section className="rounded-[28px] border border-[var(--iris-color-border)] bg-[var(--iris-bg-soft)] p-5">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Check size={17} strokeWidth={1.8} />
                  {result}
                </div>
              </section>
            ) : null}
          </aside>
        </div>
      </div>
    </main>
  );
}
