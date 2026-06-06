import { CheckCircle2 } from 'lucide-react';

type IntegrationFinalReviewProps = {
  selected: string[];
  accessMode: string;
  syncMode: string;
  labels: Record<string, string>;
};

export function IntegrationFinalReview({
  selected,
  accessMode,
  syncMode,
  labels,
}: IntegrationFinalReviewProps) {
  const items = [
    ...selected.map((item) => labels[item] || item),
    labels[accessMode] || accessMode,
    labels[syncMode] || syncMode,
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
          <CheckCircle2 size={17} strokeWidth={1.8} />
        </span>

        <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
          Integrações preparadas.
        </h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/70 bg-white/[0.30] px-3 py-1.5 text-xs font-semibold text-[#002c1f]"
          >
            {item}
          </span>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-[22px] border border-white/70 bg-white/[0.26] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Fontes
          </p>

          <p className="mt-2 font-display text-3xl text-[#002c1f]">
            {selected.length}
          </p>
        </div>

        <div className="rounded-[22px] border border-white/70 bg-white/[0.26] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Acesso
          </p>

          <p className="mt-2 font-display text-2xl text-[#002c1f]">
            {labels[accessMode] || '—'}
          </p>
        </div>

        <div className="rounded-[22px] border border-white/70 bg-white/[0.26] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Sincronia
          </p>

          <p className="mt-2 font-display text-2xl text-[#002c1f]">
            {labels[syncMode] || '—'}
          </p>
        </div>
      </div>
    </div>
  );
}
