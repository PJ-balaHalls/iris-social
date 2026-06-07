import Link from 'next/link';
import { ArrowLeft, Bot, Sparkles, Wrench } from 'lucide-react';

type AgentDetailsPageProps = {
  params: {
    id: string;
  };
};

export default function AgentDetailsPage({ params }: AgentDetailsPageProps) {
  const agentId = decodeURIComponent(params.id);

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-5 py-8 text-[#1B3A2E] sm:px-8 lg:px-12 lg:py-10">
      <div className="mx-auto w-full max-w-[1320px]">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/ai"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#DDE6DA] bg-white/70 px-4 text-sm font-semibold text-[#1B3A2E] transition hover:bg-white"
          >
            <ArrowLeft size={15} strokeWidth={1.8} />
            Voltar para IA
          </Link>

          <span className="rounded-full border border-[#E2E7E3] bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Agente
          </span>
        </div>

        <section className="relative overflow-hidden rounded-[38px] border border-white/70 bg-white/45 p-6 shadow-[0_32px_110px_rgba(27,58,46,0.11)] backdrop-blur-2xl sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_8%,rgba(154,124,167,0.20),transparent_30%),radial-gradient(circle_at_92%_16%,rgba(0,109,78,0.16),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.66),rgba(255,253,248,0.30))]" />

          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <div className="mb-8 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/50 px-3 py-1.5 text-xs font-medium text-[#476153] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-md">
                  <Bot size={13} strokeWidth={1.8} />
                  IRIS AI
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/50 px-3 py-1.5 text-xs font-medium text-[#476153] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-md">
                  <Sparkles size={13} strokeWidth={1.8} />
                  Agente preparado
                </span>
              </div>

              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#747D79]">
                Agente IRIS
              </p>

              <h1 className="mt-3 max-w-4xl font-display text-[2.45rem] leading-[1.02] tracking-[-0.055em] text-[#1B3A2E] sm:text-[3.4rem] lg:text-[4.1rem]">
                {agentId}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-[#476153]">
                Esta página está preparada para receber os detalhes completos do agente,
                ferramentas, permissões, histórico e integrações da IA.
              </p>
            </div>

            <div className="rounded-[30px] border border-white/75 bg-white/54 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#1B3A2E] text-white">
                  <Wrench size={23} strokeWidth={1.7} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#1B3A2E]">
                    Página técnica
                  </p>
                  <p className="mt-1 text-sm text-[#747D79]">
                    Estrutura pronta para evolução
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-[22px] border border-[#E2E7E3] bg-[#FFFDF8] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
                  ID do agente
                </p>
                <p className="mt-2 break-words text-sm font-semibold text-[#1B3A2E]">
                  {agentId}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              title: 'Ferramentas',
              description: 'Lista de plugins, ações e capacidades disponíveis para este agente.',
            },
            {
              title: 'Permissões',
              description: 'Controle de acesso a memórias, integrações, dados e contexto do usuário.',
            },
            {
              title: 'Histórico',
              description: 'Registro futuro de execuções, conversas e automações realizadas.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[30px] border border-[#E2E7E3] bg-white/55 p-5 shadow-[0_16px_48px_rgba(27,58,46,0.055)] backdrop-blur-md"
            >
              <h2 className="font-display text-[1.6rem] leading-none tracking-[-0.045em] text-[#1B3A2E]">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#747D79]">
                {item.description}
              </p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
