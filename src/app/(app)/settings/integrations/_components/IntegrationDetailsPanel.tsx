'use client';

import { Check, Plug, ShieldCheck } from 'lucide-react';
import {
  getKindLabel,
  getStatusLabel,
  type IntegrationPlugin,
} from '../_utils/integrationsCatalog';

export function IntegrationDetailsPanel({
  plugin,
  prepared,
  onTogglePrepared,
}: {
  plugin: IntegrationPlugin;
  prepared: boolean;
  onTogglePrepared: () => void;
}) {
  return (
    <aside className="space-y-6 xl:sticky xl:top-8 xl:self-start">
      <section className="relative overflow-hidden rounded-[34px] border border-[#E2E7E3] bg-white/58 p-6 shadow-[0_24px_80px_rgba(27,58,46,0.075)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(154,124,167,0.16),transparent_34%),radial-gradient(circle_at_90%_8%,rgba(0,109,78,0.12),transparent_34%)]" />

        <div className="relative">
          <div
            className={[
              'flex h-14 w-14 items-center justify-center rounded-[22px] text-white shadow-[0_16px_40px_rgba(27,58,46,0.18)]',
              plugin.accent,
            ].join(' ')}
          >
            <Plug size={22} strokeWidth={1.8} />
          </div>

          <p className="mt-6 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#747D79]">
            {getKindLabel(plugin.kind)} · {getStatusLabel(plugin.status)}
          </p>

          <h3 className="mt-2 font-display text-[2rem] leading-none tracking-[-0.05em] text-[#1B3A2E]">
            {plugin.name}
          </h3>

          <p className="mt-4 text-sm leading-7 text-[#747D79]">
            {plugin.longDescription}
          </p>

          <button
            type="button"
            onClick={onTogglePrepared}
            className={[
              'mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition',
              prepared
                ? 'border border-[#C7CFCC] bg-white text-[#1B3A2E] hover:bg-[#FAF7F2]'
                : 'bg-[#1B3A2E] text-white hover:bg-[#0F1512]',
            ].join(' ')}
          >
            {prepared ? <Check size={15} strokeWidth={1.8} /> : null}
            {prepared ? 'Preparado para conectar' : 'Preparar integração'}
          </button>
        </div>
      </section>

      <section className="rounded-[30px] border border-[#E2E7E3] bg-[#FFFDF8] p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck
            size={18}
            strokeWidth={1.8}
            className="mt-0.5 shrink-0 text-[#1B3A2E]"
          />

          <div>
            <h4 className="text-sm font-semibold text-[#1B3A2E]">
              Permissões previstas
            </h4>
            <p className="mt-2 text-sm leading-6 text-[#747D79]">
              Nada é conectado agora. Estes escopos são apenas preparação para a
              futura integração real.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {plugin.scopes.map((scope) => (
            <span
              key={scope}
              className="rounded-full border border-[#E2E7E3] bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#476153]"
            >
              {scope}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-[30px] border border-[#E2E7E3] bg-white/55 p-5 backdrop-blur-md">
        <h4 className="text-sm font-semibold text-[#1B3A2E]">
          Casos de uso
        </h4>

        <div className="mt-4 space-y-3">
          {plugin.useCases.map((useCase) => (
            <div
              key={useCase}
              className="flex items-start gap-3 border-b border-[#E2E7E3] pb-3 last:border-b-0 last:pb-0"
            >
              <Check
                size={15}
                strokeWidth={1.8}
                className="mt-0.5 shrink-0 text-[#1B3A2E]"
              />
              <p className="text-sm leading-6 text-[#747D79]">{useCase}</p>
            </div>
          ))}
        </div>

        <p className="mt-5 rounded-[22px] border border-[#E2E7E3] bg-[#FAF7F2] p-4 text-sm leading-6 text-[#747D79]">
          {plugin.notes}
        </p>
      </section>
    </aside>
  );
}
