'use client';

import type { ComponentType } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Circle,
  Cloud,
  CreditCard,
  Download,
  EyeOff,
  Globe2,
  Heart,
  Home,
  Laptop,
  Lock,
  Palette,
  Search,
  Settings,
  Shield,
  Sparkles,
  Trash2,
  User,
  Users,
} from 'lucide-react';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import {
  onboardingSteps,
  settingsGroups,
  settingsShortcuts,
  type SettingsShortcut,
} from '../_data/settingsData';

type IconComponent = ComponentType<{
  className?: string;
  size?: number;
  strokeWidth?: number;
}>;

const iconRegistry: Record<string, IconComponent> = {
  bell: Bell,
  book: BookOpen,
  cloud: Cloud,
  credit: CreditCard,
  download: Download,
  eye: EyeOff,
  globe: Globe2,
  heart: Heart,
  home: Home,
  laptop: Laptop,
  lock: Lock,
  palette: Palette,
  search: Search,
  settings: Settings,
  shield: Shield,
  sparkles: Sparkles,
  trash: Trash2,
  user: User,
  users: Users,
};

const toneClasses: Record<SettingsShortcut['tone'], string> = {
  forest: 'bg-iris-forest text-white border-iris-forest/20',
  emerald: 'bg-emerald-500 text-white border-emerald-500/20',
  lilac: 'bg-emotion-500 text-white border-emotion-500/20',
  sand: 'bg-iris-sand text-iris-forest border-iris-sand',
  mist: 'bg-iris-mist text-iris-forest border-iris-mist',
  rose: 'bg-iris-rose text-iris-forest border-iris-rose',
};

function hasValue(value: unknown) {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === 'object') return Object.keys(value).length > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  return Boolean(value);
}

