import Link from 'next/link';
import {
  ArrowLeft,
  Fingerprint,
  KeyRound,
  ShieldCheck,
  UserRound,
} from 'lucide-react';

export function SecurityHeader({
  score,
  questionsCount,
}: {
  score: number;
  questionsCount: number;
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
          href="/settings/account"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#DDE6DA] bg-white/70 px-4 text-sm font-semibold text-[#476153] transition hover:bg-white hover:text-[#1B3A2E]"
        >
          <UserRound size={15} strokeWidth={1.8} />
          Conta
        </Link>
      </div>

      <div className="relative overflow-hidden rounded-[38px] border border-white/70 bg-[#111A16] p-6 text-white shadow-[0_32px_110px_rgba(15,21,18,0.20)] backdrop-blur-2xl sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_8%,rgba(154,124,167,0.30),transparent_30%),radial-gradient(circle_at_92%_16%,rgba(67,200,161,0.22),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.10),rgba(255,255,255,0.02))]" />

        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <div className="mb-8 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/76 backdrop-blur-md">
                <KeyRound size={13} strokeWidth={1.8} />
                Senha, 2FA e sessões
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/76 backdrop-blur-md">
                <Fingerprint size={13} strokeWidth={1.8} />
                Memórias de acesso
              </span>
            </div>

            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-white/48">
              Segurança
            </p>

            <h1 className="mt-3 max-w-4xl font-display text-[2.45rem] leading-[1.02] tracking-[-0.055em] sm:text-[3.4rem] lg:text-[4.1rem]">
              Proteja a entrada sem perder a delicadeza da IRIS.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/68">
              Configure troca de conta, memórias de acesso, sessões, dispositivos
              e camadas extras de proteção.
            </p>
          </div>

          <div className="rounded-[30px] border border-white/12 bg-white/[0.08] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[#111A16]">
                <ShieldCheck size={24} strokeWidth={1.7} />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Score de proteção
                </p>
                <p className="mt-1 text-sm text-white/60">
                  {questionsCount}/3 memórias configuradas
                </p>
              </div>
            </div>

            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/14">
              <div
                className="h-full rounded-full bg-white"
                style={{ width: `${score}%` }}
              />
            </div>

            <p className="mt-3 text-xs leading-5 text-white/55">
              Proteção estimada em {score}%.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
