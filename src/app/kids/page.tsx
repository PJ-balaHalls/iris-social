import Link from 'next/link';

export default function KidsPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] px-5 py-8 text-[#1B3A2E] sm:px-8 lg:px-12 lg:py-10">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/iris"
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#DDE6DA] bg-white/70 px-4 text-sm font-semibold text-[#1B3A2E] transition hover:bg-white"
          >
            Voltar para IRIS
          </Link>

          <span className="rounded-full border border-[#E2E7E3] bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Kids
          </span>
        </div>

        <section className="relative overflow-hidden rounded-[38px] border border-white/70 bg-white/45 p-6 shadow-[0_32px_110px_rgba(27,58,46,0.11)] backdrop-blur-2xl sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_8%,rgba(154,124,167,0.20),transparent_30%),radial-gradient(circle_at_92%_16%,rgba(0,109,78,0.16),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.66),rgba(255,253,248,0.30))]" />

          <div className="relative max-w-4xl">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#747D79]">
              IRIS Kids
            </p>

            <h1 className="mt-3 font-display text-[2.45rem] leading-[1.02] tracking-[-0.055em] text-[#1B3A2E] sm:text-[3.4rem] lg:text-[4.1rem]">
              Uma experiência protegida para perfis infantis.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[#476153]">
              Esta área está preparada para receber o fluxo kids da IRIS, com proteção,
              supervisão de responsáveis e uma experiência mais segura.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          <Link
            href="/kids/home"
            className="rounded-[30px] border border-[#E2E7E3] bg-white/55 p-6 shadow-[0_16px_48px_rgba(27,58,46,0.055)] backdrop-blur-md transition hover:bg-white"
          >
            <h2 className="font-display text-[1.8rem] leading-none tracking-[-0.045em]">
              Espaço Kids
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#747D79]">
              Página inicial segura para a experiência infantil.
            </p>
          </Link>

          <Link
            href="/kids/guardian"
            className="rounded-[30px] border border-[#E2E7E3] bg-white/55 p-6 shadow-[0_16px_48px_rgba(27,58,46,0.055)] backdrop-blur-md transition hover:bg-white"
          >
            <h2 className="font-display text-[1.8rem] leading-none tracking-[-0.045em]">
              Responsável
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#747D79]">
              Área para consentimento, supervisão e controle parental.
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
}
