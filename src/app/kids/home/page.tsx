import Link from 'next/link';

export default function KidsHomePage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] px-5 py-8 text-[#1B3A2E] sm:px-8 lg:px-12 lg:py-10">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/kids"
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#DDE6DA] bg-white/70 px-4 text-sm font-semibold text-[#1B3A2E] transition hover:bg-white"
          >
            Voltar para Kids
          </Link>

          <span className="rounded-full border border-[#E2E7E3] bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Home Kids
          </span>
        </div>

        <section className="rounded-[38px] border border-white/70 bg-white/50 p-6 shadow-[0_32px_110px_rgba(27,58,46,0.10)] backdrop-blur-2xl sm:p-8 lg:p-10">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#747D79]">
            Espaço seguro
          </p>

          <h1 className="mt-3 max-w-4xl font-display text-[2.45rem] leading-[1.02] tracking-[-0.055em] text-[#1B3A2E] sm:text-[3.4rem] lg:text-[4.1rem]">
            Conteúdo leve, protegido e supervisionado.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-[#476153]">
            Esta página está estabilizada para produção e pronta para receber os
            módulos reais do modo kids.
          </p>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            ['Memórias seguras', 'Registros protegidos para experiências infantis.'],
            ['Rotina', 'Espaço futuro para tarefas, lembretes e hábitos.'],
            ['Criatividade', 'Atividades, histórias e criação assistida.'],
          ].map(([title, description]) => (
            <article
              key={title}
              className="rounded-[28px] border border-[#E2E7E3] bg-white/55 p-5 shadow-[0_16px_48px_rgba(27,58,46,0.055)] backdrop-blur-md"
            >
              <h2 className="font-display text-[1.55rem] leading-none tracking-[-0.045em]">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#747D79]">
                {description}
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
