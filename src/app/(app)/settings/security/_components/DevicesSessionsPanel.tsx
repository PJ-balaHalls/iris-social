'use client';

import { MonitorSmartphone, Power, Radio, ShieldCheck } from 'lucide-react';
import { revokeSecurityDeviceAction } from '@/lib/actions/security.actions';
import { SecurityDisclosure } from './SecurityDisclosure';
import {
  formatDateTime,
  getDeviceLabel,
  type SecurityDevice,
  type SecuritySectionKey,
  type SecuritySession,
} from '../_utils/securitySettings';

export function DevicesSessionsPanel({
  devices,
  sessions,
  currentUserAgent,
  openSection,
  onOpenSectionChange,
}: {
  devices: SecurityDevice[];
  sessions: SecuritySession[];
  currentUserAgent?: string | null;
  openSection: SecuritySectionKey;
  onOpenSectionChange: (section: SecuritySectionKey) => void;
}) {
  return (
    <section className="mt-2">
      <SecurityDisclosure
        eyebrow="Dispositivos"
        title="Dispositivos conectados"
        description="Veja aparelhos reconhecidos, confiança e últimos acessos."
        open={openSection === 'devices'}
        onToggle={() =>
          onOpenSectionChange(openSection === 'devices' ? '' : 'devices')
        }
      >
        <div className="rounded-[30px] border border-[#E2E7E3] bg-white/56 p-5 backdrop-blur-md xl:p-6">
          {devices.length ? (
            <div className="divide-y divide-[#E2E7E3]">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className="grid gap-4 py-5 first:pt-0 last:pb-0 sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F2F4F3] text-[#1B3A2E]">
                      <MonitorSmartphone size={19} strokeWidth={1.8} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#1B3A2E]">
                        {device.label || getDeviceLabel(device.user_agent)}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[#747D79]">
                        {device.location_label || 'Localização não registrada'} ·
                        último acesso {formatDateTime(device.last_seen_at)}
                      </p>
                      <p className="mt-1 text-xs text-[#9AA4A1]">
                        Confiança: {device.trust_level}
                      </p>
                    </div>
                  </div>

                  {!device.revoked_at ? (
                    <form action={revokeSecurityDeviceAction}>
                      <input type="hidden" name="device_id" value={device.id} />
                      <button
                        type="submit"
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#C7CFCC] bg-white px-4 text-xs font-semibold text-[#1B3A2E] transition hover:bg-[#FAF7F2]"
                      >
                        <Power size={14} strokeWidth={1.8} />
                        Revogar
                      </button>
                    </form>
                  ) : (
                    <span className="rounded-full border border-[#EAD8D6] bg-[#FFF3F2] px-3 py-1.5 text-xs font-semibold text-[#8A3532]">
                      Revogado
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-[#E2E7E3] bg-[#FFFDF8] p-5">
              <p className="text-sm font-semibold text-[#1B3A2E]">
                Nenhum dispositivo persistido ainda.
              </p>
              <p className="mt-2 text-sm leading-6 text-[#747D79]">
                Depois que o app registrar aparelhos confiáveis, eles aparecerão aqui.
              </p>
              <p className="mt-4 text-xs leading-5 text-[#9AA4A1]">
                Sessão atual: {getDeviceLabel(currentUserAgent)}
              </p>
            </div>
          )}
        </div>
      </SecurityDisclosure>

      <SecurityDisclosure
        eyebrow="Sessões"
        title="Sessões ativas"
        description="Revise sessões recentes e acessos ainda reconhecidos."
        open={openSection === 'sessions'}
        onToggle={() =>
          onOpenSectionChange(openSection === 'sessions' ? '' : 'sessions')
        }
      >
        <div className="rounded-[30px] border border-[#E2E7E3] bg-white/56 p-5 backdrop-blur-md xl:p-6">
          {sessions.length ? (
            <div className="divide-y divide-[#E2E7E3]">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-start gap-4 py-5 first:pt-0 last:pb-0"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F2F4F3] text-[#1B3A2E]">
                    <Radio size={19} strokeWidth={1.8} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#1B3A2E]">
                      {session.session_label}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#747D79]">
                      Iniciada {formatDateTime(session.started_at)} · vista{' '}
                      {formatDateTime(session.last_seen_at)}
                    </p>
                    <p className="mt-1 text-xs text-[#9AA4A1]">
                      {session.revoked_at ? 'Revogada' : 'Ativa ou não expirada'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-[#E2E7E3] bg-[#FFFDF8] p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={18}
                  strokeWidth={1.8}
                  className="mt-0.5 text-[#1B3A2E]"
                />
                <div>
                  <p className="text-sm font-semibold text-[#1B3A2E]">
                    Nenhuma sessão avançada registrada.
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#747D79]">
                    A sessão Supabase atual existe, mas o histórico próprio de
                    sessões da IRIS ainda não foi populado.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </SecurityDisclosure>
    </section>
  );
}
