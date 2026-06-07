'use client';

import { Bell, Database, LockKeyhole, MonitorSmartphone, ShieldCheck, UserRound } from 'lucide-react';
import { IrisList } from '@/components/ui/IrisList';
import {
  getPrivacyStats,
  privacyLevelLabels,
  type PrivacyData,
  type PrivacyLevel,
} from '../_utils/privacySettings';

export function PrivacySidebar({
  level,
  data,
  completion,
}: {
  level: PrivacyLevel;
  data: PrivacyData;
  completion: number;
}) {
  const stats = getPrivacyStats(data);

  return (
    <aside className="space-y-10 xl:sticky xl:top-8 xl:self-start">
      <IrisList
        eyebrow="Resumo"
        title="Estado de privacidade"
        description="Uma leitura rápida das suas escolhas principais."
        items={[
          {
            id: 'level',
            title: 'Nível geral',
            description: 'Base usada para interpretar exposição e descoberta.',
            value: privacyLevelLabels[level],
            icon: <ShieldCheck size={17} strokeWidth={1.8} />,
          },
          {
            id: 'exposure',
            title: 'Pontos visíveis',
            description: 'Controles que ampliam sua presença social.',
            value: stats.exposure,
            icon: <UserRound size={17} strokeWidth={1.8} />,
          },
          {
            id: 'protection',
            title: 'Proteções',
            description: 'Controles que reduzem contato indesejado.',
            value: stats.protection,
            icon: <LockKeyhole size={17} strokeWidth={1.8} />,
          },
        ]}
      />

      <section className="rounded-[30px] border border-[#E2E7E3] bg-white/55 p-5 backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DDE6DA] text-[#1B3A2E]">
            <LockKeyhole size={18} strokeWidth={1.8} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#1B3A2E]">
              Revisão consciente
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#747D79]">
              As categorias ficam recolhidas. Abrir uma seção fecha as demais para evitar exposição excessiva.
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
        description="Áreas próximas de privacidade e segurança."
        items={[
          {
            id: 'account',
            title: 'Conta',
            description: 'Dados pessoais e exportação da conta.',
            href: '/settings/account',
            icon: <UserRound size={17} strokeWidth={1.8} />,
          },
          {
            id: 'security',
            title: 'Segurança',
            description: 'Sessões, senha e dispositivos confiáveis.',
            href: '/settings/security',
            icon: <ShieldCheck size={17} strokeWidth={1.8} />,
          },
          {
            id: 'sensitive',
            title: 'Conteúdo sensível',
            description: 'Filtros e restrições de conforto.',
            href: '/settings/sensitive-content',
            icon: <LockKeyhole size={17} strokeWidth={1.8} />,
          },
          {
            id: 'devices',
            title: 'Dispositivos',
            description: 'Acessos ativos e aparelhos conectados.',
            href: '/settings/devices',
            icon: <MonitorSmartphone size={17} strokeWidth={1.8} />,
          },
          {
            id: 'notifications',
            title: 'Notificações',
            description: 'Alertas, e-mails e lembretes.',
            href: '/settings/notifications',
            icon: <Bell size={17} strokeWidth={1.8} />,
          },
          {
            id: 'data',
            title: 'Dados e exportação',
            description: 'Portabilidade e revisão de dados.',
            href: '/settings/data-export',
            icon: <Database size={17} strokeWidth={1.8} />,
          },
        ]}
      />
    </aside>
  );
}
