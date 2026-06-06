'use client';

import type { LucideIcon } from 'lucide-react';

type PersonalityScaleQuestionProps = {
  title: string;
  minLabel: string;
  maxLabel: string;
  value: number;
  icon?: LucideIcon;
  onChange: (value: number) => void;
};

export function PersonalityScaleQuestion({
  title,
  minLabel,
  maxLabel,
  value,
  icon: Icon,
  onChange,
}: PersonalityScaleQuestionProps) {
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
          <span className="text-sm text-[#747D79]">
            {minLabel}
          </span>

          <span className="rounded-full border border-emerald-800/10 bg-emerald-800/[0.06] px-4 py-1.5 text-sm font-semibold text-[#002c1f]">
            {value}/10
          </span>

          <span className="text-right text-sm text-[#747D79]">
            {maxLabel}
          </span>
        </div>

        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full accent-emerald-800"
          aria-label={title}
        />

        <div className="mt-4 grid grid-cols-10 gap-1">
          {Array.from({ length: 10 }).map((_, index) => {
            const active = index + 1 <= value;

            return (
              <button
                key={index}
                type="button"
                onClick={() => onChange(index + 1)}
                className={[
                  'h-2 rounded-full transition-all',
                  active ? 'bg-emerald-800' : 'bg-white/60 hover:bg-emerald-800/20',
                ].join(' ')}
                aria-label={`Selecionar ${index + 1}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
