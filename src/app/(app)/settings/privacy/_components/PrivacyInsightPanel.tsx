'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  ArrowDownToLine,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { IrisDisclosureSection } from '@/components/ui/IrisDisclosureSection';
import {
  downloadPrivacyJson,
  getPrivacyStats,
  privacyLevelLabels,
  type PrivacyData,
  type PrivacyLevel,
} from '../_utils/privacySettings';

function InsightCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="rounded-[28px] border border-[#E2E7E3] bg-white/60 p-5 shadow-[0_18px_48px_rgba(27,58,46,0.055)] backdrop-blur-md xl:p-6">
      <p className="font-display text-[2.35rem] leading-none tracking-[-0.06em] text-[#1B3A2E] xl:text-[2.8rem]">
        {value}
      </p>
      <p className="mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#747D79]">
        {label}
      </p>
      <p className="mt-3 text-sm leading-6 text-[#747D79]">{description}</p>
    </div>
  );
}

export function PrivacyInsightPanel({
  level,
  data,
}: {
  level: PrivacyLevel;
  data: PrivacyData;
}) {
  const [open, setOpen] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [confirmExport, setConfirmExport] = useState(false);
  const stats = getPrivacyStats(data);

  const exportPayload = {
    privacy_level: level,
    privacy_data: data,
    exported_at: new Date().toISOString(),
  };

  return (
    <section className="mt-24 scroll-mt-8 border-t border-[#E2E7E3] pt-14 xl:mt-28 xl:pt-16">
      <IrisDisclosureSection
        eyebrow="Mapa de exposição"
        title="Como sua privacidade está configurada"
        description="Uma leitura organizada dos controles ativos, sem expor dados pessoais desnecessários."
        open={open}
        onToggle={() => setOpen((current) => !current)}
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
                  Exportação de privacidade
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#747D79]">
                  A exportação desta página contém somente preferências de privacidade,
                  não todos os seus dados de conta. Mesmo assim, salve o arquivo
                  em um local seguro.
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-4">
              <button
                type="button"
                onClick={() => setShowDetails((value) => !value)}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#C7CFCC] bg-white/74 px-5 text-sm font-semibold text-[#1B3A2E] transition hover:bg-white"
              >
                {showDetails ? <EyeOff size={16} strokeWidth={1.8} /> : <Eye size={16} strokeWidth={1.8} />}
                {showDetails ? 'Ocultar leitura detalhada' : 'Ver leitura detalhada'}
              </button>

              <label className="flex items-start gap-3 rounded-[24px] border border-[#E2E7E3] bg-[#FFFDF8] p-5">
                <input
                  type="checkbox"
                  checked={confirmExport}
                  onChange={(event) => setConfirmExport(event.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#1B3A2E]"
                />
                <span className="text-sm leading-7 text-[#476153]">
                  Entendo que as preferências de privacidade revelam como minha
                  conta está protegida.
                </span>
              </label>

              <button
                type="button"
                disabled={!confirmExport}
                onClick={() => downloadPrivacyJson(exportPayload)}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1B3A2E] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0F1512] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
              >
                <ArrowDownToLine size={16} strokeWidth={1.8} />
                Baixar preferências
              </button>
            </div>
          </div>

          <div>
            <div className="grid gap-4 sm:grid-cols-3">
              <InsightCard
                label="nível atual"
                value={privacyLevelLabels[level]}
                description="Resumo geral da sua preferência de exposição."
              />
              <InsightCard
                label="pontos visíveis"
                value={stats.exposure}
                description="Controles que tornam sua presença mais perceptível."
              />
              <InsightCard
                label="proteções"
                value={stats.protection}
                description="Controles que reduzem descoberta e contato indesejado."
              />
            </div>

            {showDetails ? (
              <div className="mt-6 rounded-[34px] border border-[#E2E7E3] bg-white/56 p-6 shadow-[0_24px_80px_rgba(27,58,46,0.065)] backdrop-blur-xl xl:p-8">
                <div className="grid gap-5 lg:grid-cols-2">
                  <div className="rounded-[28px] border border-[#E2E7E3] bg-[#FFFDF8] p-5">
                    <ShieldCheck size={20} strokeWidth={1.8} className="text-[#1B3A2E]" />
                    <h3 className="mt-4 text-sm font-semibold text-[#1B3A2E]">
                      Contato e segurança
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#747D79]">
                      Filtro de proteção está {data.interactions.safety_filter ? 'ativo' : 'desativado'}.
                      Convites de desconhecidos estão {data.interactions.allow_unknown_invites ? 'permitidos' : 'bloqueados'}.
                    </p>
                  </div>

                  <div className="rounded-[28px] border border-[#E2E7E3] bg-[#FFFDF8] p-5">
                    <Sparkles size={20} strokeWidth={1.8} className="text-[#1B3A2E]" />
                    <h3 className="mt-4 text-sm font-semibold text-[#1B3A2E]">
                      IRIS AI
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#747D79]">
                      {stats.intelligence} controles de inteligência estão ativos.
                      Isso define memória, personalização e recomendações.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </IrisDisclosureSection>
    </section>
  );
}
