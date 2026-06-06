import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#FAF7F2] p-6 text-center text-[#1B3A2E]">
      <section className="max-w-2xl space-y-6">
        <p className="font-display text-5xl font-bold tracking-tight md:text-6xl">
          IRIS Social
        </p>

        <p className="text-xl leading-relaxed text-[#476153] md:text-2xl">
          Um espaço digital para organizar sua identidade, preservar memórias e
          cultivar vínculos profundos.
        </p>
      </section>

      <nav className="mt-12 flex w-full max-w-sm flex-col gap-4 md:flex-row">
        <Link
          href="/auth/register"
          className="inline-flex w-full items-center justify-center rounded-xl bg-[#006D4E] px-6 py-4 text-lg font-medium text-white transition-colors hover:bg-[#00563E] focus:outline-none focus:ring-2 focus:ring-[#9A7CA7] focus:ring-offset-2"
        >
          Criar minha conta
        </Link>

        <Link
          href="/auth/login"
          className="inline-flex w-full items-center justify-center rounded-xl border border-[#E2E7E3] bg-transparent px-6 py-4 text-lg font-medium text-[#1B3A2E] transition-colors hover:bg-[#F2F4F3] focus:outline-none focus:ring-2 focus:ring-[#9A7CA7] focus:ring-offset-2"
        >
          Entrar
        </Link>
      </nav>

      <footer className="absolute bottom-8 text-sm text-[#7A877F]">
        <nav className="flex gap-6">
          <Link href="/manifesto" className="hover:underline">
            Manifesto
          </Link>

          <Link href="/produto" className="hover:underline">
            Conceito
          </Link>

          <Link href="/planos" className="hover:underline">
            Planos
          </Link>
        </nav>
      </footer>
    </main>
  );
}