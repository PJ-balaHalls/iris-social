import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Circle,
  Settings,
} from 'lucide-react';
import {
  onboardingSettings,
  quickSettings,
  settingsGroups,
  settingsOptions,
} from '@/lib/settings/settingsCatalog';
import { SettingsIcon } from './SettingsIcon';

export function SettingsHubPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] px-4 py-5 text-[#1B3A2E] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-5">
        <section className="relative overflow-hidden rounded-[34px] border border-white/80 bg-white/45 shadow-[0_28px_90px_rgba(27,58,46,0.10)] backdrop-blur-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(154,124,167,0.18),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(0,109,78,0.16),transparent_30%)]" />

          <div className="relative grid min-h-[320px] gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
            <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/55 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#476153]">
                  <Settings size={14} strokeWidth={1.8} />
                  Central de configuração
                </div>

                <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[0.95] tracking-[-0.07em] text-[#1B3A2E] sm:text-6xl lg:text-7xl">
                  Ajuste cada parte da IRIS no seu próprio lugar.
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-[#476153] sm:text-lg">
                  A página principal funciona como hub. Conta, privacidade,
                  segurança, acessibilidade, idioma, onboarding e dados ficam em
                  rotas separadas.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/settings/account"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[18px] bg-[#1B3A2E] px-5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(27,58,46,0.18)] transition hover:-translate-y-0.5 hover:bg-[#0F1512]"
                >
                  Abrir conta
                  <ArrowRight size={16} strokeWidth={1.8} />
                </Link>

                <Link
                  href="/settings/privacy"
                  className="inline-flex min-h-12 items-center justify-center rounded-[18px] border border-emerald-900/10 bg-white/55 px-5 text-sm font-semibold text-[#1B3A2E] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  Privacidade
                </Link>
              </div>
            </div>

            <div className="relative min-h-[240px] overflow-hidden rounded-b-[34px] border-t border-white/80 bg-[#F2F4F3] sm:min-h-[320px] lg:m-4 lg:rounded-[28px] lg:border">
              <img
                src="/iris/brand/cards/settings.png"
                alt="Card visual de configurações da IRIS"
                className="h-full min-h-[240px] w-full object-cover object-center sm:min-h-[320px]"
              />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickSettings.map((option) => (
            <Link
              key={option.key}
              href={option.href}
              className="group min-h-[158px] rounded-[26px] border border-white/75 bg-white/45 p-5 shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/70 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-[16px] border border-emerald-950/10 bg-white/60 text-[#1B3A2E]">
                <SettingsIcon name={option.icon} size={19} />
              </div>

              <div className="mt-5 flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl leading-none tracking-[-0.045em] text-[#1B3A2E]">
                    {option.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[#476153]">
                    {option.subtitle}
                  </p>
                </div>

                <ChevronRight
                  className="mt-1 shrink-0 text-[#9AA4A1] transition-transform group-hover:translate-x-1 group-hover:text-[#1B3A2E]"
                  size={18}
                  strokeWidth={1.8}
                />
              </div>
            </Link>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="rounded-[30px] border border-white/75 bg-[#1B3A2E] p-6 text-white shadow-[0_24px_80px_rgba(27,58,46,0.18)]">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/60">
              Onboarding
            </p>

            <h2 className="mt-3 font-display text-4xl leading-[0.95] tracking-[-0.055em]">
              Ajustes pós-onboarding.
            </h2>

            <p className="mt-4 text-sm leading-6 text-white/72">
              Cada etapa importante do onboarding agora tem uma configuração
              própria.
            </p>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/14">
              <div className="h-full w-2/3 rounded-full bg-white" />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {onboardingSettings.map((option, index) => (
              <Link
                key={option.key}
                href={option.href}
                className="rounded-[24px] border border-white/75 bg-white/45 p-4 backdrop-blur-md transition hover:bg-white/70"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-900/10 bg-white/60 text-sm font-semibold text-[#1B3A2E]">
                    {index < 3 ? (
                      <CheckCircle2
                        className="text-[#006D4E]"
                        size={17}
                        strokeWidth={1.9}
                      />
                    ) : (
                      String(index + 1).padStart(2, '0')
                    )}
                  </span>

                  <div>
                    <h3 className="text-sm font-semibold text-[#1B3A2E]">
                      {option.title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-[#747D79]">
                      {option.subtitle}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
              Todas as opções
            </p>
            <h2 className="mt-2 font-display text-4xl leading-none tracking-[-0.055em] text-[#1B3A2E]">
              Configurações completas.
            </h2>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {settingsGroups.map((group) => (
              <article
                key={group}
                className="rounded-[30px] border border-white/75 bg-white/42 p-5 shadow-sm backdrop-blur-md sm:p-6"
              >
                <div className="border-b border-emerald-900/10 pb-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-950/10 bg-white/50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#747D79]">
                    <Circle size={7} fill="currentColor" strokeWidth={0} />
                    {group}
                  </div>
                </div>

                <div className="mt-4 divide-y divide-emerald-900/10">
                  {settingsOptions
                    .filter((option) => option.group === group)
                    .map((option) => (
                      <Link
                        key={option.key}
                        href={option.href}
                        className="group flex items-center gap-4 py-4"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] border border-white/80 bg-white/55 text-[#1B3A2E] shadow-sm">
                          <SettingsIcon name={option.icon} size={18} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-[#1B3A2E]">
                              {option.title}
                            </span>

                            <span className="rounded-full border border-emerald-900/10 bg-[#F2F4F3] px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#747D79]">
                              {option.status}
                            </span>
                          </span>

                          <span className="mt-1 block text-sm leading-6 text-[#747D79]">
                            {option.description}
                          </span>
                        </span>

                        <ChevronRight
                          className="shrink-0 text-[#9AA4A1] transition-transform group-hover:translate-x-1 group-hover:text-[#1B3A2E]"
                          size={18}
                          strokeWidth={1.8}
                        />
                      </Link>
                    ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}