import { CheckCircle2 } from 'lucide-react';

type UsLifeFinalReviewProps = {
  inviteMode: string;
  relationshipType: string;
  partnerName: string;
  partnerContact: string;
  permissions: string[];
  labels: Record<string, string>;
};

export function UsLifeFinalReview({
  inviteMode,
  relationshipType,
  partnerName,
  partnerContact,
  permissions,
  labels,
}: UsLifeFinalReviewProps) {
  const items = [
    labels[inviteMode] || inviteMode,
    labels[relationshipType] || relationshipType,
    partnerName,
    partnerContact,
    ...permissions.map((permission) => labels[permission] || permission),
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
          <CheckCircle2 size={17} strokeWidth={1.8} />
        </span>

        <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
          usLIFE preparado.
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
            Modo
          </p>
          <p className="mt-2 font-display text-2xl text-[#002c1f]">
            {labels[inviteMode] || '—'}
          </p>
        </div>

        <div className="rounded-[22px] border border-white/70 bg-white/[0.26] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Vínculo
          </p>
          <p className="mt-2 font-display text-2xl text-[#002c1f]">
            {labels[relationshipType] || '—'}
          </p>
        </div>

        <div className="rounded-[22px] border border-white/70 bg-white/[0.26] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Permissões
          </p>
          <p className="mt-2 font-display text-3xl text-[#002c1f]">
            {permissions.length}
          </p>
        </div>
      </div>
    </div>
  );
}
