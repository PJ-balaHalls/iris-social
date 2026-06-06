type PersonalitySummaryProps = {
  energy: string;
  perception: string;
  decision: string;
  structure: string;
  socialRhythm: string;
  emotionalIntensity: number;
  openness: number;
  mbtiSignal: string;
};

function getLabel(value: string, map: Record<string, string>) {
  return map[value] || 'Ainda não definido';
}

export function PersonalitySummary({
  energy,
  perception,
  decision,
  structure,
  socialRhythm,
  emotionalIntensity,
  openness,
  mbtiSignal,
}: PersonalitySummaryProps) {
  const labels = {
    energy: {
      introvert: 'recarrega no silêncio',
      extrovert: 'recarrega na troca',
    },
    perception: {
      details: 'percebe detalhes',
      patterns: 'percebe padrões',
    },
    decision: {
      logic: 'decide por clareza',
      feeling: 'decide por sentido',
    },
    structure: {
      planned: 'prefere estrutura',
      fluid: 'prefere fluidez',
    },
    socialRhythm: {
      reserved: 'presença reservada',
      expressive: 'presença expressiva',
    },
  };

  return (
    <div>
      <p className="text-sm text-[#747D79]">
        Preview
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full border border-emerald-800/10 bg-white/[0.34] px-3 py-1.5 text-xs font-semibold text-[#002c1f]">
          {getLabel(energy, labels.energy)}
        </span>

        <span className="rounded-full border border-emerald-800/10 bg-white/[0.34] px-3 py-1.5 text-xs font-semibold text-[#002c1f]">
          {getLabel(perception, labels.perception)}
        </span>

        <span className="rounded-full border border-emerald-800/10 bg-white/[0.34] px-3 py-1.5 text-xs font-semibold text-[#002c1f]">
          {getLabel(decision, labels.decision)}
        </span>

        <span className="rounded-full border border-emerald-800/10 bg-white/[0.34] px-3 py-1.5 text-xs font-semibold text-[#002c1f]">
          {getLabel(structure, labels.structure)}
        </span>

        <span className="rounded-full border border-emerald-800/10 bg-white/[0.34] px-3 py-1.5 text-xs font-semibold text-[#002c1f]">
          {getLabel(socialRhythm, labels.socialRhythm)}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[20px] border border-white/70 bg-white/[0.28] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Sinal
          </p>
          <p className="mt-2 font-display text-2xl text-[#002c1f]">
            {mbtiSignal || '—'}
          </p>
        </div>

        <div className="rounded-[20px] border border-white/70 bg-white/[0.28] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Intensidade
          </p>
          <p className="mt-2 font-display text-2xl text-[#002c1f]">
            {emotionalIntensity}/10
          </p>
        </div>

        <div className="rounded-[20px] border border-white/70 bg-white/[0.28] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Abertura
          </p>
          <p className="mt-2 font-display text-2xl text-[#002c1f]">
            {openness}/10
          </p>
        </div>
      </div>
    </div>
  );
}
