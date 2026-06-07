'use client';

import {
  Bot,
  Braces,
  Brain,
  CalendarDays,
  Camera,
  Check,
  Clapperboard,
  Headphones,
  HeartHandshake,
  Image,
  Images,
  KeyRound,
  LayoutTemplate,
  MessagesSquare,
  Music,
  NotebookText,
  PanelTop,
  Plug,
  Sparkles,
  Webhook,
} from 'lucide-react';
import {
  getKindLabel,
  getStatusLabel,
  type IntegrationPlugin,
} from '../_utils/integrationsCatalog';

const iconMap = {
  Bot,
  Braces,
  Brain,
  CalendarDays,
  Camera,
  Clapperboard,
  Headphones,
  HeartHandshake,
  Image,
  Images,
  KeyRound,
  LayoutTemplate,
  MessagesSquare,
  Music,
  NotebookText,
  PanelTop,
  Plug,
  Sparkles,
  Webhook,
};

function PluginIcon({ name }: { name: string }) {
  const Icon = iconMap[name as keyof typeof iconMap] || Plug;
  return <Icon size={21} strokeWidth={1.8} />;
}

export function IntegrationPluginCard({
  plugin,
  prepared,
  selected,
  onSelect,
  onTogglePrepared,
}: {
  plugin: IntegrationPlugin;
  prepared: boolean;
  selected: boolean;
  onSelect: () => void;
  onTogglePrepared: () => void;
}) {
  return (
    <article
      className={[
        'group relative min-h-[255px] overflow-hidden rounded-[32px] border p-5 transition',
        selected
          ? 'border-[#1B3A2E] bg-white shadow-[0_22px_70px_rgba(27,58,46,0.12)]'
          : 'border-[#E2E7E3] bg-white/56 shadow-[0_16px_48px_rgba(27,58,46,0.055)] hover:-translate-y-1 hover:bg-white',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={onSelect}
        className="absolute inset-0 z-0 cursor-pointer"
        aria-label={`Ver detalhes de ${plugin.name}`}
      />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div
            className={[
              'flex h-12 w-12 items-center justify-center rounded-[20px] text-white shadow-[0_12px_30px_rgba(27,58,46,0.16)]',
              plugin.accent,
            ].join(' ')}
          >
            <PluginIcon name={plugin.icon} />
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="rounded-full border border-[#E2E7E3] bg-[#FFFDF8]/80 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#747D79]">
              {getStatusLabel(plugin.status)}
            </span>

            {prepared ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#DDE6DA] bg-[#F2F7F3] px-3 py-1 text-xs font-semibold text-[#1B3A2E]">
                <Check size={13} strokeWidth={1.8} />
                Preparado
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#747D79]">
            {getKindLabel(plugin.kind)}
          </p>

          <h3 className="mt-2 font-display text-[1.65rem] leading-none tracking-[-0.05em] text-[#1B3A2E]">
            {plugin.name}
          </h3>

          <p className="mt-3 text-sm leading-6 text-[#747D79]">
            {plugin.description}
          </p>
        </div>

        <div className="mt-auto pt-6">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onTogglePrepared();
            }}
            className={[
              'relative z-20 inline-flex min-h-10 w-full items-center justify-center rounded-full px-4 text-sm font-semibold transition',
              prepared
                ? 'border border-[#C7CFCC] bg-white text-[#1B3A2E] hover:bg-[#FAF7F2]'
                : 'bg-[#1B3A2E] text-white hover:bg-[#0F1512]',
            ].join(' ')}
          >
            {prepared ? 'Remover preparo' : 'Preparar plugin'}
          </button>
        </div>
      </div>
    </article>
  );
}
