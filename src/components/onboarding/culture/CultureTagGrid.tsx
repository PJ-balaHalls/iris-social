'use client';

import type { LucideIcon } from 'lucide-react';

type CultureTagOption = {
  value: string;
  label: string;
  icon?: LucideIcon;
};

type CultureTagGridProps = {
  title: string;
  value: string[];
  minSelected?: number;
  options: CultureTagOption[];
  onChange: (value: string[]) => void;
};

export function CultureTagGrid({
  title,
  value,
  minSelected = 0,
  options,
  onChange,
}: CultureTagGridProps) {
  function toggleTag(tag: string) {
    if (value.includes(tag)) {
      onChange(value.filter((item) => item !== tag));
      return;
    }

    onChange([...value, tag]);
  }

  return (
    <fieldset className="space-y-5">
      <legend className="w-full">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
            {title}
          </h2>

          {minSelected > 0 && (
            <span className="shrink-0 rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] px-3 py-1 text-xs font-semibold text-[#002c1f]">
              {value.length}/{minSelected}+
            </span>
          )}
        </div>
      </legend>

      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const selected = value.includes(option.value);
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleTag(option.value)}
              aria-pressed={selected}
              className={[
                'flex min-h-12 items-center gap-3 rounded-[18px] border px-4 text-left text-sm font-semibold transition-all duration-200',
                selected
                  ? 'border-emerald-800 bg-emerald-800 text-white shadow-[0_10px_24px_rgba(0,44,31,0.18)]'
                  : 'border-white/70 bg-white/[0.28] text-[#002c1f] hover:border-emerald-800/20 hover:bg-emerald-800/[0.065]',
              ].join(' ')}
            >
              {Icon && (
                <Icon
                  size={16}
                  strokeWidth={1.8}
                  className={selected ? 'text-white' : 'text-[#002c1f]'}
                />
              )}

              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
