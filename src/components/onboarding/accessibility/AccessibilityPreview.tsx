import type { IrisAccessibilityPreferences } from '@/lib/accessibility/preferences';

type AccessibilityPreviewProps = {
  preferences: IrisAccessibilityPreferences;
};

export function AccessibilityPreview({ preferences }: AccessibilityPreviewProps) {
  return (
    <div className="space-y-5">
      <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
        Veja como fica.
      </h2>

      <div className="rounded-[24px] border border-white/70 bg-white/[0.30] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#747D79]">
          Preview dinâmico
        </p>

        <p className="mt-3 text-base text-[#002c1f]">
          A IRIS deve ser confortável para ler, navegar e sentir. Este texto muda junto com suas escolhas.
        </p>

        <p className="mt-3 text-sm text-[#476153]">
          Tema, fonte, tamanho, espaçamento, contraste e movimento passam a valer assim que você seleciona.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-white/70 bg-white/[0.30] px-3 py-1.5 text-xs font-semibold text-[#002c1f]">
          Tema: {preferences.theme}
        </span>

        <span className="rounded-full border border-white/70 bg-white/[0.30] px-3 py-1.5 text-xs font-semibold text-[#002c1f]">
          Fonte: {preferences.font}
        </span>

        <span className="rounded-full border border-white/70 bg-white/[0.30] px-3 py-1.5 text-xs font-semibold text-[#002c1f]">
          Texto: {preferences.fontScale}%
        </span>

        <span className="rounded-full border border-white/70 bg-white/[0.30] px-3 py-1.5 text-xs font-semibold text-[#002c1f]">
          Espaçamento: {preferences.spacing}
        </span>

        <span className="rounded-full border border-white/70 bg-white/[0.30] px-3 py-1.5 text-xs font-semibold text-[#002c1f]">
          Movimento: {preferences.motion}
        </span>

        <span className="rounded-full border border-white/70 bg-white/[0.30] px-3 py-1.5 text-xs font-semibold text-[#002c1f]">
          Contraste: {preferences.contrast}
        </span>
      </div>
    </div>
  );
}
