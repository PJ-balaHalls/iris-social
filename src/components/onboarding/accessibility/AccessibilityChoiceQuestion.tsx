'use client';

import type { LucideIcon } from 'lucide-react';

type AccessibilityChoiceOption = {
  value: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
};

type AccessibilityChoiceQuestionProps = {
  title: string;
  value: string;
  options: AccessibilityChoiceOption[];
  onChange: (value: string) => void;
};

export function AccessibilityChoiceQuestion({
  title,
  value,
  options,
  onChange,
}: AccessibilityChoiceQuestionProps) {
  return (
    <fieldset className="space-y-6">
      <legend className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
        {title}
      </legend>

      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const selected = value === option.value;
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={selected}
              className={[
                'min-h-20 rounded-[22px] border px-5 py-4 text-left transition-all duration-200',
                selected
                  ? 'border-emerald-800 bg-emerald-800 text-white shadow-[0_12px_28px_rgba(0,44,31,0.18)]'
                  : 'border-white/70 bg-white/[0.28] text-[#002c1f] hover:border-emerald-800/20 hover:bg-emerald-800/[0.065]',
              ].join(' ')}
            >
              <span className="flex items-start gap-3">
                {Icon && (
                  <Icon
                    size={17}
                    strokeWidth={1.8}
                    className={selected ? 'mt-0.5 text-white' : 'mt-0.5 text-[#002c1f]'}
                  />
                )}

                <span>
                  <span className="block text-sm font-semibold">
                    {option.label}
                  </span>

                  {option.description && (
                    <span
                      className={[
                        'mt-1 block text-xs leading-5',
                        selected ? 'text-white/78' : 'text-[#747D79]',
                      ].join(' ')}
                    >
                      {option.description}
                    </span>
                  )}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
