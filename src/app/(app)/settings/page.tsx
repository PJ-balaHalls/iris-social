import Link from 'next/link';
import {
  Accessibility,
  ArrowRight,
  Baby,
  BadgeCheck,
  Bell,
  Brain,
  ChevronRight,
  Compass,
  CreditCard,
  Database,
  EyeOff,
  Languages,
  LockKeyhole,
  MonitorSmartphone,
  Palette,
  Plug,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
  type LucideIcon,
} from 'lucide-react';

type SettingStatus = 'ready' | 'recommended' | 'planned' | 'sensitive';

type SettingOption = {
  key: string;
  title: string;
  subtitle: string;
  description: string;
  group: string;
  href: string;
  icon: LucideIcon;
  status: SettingStatus;
};

const settingsOptions: SettingOption[] = [
  {
    key: 'account',
    title: 'Conta',
    subtitle: 'Dados centrais da conta',
    description: 'Nome, e-mail, nascimento, país, idioma e informações principais.',
    group: 'Conta',
    href: '/settings/account',
    icon: UserRound,
    status: 'ready',
  },
  {
    key: 'profile',
    title: 'Perfil',
    subtitle: 'Identity Space',
    description: 'Nome público, username, bio, avatar, capa e presença social.',
    group: 'Perfil',
    href: '/settings/profile',
    icon: BadgeCheck,
    status: 'ready',
  },
  {
    key: 'privacy',
    title: 'Privacidade',
    subtitle: 'Visibilidade e limites',
    description: 'Controle quem pode ver, encontrar, chamar e convidar você.',
    group: 'Privacidade',
    href: '/settings/privacy',
    icon: LockKeyhole,
    status: 'recommended',
  },
  {
    key: 'security',
    title: 'Segurança',
    subtitle: 'Senha e sessões',
    description: 'Sessões, dispositivos, alertas, senha e proteção da conta.',
    group: 'Privacidade',
    href: '/settings/security',
    icon: ShieldCheck,
    status: 'sensitive',
  },
  {
    key: 'appearance',
    title: 'Aparência',
    subtitle: 'Tema e interface',
    description: 'Tema claro, escuro, seguir sistema, destaque visual e densidade.',
    group: 'Experiência',
    href: '/settings/appearance',
    icon: Palette,
    status: 'ready',
  },
  {
    key: 'accessibility',
    title: 'Acessibilidade',
    subtitle: 'Leitura confortável',
    description: 'Fonte, dislexia, contraste, movimento reduzido e navegação.',
    group: 'Experiência',
    href: '/settings/accessibility',
    icon: Accessibility,
    status: 'ready',
  },
  {
    key: 'language',
    title: 'Idioma',
    subtitle: 'Região e localização',
    description: 'Idioma principal, país, região e fuso horário.',
    group: 'Experiência',
    href: '/settings/language',
    icon: Languages,
    status: 'ready',
  },
  {
    key: 'integrations',
    title: 'Integrações',
    subtitle: 'Serviços conectados',
    description: 'Spotify, fotos, iCloud, Google Fotos, bibliotecas e importações.',
    group: 'Dados',
    href: '/settings/integrations',
    icon: Plug,
    status: 'planned',
  },
  {
    key: 'subscription',
    title: 'Assinatura',
    subtitle: 'Plano e cobrança',
    description: 'Plano atual, recursos, histórico e preferências de assinatura.',
    group: 'Produto',
    href: '/settings/subscription',
    icon: CreditCard,
    status: 'ready',
  },
  {
    key: 'data-export',
    title: 'Dados',
    subtitle: 'Exportação e portabilidade',
    description: 'Exportar dados, revisar consentimentos e baixar informações.',
    group: 'Dados',
    href: '/settings/data-export',
    icon: Database,
    status: 'planned',
  },
  {
    key: 'sensitive-content',
    title: 'Conteúdo sensível',
    subtitle: 'Filtros e proteção',
    description: 'Controle de conteúdos adultos, filtros e restrições.',
    group: 'Risco',
    href: '/settings/sensitive-content',
    icon: EyeOff,
    status: 'sensitive',
  },
  {
    key: 'kids',
    title: 'IRIS Kids',
    subtitle: 'Ambiente protegido',
    description: 'Responsáveis, restrições, contatos aprovados e proteção.',
    group: 'Produto',
    href: '/settings/kids',
    icon: Baby,
    status: 'planned',
  },
  {
    key: 'devices',
    title: 'Dispositivos',
    subtitle: 'Acessos ativos',
    description: 'Sessões, aparelhos conectados e dispositivos confiáveis.',
    group: 'Privacidade',
    href: '/settings/devices',
    icon: MonitorSmartphone,
    status: 'planned',
  },
  {
    key: 'personality',
    title: 'Personalidade',
    subtitle: 'Preferências do onboarding',
    description: 'Traços, escolhas e sinais usados para personalização.',
    group: 'Onboarding',
    href: '/settings/personality',
    icon: Brain,
    status: 'recommended',
  },
  {
    key: 'culture',
    title: 'Cultura',
    subtitle: 'Gostos e repertório',
    description: 'Livros, filmes, músicas, temas, hobbies e lugares afetivos.',
    group: 'Onboarding',
    href: '/settings/culture',
    icon: Sparkles,
    status: 'recommended',
  },
  {
    key: 'intention',
    title: 'Intenção',
    subtitle: 'Objetivo de uso',
    description: 'Memórias, diário, conexões, usLIFE, IA e comunidades.',
    group: 'Onboarding',
    href: '/settings/intention',
    icon: Compass,
    status: 'recommended',
  },
  {
    key: 'notifications',
    title: 'Notificações',
    subtitle: 'Alertas e lembretes',
    description: 'Push, e-mail, lembretes, mensagens e modo silencioso.',
    group: 'Sistema',
    href: '/settings/notifications',
    icon: Bell,
    status: 'planned',
  },
];

