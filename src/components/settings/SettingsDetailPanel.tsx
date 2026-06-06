import Link from 'next/link';
import { ArrowRight, Database, ShieldCheck } from 'lucide-react';
import type { SettingsOption } from '@/lib/settings/settingsCatalog';
import { SettingsIcon } from './SettingsIcon';

type SettingsDetailPanelProps = {
  option: SettingsOption;
  profile?: any;
  subscription?: any;
  uslifeInvites?: any[];
  planInterestRequests?: any[];
};

function formatValue(value: any) {
  if (value === null || value === undefined || value === '') return '—';

  if (Array.isArray(value)) {
    if (!value.length) return '—';
    return JSON.stringify(value, null, 2);
  }

  if (typeof value === 'object') {
    const keys = Object.keys(value);
    if (!keys.length) return '—';
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

function resolveSourceData({
  option,
  profile,
  subscription,
  uslifeInvites,
  planInterestRequests,
}: SettingsDetailPanelProps) {
  if (option.source === 'subscriptions') return subscription;
  if (option.source === 'uslife_invites') return uslifeInvites;
  if (option.source === 'plan_interest_requests') return planInterestRequests;
  return profile;
}

export function SettingsDetailPanel(props: SettingsDetailPanelProps) {
  const { option } = props;
  const sourceData = resolveSourceData(props);

  return (
    <aside className="rounded-[32px] border border-white/70 bg-white/[0.26] p-5 backdrop-blur-sm lg:sticky lg:top-6">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
          <SettingsIcon name={option.icon} size={20} />
        </span>

        <div className="min-w-0">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
            {option.group}
          </p>

          <h2 className="mt-2 font-display text-4xl leading-[1] tracking-[-0.055em] text-[#002c1f]">
            {option.title}
          </h2>

          <p className="mt-3 text-sm leading-7 text-[#476153]">
            {option.description}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        <div className="rounded-[24px] border border-white/70 bg-white/[0.30] p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck size={17} strokeWidth={1.8} className="mt-0.5 text-[#002c1f]" />

            <div>
              <p className="text-sm font-semibold text-[#002c1f]">
                Status
              </p>

              <p className="mt-1 text-sm leading-6 text-[#747D79]">
                {option.status === 'ready' && 'Esta configuração está ativa ou pronta para uso.'}
                {option.status === 'recommended' && 'Recomendado para melhorar sua experiência.'}
                {option.status === 'planned' && 'Área planejada para próxima fase.'}
                {option.status === 'sensitive' && 'Área sensível. Requer cuidado extra.'}
              </p>
            </div>
          </div>
        </div>

        {option.columns?.length ? (
          <div className="rounded-[24px] border border-white/70 bg-white/[0.30] p-4">
            <div className="mb-4 flex items-center gap-2">
              <Database size={17} strokeWidth={1.8} className="text-[#002c1f]" />
              <p className="text-sm font-semibold text-[#002c1f]">
                Dados relacionados
              </p>
            </div>

            <div className="space-y-3">
              {option.columns.map((column) => (
                <div
                  key={column}
                  className="rounded-[18px] border border-white/70 bg-white/[0.26] p-3"
                >
                  <p className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[#747D79]">
                    {option.source || 'profiles'} · {column}
                  </p>

                  <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-[#002c1f]">
                    {formatValue(sourceData?.[column])}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {option.href ? (
          <Link
            href={option.href}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[18px] bg-emerald-800 px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(0,44,31,0.18)] transition-all hover:bg-emerald-900"
          >
            Abrir configuração
            <ArrowRight size={15} strokeWidth={1.8} />
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex min-h-12 items-center justify-center rounded-[18px] border border-white/70 bg-white/[0.24] px-5 text-sm font-semibold text-[#9AA4A1]"
          >
            Em breve
          </button>
        )}
      </div>
    </aside>
  );
}
