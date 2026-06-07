'use client';

import { Check, LockKeyhole } from 'lucide-react';
import { IrisSwitch } from '@/components/ui/IrisSwitch';
import { SecurityDisclosure } from './SecurityDisclosure';
import {
  boolLabel,
  type SecurityPreferences,
  type SecuritySectionKey,
} from '../_utils/securitySettings';

function toggleSection(
  current: SecuritySectionKey,
  target: Exclude<SecuritySectionKey, ''>,
  onChange: (section: SecuritySectionKey) => void,
) {
  onChange(current === target ? '' : target);
}

function ReadLine({
  title,
  description,
  active,
}: {
  title: string;
  description: string;
  active: boolean;
}) {
  return (
    <div className="grid gap-3 border-b border-[#E2E7E3] py-5 last:border-b-0 sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <p className="text-sm font-semibold text-[#1B3A2E]">{title}</p>
        <p className="mt-1 text-sm leading-6 text-[#747D79]">{description}</p>
      </div>

      <span
        className={[
          'inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold',
          active
            ? 'border-[#DDE6DA] bg-[#F2F7F3] text-[#1B3A2E]'
            : 'border-[#E2E7E3] bg-white/60 text-[#747D79]',
        ].join(' ')}
      >
        {active ? (
          <Check size={13} strokeWidth={1.8} />
        ) : (
          <LockKeyhole size={13} strokeWidth={1.8} />
        )}
        {boolLabel(active)}
      </span>
    </div>
  );
}

function EditLine({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="border-b border-[#E2E7E3] py-5 last:border-b-0">
      <IrisSwitch
        checked={checked}
        onChange={onChange}
        label={title}
        description={description}
      />
    </div>
  );
}

export function SecurityReadPreferences({
  preferences,
  openSection,
  onOpenSectionChange,
}: {
  preferences: SecurityPreferences;
  openSection: SecuritySectionKey;
  onOpenSectionChange: (section: SecuritySectionKey) => void;
}) {
  return (
    <div className="space-y-2">
      <SecurityDisclosure
        eyebrow="Entrada"
        title="Login, alertas e troca de conta"
        description="Abra para revisar alertas, troca de conta e revisão de sessões."
        open={openSection === 'access'}
        onToggle={() => toggleSection(openSection, 'access', onOpenSectionChange)}
      >
        <div className="border-t border-[#E2E7E3]">
          <ReadLine
            title="Alertas de login"
            description="Avisa quando houver entrada ou tentativa relevante na conta."
            active={preferences.login_alerts_enabled}
          />
          <ReadLine
            title="Troca de conta com confirmação"
            description="Exige confirmação antes de sair e entrar em outra conta."
            active={preferences.account_switch_requires_confirmation}
          />
          <ReadLine
            title="Revisão de sessão"
            description="Marca sessões para revisão manual quando houver sinal estranho."
            active={preferences.session_review_required}
          />
        </div>
      </SecurityDisclosure>

      <SecurityDisclosure
        eyebrow="2FA"
        title="Autenticação em duas etapas"
        description="Abra para revisar se a camada extra de autenticação está exigida."
        open={openSection === 'two-factor'}
        onToggle={() => toggleSection(openSection, 'two-factor', onOpenSectionChange)}
      >
        <div className="border-t border-[#E2E7E3]">
          <ReadLine
            title="Exigir 2FA"
            description="Solicita uma segunda camada de segurança quando disponível no provedor de autenticação."
            active={preferences.require_2fa}
          />
        </div>
      </SecurityDisclosure>

      <SecurityDisclosure
        eyebrow="Dispositivos"
        title="Dispositivos confiáveis"
        description="Abra para revisar se dispositivos confiáveis podem ser usados."
        open={openSection === 'devices'}
        onToggle={() => toggleSection(openSection, 'devices', onOpenSectionChange)}
      >
        <div className="border-t border-[#E2E7E3]">
          <ReadLine
            title="Permitir dispositivos confiáveis"
            description="Mantém uma lista de aparelhos reconhecidos para reduzir fricção em acessos seguros."
            active={preferences.trusted_devices_enabled}
          />
        </div>
      </SecurityDisclosure>
    </div>
  );
}

export function SecurityEditPreferences({
  preferences,
  onChange,
  openSection,
  onOpenSectionChange,
}: {
  preferences: SecurityPreferences;
  onChange: (preferences: SecurityPreferences) => void;
  openSection: SecuritySectionKey;
  onOpenSectionChange: (section: SecuritySectionKey) => void;
}) {
  function setValue(key: keyof SecurityPreferences, value: boolean | number) {
    onChange({
      ...preferences,
      [key]: value,
    });
  }

  return (
    <div className="space-y-2">
      <input
        type="hidden"
        name="memory_access_enabled"
        value={String(preferences.memory_access_enabled)}
      />
      <input
        type="hidden"
        name="memory_access_max_attempts"
        value={String(preferences.memory_access_max_attempts)}
      />
      <input
        type="hidden"
        name="require_2fa"
        value={String(preferences.require_2fa)}
      />
      <input
        type="hidden"
        name="login_alerts_enabled"
        value={String(preferences.login_alerts_enabled)}
      />
      <input
        type="hidden"
        name="trusted_devices_enabled"
        value={String(preferences.trusted_devices_enabled)}
      />
      <input
        type="hidden"
        name="session_review_required"
        value={String(preferences.session_review_required)}
      />
      <input
        type="hidden"
        name="account_switch_requires_confirmation"
        value={String(preferences.account_switch_requires_confirmation)}
      />

      <SecurityDisclosure
        eyebrow="Entrada"
        title="Editar login, alertas e troca de conta"
        description="Abra para ajustar alertas, troca de conta e revisão de sessões."
        open={openSection === 'access'}
        onToggle={() => toggleSection(openSection, 'access', onOpenSectionChange)}
      >
        <div className="border-t border-[#E2E7E3]">
          <EditLine
            title="Alertas de login"
            description="Receber avisos quando a conta tiver entrada relevante."
            checked={preferences.login_alerts_enabled}
            onChange={(value) => setValue('login_alerts_enabled', value)}
          />
          <EditLine
            title="Troca de conta com confirmação"
            description="Pedir confirmação antes de sair para entrar em outra conta."
            checked={preferences.account_switch_requires_confirmation}
            onChange={(value) =>
              setValue('account_switch_requires_confirmation', value)
            }
          />
          <EditLine
            title="Revisão de sessão"
            description="Marcar sessões para revisão quando houver comportamento estranho."
            checked={preferences.session_review_required}
            onChange={(value) => setValue('session_review_required', value)}
          />
        </div>
      </SecurityDisclosure>

      <SecurityDisclosure
        eyebrow="2FA"
        title="Editar autenticação em duas etapas"
        description="Abra para exigir uma segunda camada de autenticação."
        open={openSection === 'two-factor'}
        onToggle={() => toggleSection(openSection, 'two-factor', onOpenSectionChange)}
      >
        <div className="border-t border-[#E2E7E3]">
          <EditLine
            title="Exigir 2FA"
            description="Quando a autenticação em duas etapas estiver configurada, exigir no acesso."
            checked={preferences.require_2fa}
            onChange={(value) => setValue('require_2fa', value)}
          />
        </div>
      </SecurityDisclosure>

      <SecurityDisclosure
        eyebrow="Dispositivos"
        title="Editar dispositivos confiáveis"
        description="Abra para ativar ou pausar o uso de dispositivos reconhecidos."
        open={openSection === 'devices'}
        onToggle={() => toggleSection(openSection, 'devices', onOpenSectionChange)}
      >
        <div className="border-t border-[#E2E7E3]">
          <EditLine
            title="Permitir dispositivos confiáveis"
            description="Usar aparelhos reconhecidos como parte da camada de segurança."
            checked={preferences.trusted_devices_enabled}
            onChange={(value) => setValue('trusted_devices_enabled', value)}
          />
        </div>
      </SecurityDisclosure>
    </div>
  );
}
