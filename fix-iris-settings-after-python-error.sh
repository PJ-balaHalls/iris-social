#!/usr/bin/env bash
set -euo pipefail

echo "==> IRIS: continuando setup sem Python"

# Corrige redirect final do onboarding para /iris
if [ -f "src/lib/actions/onboarding.actions.ts" ]; then
  sed -i \
    -e "s#redirect: '/app/home'#redirect: '/iris'#g" \
    -e 's#redirect: "/app/home"#redirect: "/iris"#g' \
    -e "s#return { success: true, redirect: '/app/home' };#return { success: true, redirect: '/iris' };#g" \
    -e 's#return { success: true, redirect: "/app/home" };#return { success: true, redirect: "/iris" };#g' \
    "src/lib/actions/onboarding.actions.ts"
fi

mkdir -p "src/app/iris"

cat > "src/app/iris/page.tsx" <<'TSX'
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Heart,
  Lock,
  Palette,
  Search,
  Settings,
  Sparkles,
} from 'lucide-react';

const LOGO_PATH = '/iris/brand/logotipo/svg/iris-logotipo-colorido.svg';

const modules = [
  {
    title: 'iLIFE',
    description: 'Memórias, diários, álbuns, cartas, sonhos e biblioteca pessoal.',
    href: '/ilife',
    icon: BookOpen,
  },
  {
    title: 'usLIFE',
    description: 'Espaços compartilhados para vínculos, cartas e registros afetivos.',
    href: '/uslife',
    icon: Heart,
  },
  {
    title: 'IRIS AI',
    description: 'Organização, reflexão, agentes e recomendações com privacidade.',
    href: '/ai',
    icon: Sparkles,
  },
  {
    title: 'Configurações',
    description: 'Conta, privacidade, segurança, aparência e acessibilidade.',
    href: '/settings',
    icon: Settings,
  },
];

const principles = [
  'Memória antes de métrica',
  'Privacidade por padrão',
  'Interface silenciosa',
  'Controle consciente',
];

export default function IrisPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#FAF7F2] text-[#1B3A2E]">
      <section className="relative flex min-h-screen flex-col px-5 py-6 sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(154,124,167,0.18),transparent_26%),radial-gradient(circle_at_88%_18%,rgba(0,109,78,0.14),transparent_28%),linear-gradient(180deg,#FAF7F2_0%,#FFFFFF_100%)]" />

        <header className="relative z-10 flex items-center justify-between gap-4">
          <Link href="/" aria-label="Voltar para início">
            <img src={LOGO_PATH} alt="IRIS" className="h-auto w-[76px]" />
          </Link>

          <nav className="hidden items-center gap-2 rounded-full border border-white/75 bg-white/45 px-2 py-2 text-sm font-semibold text-[#476153] shadow-sm backdrop-blur-md md:flex">
            <Link className="rounded-full px-4 py-2 transition hover:bg-white/70 hover:text-[#1B3A2E]" href="/ilife">
              iLIFE
            </Link>
            <Link className="rounded-full px-4 py-2 transition hover:bg-white/70 hover:text-[#1B3A2E]" href="/uslife">
              usLIFE
            </Link>
            <Link className="rounded-full px-4 py-2 transition hover:bg-white/70 hover:text-[#1B3A2E]" href="/ai">
              IRIS AI
            </Link>
            <Link className="rounded-full px-4 py-2 transition hover:bg-white/70 hover:text-[#1B3A2E]" href="/settings">
              Configurações
            </Link>
          </nav>

          <Link
            href="/settings"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-emerald-900/10 bg-white/55 px-4 text-sm font-semibold text-[#1B3A2E] shadow-sm backdrop-blur-md transition hover:bg-white"
          >
            Abrir app
          </Link>
        </header>

        <div className="relative z-10 grid flex-1 items-center gap-8 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/55 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#476153] shadow-sm backdrop-blur-md">
              <Sparkles size={14} strokeWidth={1.8} />
              Plataforma IRIS
            </div>

            <h1 className="mt-7 font-display text-[4.2rem] leading-[0.86] tracking-[-0.085em] text-[#1B3A2E] sm:text-[6.4rem] lg:text-[8.2rem]">
              Um espaço para lembrar com calma.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#476153] sm:text-xl">
              A IRIS organiza memórias, vínculos, cartas, sonhos e identidade em
              uma experiência limpa, privada e emocionalmente silenciosa.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/settings"
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-[20px] bg-[#1B3A2E] px-6 text-sm font-semibold text-white shadow-[0_18px_42px_rgba(27,58,46,0.20)] transition hover:-translate-y-0.5 hover:bg-[#0F1512]"
              >
                Entrar na IRIS
                <ArrowRight size={16} strokeWidth={1.8} />
              </Link>

              <Link
                href="/search"
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-[20px] border border-emerald-900/10 bg-white/55 px-6 text-sm font-semibold text-[#1B3A2E] shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white"
              >
                Explorar
                <Search size={16} strokeWidth={1.8} />
              </Link>
            </div>
          </div>

          <aside className="grid gap-4">
            <div className="rounded-[34px] border border-white/75 bg-white/45 p-5 shadow-[0_28px_90px_rgba(27,58,46,0.10)] backdrop-blur-xl sm:p-6">
              <div className="rounded-[28px] border border-emerald-900/10 bg-[#1B3A2E] p-6 text-white">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/55">
                      Manifesto
                    </p>
                    <h2 className="mt-3 font-display text-4xl leading-none tracking-[-0.055em]">
                      O tempo passa, mas o que sentimos permanece.
                    </h2>
                  </div>

                  <Lock className="shrink-0 text-white/70" size={28} strokeWidth={1.6} />
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {principles.map((item) => (
                    <div
                      key={item}
                      className="rounded-[20px] border border-white/10 bg-white/[0.08] p-4 text-sm font-semibold text-white/84"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {modules.map((module) => {
                const Icon = module.icon;

                return (
                  <Link
                    key={module.title}
                    href={module.href}
                    className="group rounded-[28px] border border-white/75 bg-white/45 p-5 shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/70 hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-[16px] border border-emerald-900/10 bg-white/60 text-[#1B3A2E]">
                      <Icon size={19} strokeWidth={1.8} />
                    </div>

                    <h3 className="mt-5 font-display text-3xl leading-none tracking-[-0.055em] text-[#1B3A2E]">
                      {module.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-[#476153]">
                      {module.description}
                    </p>

                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#006D4E]">
                      Abrir
                      <ArrowRight
                        className="transition-transform group-hover:translate-x-1"
                        size={15}
                        strokeWidth={1.8}
                      />
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="rounded-[28px] border border-white/75 bg-white/42 p-5 shadow-sm backdrop-blur-md">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[15px] bg-[#E9DDEE] text-[#1B3A2E]">
                  <Palette size={18} strokeWidth={1.8} />
                </span>

                <div>
                  <h2 className="font-display text-2xl leading-none tracking-[-0.045em]">
                    Entrada limpa, sem dados pessoais.
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#747D79]">
                    Esta tela não mostra perfil, username, plano, privacidade ou snapshot do onboarding.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
TSX

echo "==> Complemento aplicado com sucesso."
echo ""
echo "Verificando se ainda existe /app/home nos arquivos principais:"
grep -R "/app/home" -n src/lib src/app middleware.ts || true
echo ""
echo "Agora rode: npm run build"
