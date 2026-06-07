import Link from 'next/link';
import {
  ArrowLeft,
  Bot,
  Brain,
  ChevronRight,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from 'lucide-react';

const agents = [
  {
    id: 'memory-orchestrator',
    title: 'Orquestrador de Memórias',
    description:
      'Agente preparado para organizar lembranças, álbuns, cartas e linha do tempo.',
    icon: Brain,
    status: 'Preparado',
  },
  {
    id: 'creative-writer',
    title: 'Escritor Criativo',
    description:
      'Agente para cartas, textos íntimos, legendas, histórias e experiências narrativas.',
    icon: WandSparkles,
    status: 'Beta',
  },
  {
    id: 'iris-companion',
    title: 'Companheiro IRIS',
    description:
      'Agente conversacional para suporte emocional, rotina, contexto e recomendações.',
    icon: MessageCircle,
    status: 'Preparado',
  },
  {
    id: 'privacy-guardian',
    title: 'Guardião de Privacidade',
    description:
      'Agente para revisar permissões, dados sensíveis, integrações e exposição.',
    icon: ShieldCheck,
    status: 'Planejado',
  },
];

export default function AgentsPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] px-5 py-8 text-[#1B3A2E] sm:px-8 lg:px-12 lg:py-10">
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/ai"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#DDE6DA] bg-white/70 px-4 text-sm font-semibold text-[#1B3A2E] transition hover:bg-white"
          >
            <ArrowLeft size={15} strokeWidth={1.8} />
            Voltar para IA
          </Link>

          <span className="rounded-full border border-[#E2E7E3] bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Agentes
          </span>
        </div>

        <section className="relative overflow-hidden rounded-[38px] border border-white/70 bg-white/45 p-6 shadow-[0_32px_110px_rgba(27,58,46,0.11)] backdrop-blur-2xl sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_8%,rgba(154,124,167,0.20),transparent_30%),radial-gradient(circle_at_92%_16%,rgba(0,109,78,0.16),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.66),rgba(255,253,248,0.30))]" />

          <div className="relative max-w-4xl">
            <div className="mb-8 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/50 px-3 py-1.5 text-xs font-medium text-[#476153] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-md">
                <Bot size={13} strokeWidth={1.8} />
                IRIS AI
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/50 px-3 py-1.5 text-xs font-medium text-[#476153] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-md">
                <Sparkles size={13} strokeWidth={1.8} />
                Agentes especializados
              </span>
            </div>

            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#747D79]">
              Agentes da IRIS
            </p>

            <h1 className="mt-3 font-display text-[2.55rem] leading-[1.02] tracking-[-0.055em] text-[#1B3A2E] sm:text-[3.6rem] lg:text-[4.4rem]">
              Uma camada de agentes para operar memórias, criação e contexto.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[#476153]">
              Esta área lista os agentes preparados para a IRIS. Cada agente poderá
              ter ferramentas, permissões, integrações e histórico próprio.
            </p>
          </div>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {agents.map((agent) => {
            const Icon = agent.icon;

            return (
              <Link
                key={agent.id}
                href={`/ai/agents/${agent.id}`}
                className="group flex min-h-[260px] flex-col rounded-[32px] border border-[#E2E7E3] bg-white/58 p-5 shadow-[0_18px_54px_rgba(27,58,46,0.06)] backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_24px_80px_rgba(27,58,46,0.10)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-[#1B3A2E] text-white">
                    <Icon size={21} strokeWidth={1.8} />
                  </div>

                  <span className="rounded-full border border-[#E2E7E3] bg-[#FFFDF8] px-3 py-1 text-xs font-semibold text-[#747D79]">
                    {agent.status}
                  </span>
                </div>

                <div className="mt-6">
                  <h2 className="font-display text-[1.7rem] leading-none tracking-[-0.05em] text-[#1B3A2E]">
                    {agent.title}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-[#747D79]">
                    {agent.description}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-6 text-sm font-semibold text-[#1B3A2E]">
                  Abrir agente
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
      </div>
    </main>
  );
}
