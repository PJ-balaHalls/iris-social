import { CheckCircle2 } from 'lucide-react';
import type { IrisAccessibilityPreferences } from '@/lib/accessibility/preferences';

type AccessibilityFinalReviewProps = {
  preferences: IrisAccessibilityPreferences;
  labels: Record<string, string>;
};

export function AccessibilityFinalReview({
  preferences,
  labels,
}: AccessibilityFinalReviewProps) {
  const items = [
    labels[preferences.theme],
    labels[preferences.font],
    `${preferences.fontScale}%`,
    labels[preferences.spacing],
    labels[preferences.motion],
    labels[preferences.contrast],
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
          <CheckCircle2 size={17} strokeWidth={1.8} />
        </span>

        <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
          Acessibilidade definida.
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

      <div className="rounded-[24px] border border-white/70 bg-white/[0.30] p-5">
        <p className="text-sm text-[#476153]">
          Essas preferências já estão aplicadas e serão carregadas automaticamente nas próximas telas.
        </p>
      </div>
    </div>
  );
}
