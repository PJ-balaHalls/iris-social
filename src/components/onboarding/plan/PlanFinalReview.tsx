import { CheckCircle2 } from 'lucide-react';

type PlanFinalReviewProps = {
  planLabel: string;
  billingCycle: string;
  code: string;
  hasCode: boolean;
  demandNote: string;
};

export function PlanFinalReview({
  planLabel,
  billingCycle,
  code,
  hasCode,
  demandNote,
}: PlanFinalReviewProps) {
  const cycleLabel = billingCycle === 'annual' ? 'Anual' : 'Mensal';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
          <CheckCircle2 size={17} strokeWidth={1.8} />
        </span>

        <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
          Plano selecionado.
        </h2>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-white/70 bg-white/[0.30] px-3 py-1.5 text-xs font-semibold text-[#002c1f]">
          {planLabel}
        </span>

        <span className="rounded-full border border-white/70 bg-white/[0.30] px-3 py-1.5 text-xs font-semibold text-[#002c1f]">
          {cycleLabel}
        </span>

        {hasCode && code && (
          <span className="rounded-full border border-white/70 bg-white/[0.30] px-3 py-1.5 text-xs font-semibold text-[#002c1f]">
            Código: {code}
          </span>
        )}
      </div>

      {demandNote && (
        <div className="rounded-[22px] border border-white/70 bg-white/[0.26] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Sob demanda
          </p>

          <p className="mt-2 text-sm leading-6 text-[#476153]">
            {demandNote}
          </p>
        </div>
      )}

      <div className="rounded-[24px] border border-white/70 bg-white/[0.30] p-5">
        <p className="text-sm leading-6 text-[#476153]">
          O pagamento ainda não será processado nesta etapa. A IRIS salva sua escolha para ativação futura do billing.
        </p>
      </div>
    </div>
  );
}
