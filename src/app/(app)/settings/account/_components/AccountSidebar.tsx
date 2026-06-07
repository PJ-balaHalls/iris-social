'use client';

import Link from 'next/link';
import {
  ArrowDownToLine,
  Bell,
  CalendarDays,
  Languages,
  LockKeyhole,
  Mail,
  Palette,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { IrisList, type IrisListItem } from '@/components/ui/IrisList';
import {
  downloadJson,
  formatDate,
  languageLabels,
  rawString,
  stringValue,
  type AccountKnowledgePayload,
  type AccountProfile,
} from '../_utils/accountSettings';

export function AccountSidebar({
  profile,
  email,
  completion,
  payload,
}: {
  profile: AccountProfile;
  email?: string | null;
  completion: number;
  payload: AccountKnowledgePayload;
}) {
  const accountTimelineItems: IrisListItem[] = [
    {
      id: 'email',
      title: 'E-mail de acesso',
      description: 'Usado para login e recuperação de senha.',
      value: stringValue(email),
      icon: <Mail size={17} strokeWidth={1.8} />,
    },
    {
      id: 'created',
      title: 'Entrada na IRIS',
      description: 'Quando sua conta foi criada.',
      value: formatDate(profile.created_at || payload.account.created_at),
      icon: <CalendarDays size={17} strokeWidth={1.8} />,
    },
    {
      id: 'language',
      title: 'Idioma',
      description: 'Preferência de leitura da interface.',
      value: languageLabels[rawString(profile.language)] || stringValue(profile.language),
      icon: <Languages size={17} strokeWidth={1.8} />,
    },
  ];

  return (
    <aside className="space-y-10 xl:sticky xl:top-8 xl:self-start">
      <IrisList
        eyebrow="Resumo"
        title="Estado da conta"
        description="Uma leitura rápida, sem transformar a página em painel."
        items={accountTimelineItems}
      />

      <section className="rounded-[30px] border border-[#E2E7E3] bg-white/55 p-5 backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DDE6DA] text-[#1B3A2E]">
            <ShieldCheck size={18} strokeWidth={1.8} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#1B3A2E]">
              Edição protegida
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#747D79]">
              Os campos ficam travados até você clicar em editar. Isso evita alterações acidentais.
            </p>
          </div>
        </div>

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#E2E7E3]">
          <div
            className="h-full rounded-full bg-[#1B3A2E]"
            style={{ width: `${completion}%` }}
          />
        </div>
      </section>

      <IrisList
        eyebrow="Atalhos"
        title="Outras configurações"
        description="Acesse áreas próximas da conta."
        items={[
          {
            id: 'profile',
            title: 'Perfil',
            description: 'Nome público, username e Identity Space.',
            href: '/settings/profile',
            icon: <UserRound size={17} strokeWidth={1.8} />,
          },
          {
            id: 'privacy',
            title: 'Privacidade',
            description: 'Visibilidade, descoberta e convites.',
            href: '/settings/privacy',
            icon: <LockKeyhole size={17} strokeWidth={1.8} />,
          },
          {
            id: 'appearance',
            title: 'Aparência',
            description: 'Tema, cor e densidade visual.',
            href: '/settings/appearance',
            icon: <Palette size={17} strokeWidth={1.8} />,
          },
          {
            id: 'notifications',
            title: 'Notificações',
            description: 'Alertas, e-mails e lembretes.',
            href: '/settings/notifications',
            icon: <Bell size={17} strokeWidth={1.8} />,
          },
        ]}
      />

      <IrisList
        eyebrow="Exportação"
        title="Baixar dados"
        description="Uma cópia local das informações visíveis desta área."
        items={[
          {
            id: 'download',
            title: 'Exportação JSON',
            description: 'A exportação completa pede confirmação na seção de transparência.',
            icon: <ArrowDownToLine size={17} strokeWidth={1.8} />,
            action: (
              <button
                type="button"
                onClick={() => downloadJson('iris-dados-resumo-conta.json', {
                  profile_summary: {
                    full_name: profile.full_name,
                    first_name: profile.first_name,
                    language: profile.language,
                    country: profile.country,
                  },
                  exported_at: new Date().toISOString(),
                })}
                className="rounded-full border border-[#C7CFCC] bg-white px-3 py-1.5 text-xs font-semibold text-[#1B3A2E] transition hover:bg-[#FAF7F2]"
              >
                Resumo
              </button>
            ),
          },
        ]}
      />
    </aside>
  );
}
