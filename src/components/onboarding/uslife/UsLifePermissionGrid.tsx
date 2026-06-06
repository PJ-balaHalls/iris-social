'use client';

import type { LucideIcon } from 'lucide-react';

type PermissionOption = {
  value: string;
  label: string;
  icon?: LucideIcon;
};

type UsLifePermissionGridProps = {
  title: string;
  value: string[];
  options: PermissionOption[];
  onChange: (value: string[]) => void;
};

export function UsLifePermissionGrid({
  title,
  value,
  options,
  onChange,
}: UsLifePermissionGridProps) {
  function toggle(permission: string) {
    if (value.includes(permission)) {
      onChange(value.filter((item) => item !== permission));
      return;
    }

    onChange([...value, permission]);
  }

  return (
    <fieldset className="space-y-5">
      <legend className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
        {title}
      </legend>

      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const selected = value.includes(option.value);
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggle(option.value)}
              aria-pressed={selected}
              className={[
                'flex min-h-14 items-center gap-3 rounded-[20px] border px-4 text-left text-sm font-semibold transition-all duration-200',
                selected
                  ? 'border-emerald-800 bg-emerald-800 text-white shadow-[0_10px_24px_rgba(0,44,31,0.18)]'
                  : 'border-white/70 bg-white/[0.28] text-[#002c1f] hover:border-emerald-800/20 hover:bg-emerald-800/[0.065]',
              ].join(' ')}
            >
              {Icon && <Icon size={17} strokeWidth={1.8} />}
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
