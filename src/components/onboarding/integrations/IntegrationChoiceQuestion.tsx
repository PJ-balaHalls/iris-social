'use client';

import type { LucideIcon } from 'lucide-react';

type IntegrationChoiceOption = {
  value: string;
  label: string;
};

type IntegrationChoiceQuestionProps = {
  title: string;
  value: string;
  options: IntegrationChoiceOption[];
  icon?: LucideIcon;
  onChange: (value: string) => void;
};

export function IntegrationChoiceQuestion({
  title,
  value,
  options,
  icon: Icon,
  onChange,
}: IntegrationChoiceQuestionProps) {
  return (
    <fieldset className="space-y-6">
      <legend className="w-full">
        <div className="flex items-center gap-3">
          {Icon && (
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
              <Icon size={17} strokeWidth={1.8} />
            </span>
          )}

          <span className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
            {title}
          </span>
        </div>
      </legend>

      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const selected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={selected}
              className={[
                'min-h-16 rounded-[22px] border px-5 text-left text-sm font-semibold transition-all duration-200',
                selected
                  ? 'border-emerald-800 bg-emerald-800 text-white shadow-[0_12px_28px_rgba(0,44,31,0.18)]'
                  : 'border-white/70 bg-white/[0.28] text-[#002c1f] hover:border-emerald-800/20 hover:bg-emerald-800/[0.065]',
              ].join(' ')}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