const quickSettings = settingsOptions.slice(0, 16);

const onboardingSettings = settingsOptions.filter((option) =>
  [
    'profile',
    'personality',
    'culture',
    'intention',
    'privacy',
    'accessibility',
    'integrations',
    'subscription',
  ].includes(option.key),
);

const groups = Array.from(new Set(settingsOptions.map((option) => option.group)));

function StatusBadge({ status }: { status: SettingStatus }) {
  const label = {
    ready: 'Disponível',
    recommended: 'Recomendado',
    planned: 'Planejado',
    sensitive: 'Sensível',
  }[status];

  return (
    <span className="rounded-full border border-emerald-900/10 bg-[#F2F4F3] px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#747D79]">
      {label}
    </span>
  );
}

export default function SettingsPage() {
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
          {quickSettings.map((option) => {
            const Icon = option.icon;

            return (
              <Link
                key={option.key}
                href={option.href}
                className="group min-h-[158px] rounded-[26px] border border-white/75 bg-white/45 p-5 shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/70 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-[16px] border border-emerald-950/10 bg-white/60 text-[#1B3A2E]">
                  <Icon size={19} strokeWidth={1.8} />
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
            );
          })}
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
              Cada etapa importante do onboarding agora tem uma configuração própria.
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
                    {String(index + 1).padStart(2, '0')}
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
            {groups.map((group) => (
              <article
                key={group}
                className="rounded-[30px] border border-white/75 bg-white/42 p-5 shadow-sm backdrop-blur-md sm:p-6"
              >
                <div className="border-b border-emerald-900/10 pb-5">
                  <div className="inline-flex items-center rounded-full border border-emerald-950/10 bg-white/50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#747D79]">
                    {group}
                  </div>
                </div>

                <div className="mt-4 divide-y divide-emerald-900/10">
                  {settingsOptions
                    .filter((option) => option.group === group)
                    .map((option) => {
                      const Icon = option.icon;

                      return (
                        <Link
                          key={option.key}
                          href={option.href}
                          className="group flex items-center gap-4 py-4"
                        >
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] border border-white/80 bg-white/55 text-[#1B3A2E] shadow-sm">
                            <Icon size={18} strokeWidth={1.8} />
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-[#1B3A2E]">
                                {option.title}
                              </span>

                              <StatusBadge status={option.status} />
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
                      );
                    })}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}