import Link from 'next/link';
import { ArrowLeft, FileText, LockKeyhole, Settings } from 'lucide-react';
import {
  getInitials,
  stringValue,
  type AccountProfile,
} from '../_utils/accountSettings';

function QuietPill({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/50 px-3 py-1.5 text-xs font-medium text-[#476153] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-md">
      {icon}
      {children}
    </span>
  );
}

export function AccountHeader({
  profile,
  email,
  completion,
}: {
  profile: AccountProfile;
  email?: string | null;
  completion: number;
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
          href="/settings/privacy"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#DDE6DA] bg-white/70 px-4 text-sm font-semibold text-[#476153] transition hover:bg-white hover:text-[#1B3A2E]"
        >
          <Settings size={15} strokeWidth={1.8} />
          Privacidade
        </Link>
      </div>

      <div className="relative overflow-hidden rounded-[38px] border border-white/70 bg-white/45 p-6 shadow-[0_32px_110px_rgba(27,58,46,0.11)] backdrop-blur-2xl sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_8%,rgba(154,124,167,0.18),transparent_30%),radial-gradient(circle_at_92%_16%,rgba(0,109,78,0.15),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.66),rgba(255,253,248,0.30))]" />

        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <div className="mb-8 flex flex-wrap gap-2">
              <QuietPill icon={<LockKeyhole size={13} strokeWidth={1.8} />}>
                Dados ocultos por padrão
              </QuietPill>
              <QuietPill icon={<FileText size={13} strokeWidth={1.8} />}>
                Exportação com confirmação
              </QuietPill>
            </div>

            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#747D79]">
              Conta
            </p>

            <h1 className="mt-3 max-w-4xl font-display text-[2.45rem] leading-[1.02] tracking-[-0.055em] text-[#1B3A2E] sm:text-[3.4rem] lg:text-[4.1rem]">
              Dados pessoais com menos exposição e mais controle.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[#476153]">
              As informações da conta aparecem recolhidas. Abra apenas o que precisa
              revisar, edite com intenção e exporte dados somente quando fizer sentido.
            </p>
          </div>

          <div className="rounded-[30px] border border-white/75 bg-white/54 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#1B3A2E] font-display text-xl font-semibold text-white">
                {getInitials(profile.full_name || profile.first_name)}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#1B3A2E]">
                  {stringValue(profile.full_name || profile.first_name, 'Conta IRIS')}
                </p>
                <p className="mt-1 truncate text-sm text-[#747D79]">
                  {stringValue(email)}
                </p>
              </div>
            </div>

            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#E2E7E3]">
              <div
                className="h-full rounded-full bg-[#1B3A2E]"
                style={{ width: `${completion}%` }}
              />
            </div>

            <p className="mt-3 text-xs leading-5 text-[#747D79]">
              Base essencial {completion}% preenchida.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
