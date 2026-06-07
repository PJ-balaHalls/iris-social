'use client';

import Link from 'next/link';
import {
  KeyRound,
  LockKeyhole,
  LogOut,
  MonitorSmartphone,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { IrisList } from '@/components/ui/IrisList';
import { signOutForAccountSwitchAction } from '@/lib/actions/security.actions';
import type { SecurityPreferences } from '../_utils/securitySettings';

export function SecuritySidebar({
  preferences,
  questionsCount,
  devicesCount,
  sessionsCount,
}: {
  preferences: SecurityPreferences;
  questionsCount: number;
  devicesCount: number;
  sessionsCount: number;
}) {
  return (
    <aside className="space-y-10 xl:sticky xl:top-8 xl:self-start">
      <IrisList
        eyebrow="Resumo"
        title="Proteção ativa"
        description="Camadas principais do acesso."
        items={[
          {
            id: 'memory',
            title: 'Memórias de acesso',
            description: 'Perguntas afetivas ou pessoais configuradas.',
            value: `${questionsCount}/3`,
            icon: <KeyRound size={17} strokeWidth={1.8} />,
          },
          {
            id: 'two-factor',
            title: '2FA',
            description: 'Camada extra de autenticação.',
            value: preferences.require_2fa ? 'Ativo' : 'Pendente',
            icon: <ShieldCheck size={17} strokeWidth={1.8} />,
          },
          {
            id: 'devices',
            title: 'Dispositivos',
            description: 'Aparelhos reconhecidos pela IRIS.',
            value: devicesCount,
            icon: <MonitorSmartphone size={17} strokeWidth={1.8} />,
          },
          {
            id: 'sessions',
            title: 'Sessões',
            description: 'Sessões avançadas registradas.',
            value: sessionsCount,
            icon: <LockKeyhole size={17} strokeWidth={1.8} />,
          },
        ]}
      />

      <section className="rounded-[30px] border border-[#E2E7E3] bg-white/55 p-5 backdrop-blur-md">
        <h3 className="text-sm font-semibold text-[#1B3A2E]">Trocar conta</h3>
        <p className="mt-2 text-sm leading-6 text-[#747D79]">
          Sai da conta atual e volta para o login. Use quando precisar acessar outro perfil.
        </p>

        <form action={signOutForAccountSwitchAction} className="mt-5">
          <button
            type="submit"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#1B3A2E] px-5 text-sm font-semibold text-white transition hover:bg-[#0F1512]"
          >
            <LogOut size={15} strokeWidth={1.8} />
            Sair e trocar conta
          </button>
        </form>
      </section>

      <IrisList
        eyebrow="Atalhos"
        title="Configurações próximas"
        description="Áreas que trabalham junto com segurança."
        items={[
          {
            id: 'account',
            title: 'Conta',
            description: 'Dados pessoais e exportação.',
            href: '/settings/account',
            icon: <UserRound size={17} strokeWidth={1.8} />,
          },
          {
            id: 'privacy',
            title: 'Privacidade',
            description: 'Exposição, descoberta e interações.',
            href: '/settings/privacy',
            icon: <LockKeyhole size={17} strokeWidth={1.8} />,
          },
          {
            id: 'devices',
            title: 'Dispositivos',
            description: 'Acessos e aparelhos conectados.',
            href: '/settings/devices',
            icon: <MonitorSmartphone size={17} strokeWidth={1.8} />,
          },
        ]}
      />

      <Link
        href="/auth/login"
        className="block rounded-[26px] border border-[#E2E7E3] bg-[#FFFDF8] p-5 text-sm font-semibold text-[#1B3A2E] transition hover:bg-white"
      >
        Entrar com outra conta sem sair automaticamente
      </Link>
    </aside>
  );
}
