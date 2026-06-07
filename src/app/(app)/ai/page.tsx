import Link from 'next/link';
import {
  ArrowLeft,
  Bot,
  Brain,
  ChevronRight,
  MessageCircle,
  Plug,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from 'lucide-react';

const aiAreas = [
  {
    title: 'Agentes',
    description:
      'Agentes especializados para memórias, criação, privacidade, contexto e automações.',
    href: '/ai/agents',
    icon: Bot,
    status: 'Preparado',
  },
  {
    title: 'Memória contextual',
    description:
      'Camada para a IA entender memórias, cartas, sonhos, preferências e histórico do usuário.',
    href: '/settings/account#dados',
    icon: Brain,
    status: 'Base interna',
  },
  {
    title: 'Chat IRIS',
    description:
      'Espaço conversacional para recomendações, criação de textos, organização e suporte.',
    href: '/iris',
    icon: MessageCircle,
    status: 'Ativo',
  },
  {
    title: 'Plugins',
    description:
      'Ferramentas internas e integrações externas que podem expandir as ações da IA.',
    href: '/settings/integrations',
    icon: Plug,
    status: 'Marketplace',
  },
];

export default function IrisAIPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] px-5 py-8 text-[#1B3A2E] sm:px-8 lg:px-12 lg:py-10">
      <div className="mx-auto w-full max-w-[1540px]">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/iris"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#DDE6DA] bg-white/70 px-4 text-sm font-semibold text-[#1B3A2E] transition hover:bg-white"
          >
            <ArrowLeft size={15} strokeWidth={1.8} />
            Voltar para IRIS
          </Link>

          <Link
            href="/settings/integrations"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#DDE6DA] bg-white/70 px-4 text-sm font-semibold text-[#476153] transition hover:bg-white hover:text-[#1B3A2E]"
          >
            <Plug size={15} strokeWidth={1.8} />
            Integrações
          </Link>
        </div>

        <section className="relative overflow-hidden rounded-[38px] border border-white/70 bg-[#111A16] p-6 text-white shadow-[0_32px_110px_rgba(15,21,18,0.20)] backdrop-blur-2xl sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_8%,rgba(154,124,167,0.30),transparent_30%),radial-gradient(circle_at_92%_16%,rgba(67,200,161,0.22),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.10),rgba(255,255,255,0.02))]" />

          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <div className="mb-8 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/76 backdrop-blur-md">
                  <Bot size={13} strokeWidth={1.8} />
                  IRIS AI
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/76 backdrop-blur-md">
                  <Sparkles size={13} strokeWidth={1.8} />
                  Inteligência pessoal
                </span>
              </div>

              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-white/48">
                Inteligência da IRIS
              </p>

              <h1 className="mt-3 max-w-4xl font-display text-[2.55rem] leading-[1.02] tracking-[-0.055em] sm:text-[3.6rem] lg:text-[4.4rem]">
                Uma IA para operar memórias, criação e contexto.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-white/68">
                Esta área centraliza agentes, plugins, memória contextual e futuras
                ferramentas inteligentes da IRIS.
              </p>
            </div>

            <div className="rounded-[30px] border border-white/12 bg-white/[0.08] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[#111A16]">
                  <WandSparkles size={24} strokeWidth={1.7} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Núcleo preparado
                  </p>
                  <p className="mt-1 text-sm text-white/60">
                    Agentes, plugins e contexto
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {['IA', 'Memória', 'Plugins'].map((item) => (
                  <div
                    key={item}
                    className="rounded-[18px] border border-white/10 bg-white/[0.06] p-3 text-center"
                  >
                    <p className="text-xs font-semibold text-white/72">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {aiAreas.map((area) => {
            const Icon = area.icon;

            return (
              <Link
                key={area.title}
                href={area.href}
                className="group flex min-h-[270px] flex-col rounded-[32px] border border-[#E2E7E3] bg-white/58 p-5 shadow-[0_18px_54px_rgba(27,58,46,0.06)] backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_24px_80px_rgba(27,58,46,0.10)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-[#1B3A2E] text-white">
                    <Icon size={21} strokeWidth={1.8} />
                  </div>

                  <span className="rounded-full border border-[#E2E7E3] bg-[#FFFDF8] px-3 py-1 text-xs font-semibold text-[#747D79]">
                    {area.status}
                  </span>
                </div>

                <div className="mt-6">
                  <h2 className="font-display text-[1.7rem] leading-none tracking-[-0.05em] text-[#1B3A2E]">
                    {area.title}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-[#747D79]">
                    {area.description}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-6 text-sm font-semibold text-[#1B3A2E]">
                  Abrir
                  <ChevronRight
                    size={16}
                    strokeWidth={1.8}
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </Link>
            );
          })}
        </section>

        <section className="mt-10 rounded-[36px] border border-[#E2E7E3] bg-white/52 p-6 shadow-[0_20px_70px_rgba(27,58,46,0.06)] backdrop-blur-xl lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
                Segurança e contexto
              </p>
              <h2 className="mt-2 font-display text-[2.2rem] leading-none tracking-[-0.055em] text-[#1B3A2E]">
                A IA deve agir apenas com permissão.
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[26px] border border-[#E2E7E3] bg-[#FFFDF8] p-5">
                <ShieldCheck size={20} strokeWidth={1.8} />
                <h3 className="mt-4 text-sm font-semibold text-[#1B3A2E]">
                  Permissões por área
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#747D79]">
                  Cada agente poderá ter acesso controlado a memórias, perfil,
                  integrações e histórico.
                </p>
              </div>

              <div className="rounded-[26px] border border-[#E2E7E3] bg-[#FFFDF8] p-5">
                <Brain size={20} strokeWidth={1.8} />
                <h3 className="mt-4 text-sm font-semibold text-[#1B3A2E]">
                  Contexto progressivo
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#747D79]">
                  A IRIS pode evoluir de chat para sistema com memória,
                  ferramentas e ações autorizadas.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
