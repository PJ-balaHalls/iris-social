import Link from 'next/link';
import { ArrowLeft, Braces, Plug, Sparkles } from 'lucide-react';

export function IntegrationsHeader({
  preparedCount,
  totalCount,
}: {
  preparedCount: number;
  totalCount: number;
}) {
  return (
    <header className="mb-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/settings"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#DDE6DA] bg-white/70 px-4 text-sm font-semibold text-[#1B3A2E] transition hover:bg-white"
        >
          <ArrowLeft size={15} strokeWidth={1.8} />
          Voltar para configurações
        </Link>

        <Link
          href="/settings/data-export"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#DDE6DA] bg-white/70 px-4 text-sm font-semibold text-[#476153] transition hover:bg-white hover:text-[#1B3A2E]"
        >
          <Braces size={15} strokeWidth={1.8} />
          Dados e API
        </Link>
      </div>

      <div className="relative overflow-hidden rounded-[38px] border border-white/70 bg-white/45 p-6 shadow-[0_32px_110px_rgba(27,58,46,0.11)] backdrop-blur-2xl sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_8%,rgba(154,124,167,0.20),transparent_30%),radial-gradient(circle_at_92%_16%,rgba(0,109,78,0.16),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.66),rgba(255,253,248,0.30))]" />

        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
          <div>
            <div className="mb-8 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/50 px-3 py-1.5 text-xs font-medium text-[#476153] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-md">
                <Plug size={13} strokeWidth={1.8} />
                Marketplace de plugins
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/50 px-3 py-1.5 text-xs font-medium text-[#476153] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-md">
                <Sparkles size={13} strokeWidth={1.8} />
                Pronto para APIs futuras
              </span>
            </div>

            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#747D79]">
              Integrações
            </p>

            <h1 className="mt-3 max-w-4xl font-display text-[2.45rem] leading-[1.02] tracking-[-0.055em] text-[#1B3A2E] sm:text-[3.4rem] lg:text-[4.1rem]">
              Uma loja de conexões para expandir a IRIS.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[#476153]">
              Prepare integrações internas, apps externos e nossa API para conectar
              a IRIS a música, stories, filmes, fotos, produtividade e outros apps.
            </p>
          </div>

          <div className="rounded-[30px] border border-white/75 bg-white/54 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-xl">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-display text-[3rem] leading-none tracking-[-0.07em] text-[#1B3A2E]">
                  {preparedCount}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
                  preparados
                </p>
              </div>

              <div>
                <p className="font-display text-[3rem] leading-none tracking-[-0.07em] text-[#1B3A2E]">
                  {totalCount}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
                  plugins
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-[#747D79]">
              Preparar não conecta OAuth ainda. Apenas salva a intenção e deixa a
              UI pronta para a integração real.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