function SettingsIcon({
  name,
  className = '',
  size = 18,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  const Icon = iconRegistry[name] ?? Settings;
  return <Icon className={className} size={size} strokeWidth={1.8} />;
}

function HeroSettingsCard() {
  return (
    <section className="relative overflow-hidden rounded-[34px] border border-white/80 bg-white/45 shadow-[0_28px_90px_rgba(27,58,46,0.10)] backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(154,124,167,0.18),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(0,109,78,0.16),transparent_30%)]" />

      <div className="relative grid min-h-[320px] gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch">
        <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/55 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#476153]">
              <Settings size={14} strokeWidth={1.8} />
              Central de configuração
            </div>

            <h1 className="mt-6 max-w-2xl font-display text-5xl leading-[0.95] tracking-[-0.07em] text-[#1B3A2E] sm:text-6xl lg:text-7xl">
              Ajuste a IRIS para cuidar melhor da sua história.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-[#476153] sm:text-lg">
              Uma página única para revisar conta, privacidade, segurança,
              aparência, acessibilidade, integrações e o progresso do onboarding.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/settings/account"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[18px] bg-[#1B3A2E] px-5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(27,58,46,0.18)] transition-all duration-base hover:-translate-y-0.5 hover:bg-[#0F1512]"
            >
              Revisar conta
              <ArrowRight size={16} strokeWidth={1.8} />
            </Link>

            <Link
              href="/settings/privacy"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[18px] border border-emerald-900/10 bg-white/55 px-5 text-sm font-semibold text-[#1B3A2E] transition-all duration-base hover:-translate-y-0.5 hover:bg-white"
            >
              Privacidade
              <Lock size={16} strokeWidth={1.8} />
            </Link>
          </div>
        </div>

        <div className="relative min-h-[240px] overflow-hidden rounded-b-[34px] border-t border-white/80 bg-[#F2F4F3] sm:min-h-[320px] lg:m-4 lg:rounded-[28px] lg:border">
          <img
            src="/iris/brand/cards/settings.png"
            alt="Card visual da central de configurações IRIS"
            className="h-full min-h-[240px] w-full object-cover object-center sm:min-h-[320px]"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1B3A2E]/34 to-transparent p-5">
            <div className="inline-flex rounded-full bg-white/70 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#1B3A2E] backdrop-blur">
              Preferências vivas
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShortcutGrid() {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {settingsShortcuts.map((shortcut) => (
        <Link
          key={shortcut.title}
          href={shortcut.href}
          className="group min-h-[168px] rounded-[26px] border border-white/75 bg-white/45 p-5 shadow-sm backdrop-blur-md transition-all duration-base hover:-translate-y-1 hover:bg-white/70 hover:shadow-md"
        >
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-[16px] border ${toneClasses[shortcut.tone]}`}
          >
            <SettingsIcon name={shortcut.icon} size={19} />
          </div>

          <div className="mt-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl leading-none tracking-[-0.045em] text-[#1B3A2E]">
                {shortcut.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#476153]">
                {shortcut.description}
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
  );
}

function OnboardingProgressPanel() {
  const onboardingState = useOnboardingStore();
  const stateRecord = onboardingState as unknown as Record<string, unknown>;

  const completedSteps = onboardingSteps.filter((step) =>
    step.requiredKeys.every((key) => hasValue(stateRecord[key]))
  );

  const percent = Math.round((completedSteps.length / onboardingSteps.length) * 100);

  return (
    <section className="grid gap-4 lg:grid-cols-[0.72fr_1.28fr]">
      <div className="rounded-[30px] border border-white/75 bg-[#1B3A2E] p-6 text-white shadow-[0_24px_80px_rgba(27,58,46,0.18)]">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/60">
          Onboarding
        </p>

        <h2 className="mt-3 font-display text-4xl leading-[0.95] tracking-[-0.055em]">
          {percent}% da sua base preenchida.
        </h2>

        <p className="mt-4 text-sm leading-6 text-white/72">
          Este resumo cruza as respostas salvas no onboarding com os campos
          usados pela Account no banco. Ele ajuda a encontrar lacunas sem expor
          informações pessoais na tela.
        </p>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/14">
          <div
            className="h-full rounded-full bg-white transition-all duration-emotional"
            style={{ width: `${percent}%` }}
          />
        </div>

        <Link
          href="/onboarding/basic-info?edit=1"
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-[16px] bg-white px-4 text-sm font-semibold text-[#1B3A2E] transition-all hover:-translate-y-0.5"
        >
          Rever onboarding
          <ArrowRight size={15} strokeWidth={1.8} />
        </Link>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {onboardingSteps.map((step, index) => {
          const done = step.requiredKeys.every((key) => hasValue(stateRecord[key]));

          return (
            <Link
              key={step.title}
              href={step.href}
              className="group rounded-[24px] border border-white/75 bg-white/45 p-4 backdrop-blur-md transition-all duration-base hover:bg-white/70"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-900/10 bg-white/60 text-sm font-semibold text-[#1B3A2E]">
                  {done ? (
                    <CheckCircle2 className="text-[#006D4E]" size={17} strokeWidth={1.9} />
                  ) : (
                    String(index + 1).padStart(2, '0')
                  )}
                </span>

                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-[#1B3A2E]">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-[#747D79]">
                    {step.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function SettingsOptionsList() {
  return (
    <section className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
            Todas as opções
          </p>
          <h2 className="mt-2 font-display text-4xl leading-none tracking-[-0.055em] text-[#1B3A2E]">
            Configurações completas.
          </h2>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/45 px-4 py-2 text-xs font-semibold text-[#476153] backdrop-blur-md">
          <Circle size={8} fill="currentColor" strokeWidth={0} />
          Modelo SPA
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {settingsGroups.map((group) => (
          <article
            key={group.title}
            className="rounded-[30px] border border-white/75 bg-white/42 p-5 shadow-sm backdrop-blur-md sm:p-6"
          >
            <div className="border-b border-emerald-900/10 pb-5">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
                {group.eyebrow}
              </p>

              <h3 className="mt-2 font-display text-3xl leading-none tracking-[-0.05em] text-[#1B3A2E]">
                {group.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#476153]">
                {group.description}
              </p>
            </div>

            <div className="mt-4 divide-y divide-emerald-900/10">
              {group.options.map((option) => (
                <Link
                  key={option.title}
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

                      {option.status && (
                        <span className="rounded-full border border-emerald-900/10 bg-[#F2F4F3] px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#747D79]">
                          {option.status}
                        </span>
                      )}
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
  );
}

export function SettingsHomePage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] px-4 py-5 text-[#1B3A2E] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-5 sm:gap-6">
        <HeroSettingsCard />
        <ShortcutGrid />
        <OnboardingProgressPanel />
        <SettingsOptionsList />
      </div>
    </main>
  );
}
