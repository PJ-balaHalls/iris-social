'use client';

import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowDownToLine,
  ChevronDown,
  Eye,
  EyeOff,
  FileText,
  Fingerprint,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import {
  downloadJson,
  getKnownProfileFields,
  getObjectSize,
  maskValue,
  type AccountKnowledgePayload,
} from '../_utils/accountSettings';
import { AccountInfoDisclosure } from './AccountInfoDisclosure';

type AccountKnowledgePanelProps = {
  payload: AccountKnowledgePayload;
};

type KnowledgeSection = {
  id: string;
  title: string;
  description: string;
  count: number;
  icon: React.ReactNode;
  data: Record<string, unknown> | null;
};

function KnowledgeStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[28px] border border-[#E2E7E3] bg-white/60 p-5 shadow-[0_18px_48px_rgba(27,58,46,0.055)] backdrop-blur-md xl:p-6">
      <p className="font-display text-[2.35rem] leading-none tracking-[-0.06em] text-[#1B3A2E] xl:text-[2.8rem]">
        {value}
      </p>
      <p className="mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#747D79]">
        {label}
      </p>
    </div>
  );
}

function KnowledgeSectionCard({
  section,
  open,
  revealSensitive,
  onToggle,
}: {
  section: KnowledgeSection;
  open: boolean;
  revealSensitive: boolean;
  onToggle: () => void;
}) {
  const entries = Object.entries(section.data || {}).filter(([, value]) => {
    if (value === null || value === undefined || value === '') return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value as Record<string, unknown>).length > 0;
    return true;
  });

  return (
    <div className="border-b border-[#E2E7E3] py-5 last:border-b-0 xl:py-6">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-5 text-left"
      >
        <span className="flex gap-4">
          <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/72 text-[#1B3A2E] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            {section.icon}
          </span>

          <span>
            <span className="block text-base font-semibold text-[#1B3A2E]">
              {section.title}
            </span>
            <span className="mt-2 block max-w-3xl text-sm leading-6 text-[#747D79]">
              {section.description}
            </span>
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-3">
          <span className="rounded-full border border-[#E2E7E3] bg-white/65 px-3 py-1 text-xs font-semibold text-[#476153]">
            {section.count}
          </span>
          <ChevronDown
            size={18}
            strokeWidth={1.8}
            className={open ? 'rotate-180 text-[#1B3A2E] transition' : 'text-[#9AA4A1] transition'}
          />
        </span>
      </button>

      {open ? (
        <div className="mt-5 rounded-[28px] border border-[#E2E7E3] bg-[#FFFDF8] p-5 xl:p-6">
          {entries.length ? (
            <div className="space-y-4">
              {entries.map(([key, value]) => (
                <div
                  key={key}
                  className="grid gap-2 border-b border-[#E2E7E3] pb-4 last:border-b-0 last:pb-0 sm:grid-cols-[240px_1fr]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#747D79]">
                    {key.replaceAll('_', ' ')}
                  </p>
                  <p className="min-w-0 break-words text-sm font-medium leading-6 text-[#1B3A2E]">
                    {revealSensitive ? (
                      typeof value === 'object' ? (
                        `${Object.keys(value as Record<string, unknown>).length} campos`
                      ) : (
                        String(value)
                      )
                    ) : (
                      maskValue(key, value)
                    )}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#747D79]">Nada salvo nessa categoria.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}

export function AccountKnowledgePanel({ payload }: AccountKnowledgePanelProps) {
  const [transparencyOpen, setTransparencyOpen] = useState(true);
  const [openSection, setOpenSection] = useState('profile');
  const [revealSensitive, setRevealSensitive] = useState(false);
  const [confirmExport, setConfirmExport] = useState(false);

  const profileFields = useMemo(() => getKnownProfileFields(payload.profile), [payload.profile]);

  const sections: KnowledgeSection[] = [
    {
      id: 'account',
      title: 'Conta de acesso',
      description: 'Dados usados para autenticação, sessão e recuperação.',
      count: getObjectSize(payload.account),
      icon: <Fingerprint size={18} strokeWidth={1.8} />,
      data: payload.account,
    },
    {
      id: 'profile',
      title: 'Perfil IRIS',
      description: 'Informações salvas na sua base de perfil e onboarding.',
      count: profileFields.length,
      icon: <UserRound size={18} strokeWidth={1.8} />,
      data: payload.profile,
    },
    {
      id: 'subscription',
      title: 'Assinatura',
      description: 'Plano, ciclo e status de assinatura quando existir.',
      count: getObjectSize(payload.subscription),
      icon: <FileText size={18} strokeWidth={1.8} />,
      data: payload.subscription,
    },
    {
      id: 'privacy',
      title: 'Metadados e permissões',
      description: 'Dados internos de app/auth vinculados ao funcionamento da conta.',
      count: getObjectSize(payload.account.app_metadata) + getObjectSize(payload.account.user_metadata),
      icon: <ShieldCheck size={18} strokeWidth={1.8} />,
      data: {
        app_metadata: payload.account.app_metadata || {},
        user_metadata: payload.account.user_metadata || {},
      },
    },
  ];

  return (
    <section id="dados" className="mt-24 scroll-mt-8 border-t border-[#E2E7E3] pt-14 xl:mt-28 xl:pt-16">
      <AccountInfoDisclosure
        eyebrow="Transparência"
        title="O que a IRIS sabe sobre você"
        description="As informações aparecem protegidas por padrão. Abra as categorias para revisar sem expor tudo de uma vez."
        open={transparencyOpen}
        onToggle={() => setTransparencyOpen((current) => !current)}
      >
        <div className="grid gap-12 xl:grid-cols-[0.72fr_1.28fr] xl:gap-16 xl:items-start">
          <div className="rounded-[32px] border border-[#E2E7E3] bg-white/56 p-6 shadow-[0_24px_80px_rgba(27,58,46,0.07)] backdrop-blur-xl xl:p-8">
            <div className="flex items-start gap-4">
              <AlertTriangle
                size={20}
                strokeWidth={1.8}
                className="mt-0.5 shrink-0 text-[#7A5A1B]"
              />
              <div>
                <h3 className="text-base font-semibold text-[#1B3A2E]">
                  Exportação contém dados sensíveis
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#747D79]">
                  Baixe somente em dispositivo confiável. O arquivo JSON pode conter
                  dados de perfil, autenticação, preferências e histórico de conta.
                  A visualização abaixo mascara valores sensíveis por padrão.
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-4">
              <button
                type="button"
                onClick={() => setRevealSensitive((value) => !value)}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#C7CFCC] bg-white/74 px-5 text-sm font-semibold text-[#1B3A2E] transition hover:bg-white"
              >
                {revealSensitive ? (
                  <EyeOff size={16} strokeWidth={1.8} />
                ) : (
                  <Eye size={16} strokeWidth={1.8} />
                )}
                {revealSensitive ? 'Ocultar valores sensíveis' : 'Mostrar valores sensíveis'}
              </button>

              <label className="flex items-start gap-3 rounded-[24px] border border-[#E2E7E3] bg-[#FFFDF8] p-5">
                <input
                  type="checkbox"
                  checked={confirmExport}
                  onChange={(event) => setConfirmExport(event.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#1B3A2E]"
                />
                <span className="text-sm leading-7 text-[#476153]">
                  Entendo que a exportação pode conter dados pessoais e vou salvar
                  o arquivo em um local seguro.
                </span>
              </label>

              <button
                type="button"
                disabled={!confirmExport}
                onClick={() => downloadJson('iris-dados-da-conta.json', payload)}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1B3A2E] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0F1512] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
              >
                <ArrowDownToLine size={16} strokeWidth={1.8} />
                Baixar exportação completa
              </button>
            </div>
          </div>

          <div>
            <div className="grid gap-4 sm:grid-cols-3">
              <KnowledgeStat label="campos de perfil" value={profileFields.length} />
              <KnowledgeStat label="categorias" value={sections.length} />
              <KnowledgeStat label="assinatura" value={payload.subscription ? 'sim' : 'não'} />
            </div>

            <div className="mt-6 rounded-[34px] border border-[#E2E7E3] bg-white/56 p-6 shadow-[0_24px_80px_rgba(27,58,46,0.065)] backdrop-blur-xl xl:p-8">
              {sections.map((section) => (
                <KnowledgeSectionCard
                  key={section.id}
                  section={section}
                  revealSensitive={revealSensitive}
                  open={openSection === section.id}
                  onToggle={() =>
                    setOpenSection((current) => (current === section.id ? '' : section.id))
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </AccountInfoDisclosure>
    </section>
  );
}
