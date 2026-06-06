'use client';

import type { LucideIcon } from 'lucide-react';

type AccessibilityScaleQuestionProps = {
  title: string;
  minLabel: string;
  maxLabel: string;
  value: number;
  min?: number;
  max?: number;
  icon?: LucideIcon;
  onChange: (value: number) => void;
};

export function AccessibilityScaleQuestion({
  title,
  minLabel,
  maxLabel,
  value,
  min = 90,
  max = 125,
  icon: Icon,
  onChange,
}: AccessibilityScaleQuestionProps) {
  const steps = [90, 100, 110, 120, 125];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        {Icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
            <Icon size={17} strokeWidth={1.8} />
          </span>
        )}

        <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
          {title}
        </h2>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between gap-4">
          <span className="text-sm text-[#747D79]">{minLabel}</span>

          <span className="rounded-full border border-emerald-800/10 bg-emerald-800/[0.06] px-4 py-1.5 text-sm font-semibold text-[#002c1f]">
            {value}%
          </span>

          <span className="text-right text-sm text-[#747D79]">{maxLabel}</span>
        </div>

        <input
          type="range"
          min={min}
          max={max}
          step="5"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full accent-emerald-800"
          aria-label={title}
        />

        <div className="mt-4 grid grid-cols-5 gap-1">
          {steps.map((step) => {
            const active = value >= step;

            return (
              <button
                key={step}
                type="button"
                onClick={() => onChange(step)}
                className={[
                  'h-2 rounded-full transition-all',
                  active ? 'bg-emerald-800' : 'bg-white/60 hover:bg-emerald-800/20',
                ].join(' ')}
                aria-label={`Selecionar ${step}%`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
