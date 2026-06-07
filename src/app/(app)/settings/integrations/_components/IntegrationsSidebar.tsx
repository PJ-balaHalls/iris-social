'use client';

import Link from 'next/link';
import {
  Braces,
  KeyRound,
  LockKeyhole,
  Plug,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { IrisList } from '@/components/ui/IrisList';
import type {
  IntegrationPlugin,
  IntegrationPreferences,
} from '../_utils/integrationsCatalog';

export function IntegrationsSidebar({
  preferences,
  preparedPlugins,
}: {
  preferences: IntegrationPreferences;
  preparedPlugins: IntegrationPlugin[];
}) {
  return (
    <aside className="space-y-10">
      <IrisList
        eyebrow="Preparados"
        title="Plugins ativos no painel"
        description="Eles ainda não conectam APIs reais; ficam salvos para ativação futura."
        items={
          preparedPlugins.length
            ? preparedPlugins.slice(0, 6).map((plugin) => ({
                id: plugin.id,
                title: plugin.name,
                description: plugin.description,
                value: plugin.kind === 'external' ? 'Pendente' : 'Pronto',
                icon: <Plug size={17} strokeWidth={1.8} />,
              }))
            : [
                {
                  id: 'empty',
                  title: 'Nenhum plugin preparado',
                  description:
                    'Escolha integrações no catálogo para montar seu painel.',
                  icon: <Plug size={17} strokeWidth={1.8} />,
                },
              ]
        }
      />

      <section className="rounded-[30px] border border-[#E2E7E3] bg-white/55 p-5 backdrop-blur-md">
        <h3 className="text-sm font-semibold text-[#1B3A2E]">
          Preferências rápidas
        </h3>

        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between gap-4 border-b border-[#E2E7E3] pb-4">
            <div>
              <p className="text-sm font-semibold text-[#1B3A2E]">
                Música ambiente
              </p>
              <p className="mt-1 text-sm text-[#747D79]">
                {preferences.autoMusic ? 'Preparada' : 'Desativada'}
              </p>
            </div>

            <div className="h-2 w-16 overflow-hidden rounded-full bg-[#E2E7E3]">
              <div
                className="h-full rounded-full bg-[#1B3A2E]"
                style={{ width: preferences.autoMusic ? '100%' : '0%' }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#1B3A2E]">
                Stories personalizados
              </p>
              <p className="mt-1 text-sm text-[#747D79]">
                {preferences.storyMode ? 'Preparado' : 'Desativado'}
              </p>
            </div>

            <div className="h-2 w-16 overflow-hidden rounded-full bg-[#E2E7E3]">
              <div
                className="h-full rounded-full bg-[#1B3A2E]"
                style={{ width: preferences.storyMode ? '100%' : '0%' }}
              />
            </div>
          </div>
        </div>
      </section>

      <IrisList
        eyebrow="Developer"
        title="Conectar com a IRIS"
        description="Atalhos para a futura camada de API e segurança."
        items={[
          {
            id: 'api',
            title: 'IRIS API',
            description: 'Apps externos conectados por escopos.',
            href: '/settings/integrations',
            icon: <Braces size={17} strokeWidth={1.8} />,
          },
          {
            id: 'security',
            title: 'Segurança',
            description: 'Sessões, 2FA e dispositivos.',
            href: '/settings/security',
            icon: <ShieldCheck size={17} strokeWidth={1.8} />,
          },
          {
            id: 'privacy',
            title: 'Privacidade',
            description: 'Controle exposição e permissões.',
            href: '/settings/privacy',
            icon: <LockKeyhole size={17} strokeWidth={1.8} />,
          },
          {
            id: 'account',
            title: 'Conta',
            description: 'Dados pessoais e exportação.',
            href: '/settings/account',
            icon: <UserRound size={17} strokeWidth={1.8} />,
          },
          {
            id: 'oauth',
            title: 'OAuth Apps',
            description: 'Clientes e permissões futuras.',
            href: '/settings/integrations',
            icon: <KeyRound size={17} strokeWidth={1.8} />,
          },
        ]}
      />

      <Link
        href="/settings"
        className="block rounded-[26px] border border-[#E2E7E3] bg-[#FFFDF8] p-5 text-sm font-semibold text-[#1B3A2E] transition hover:bg-white"
      >
        Voltar ao hub de configurações
      </Link>
    </aside>
  );
}
