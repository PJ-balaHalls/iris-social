'use client';

import type { LucideIcon } from 'lucide-react';
import { PlanInfoDrawer } from './PlanInfoDrawer';

export type PlanOption = {
  value: string;
  label: string;
  eyebrow: string;
  description: string;
  monthlyPrice: string;
  annualPrice: string;
  icon: LucideIcon;
  drawerTitle: string;
  drawer: string[];
  highlights: string[];
};

type PlanChoiceGridProps = {
  value: string;
  billingCycle: string;
  options: PlanOption[];
  onChange: (value: string) => void;
};

export function PlanChoiceGrid({
  value,
  billingCycle,
  options,
  onChange,
}: PlanChoiceGridProps) {
  return (
    <fieldset className="space-y-6">
      <legend className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
        Escolha seu plano.
      </legend>

      <div className="grid gap-3">
        {options.map((option) => {
          const selected = value === option.value;
          const Icon = option.icon;
          const price = billingCycle === 'annual' ? option.annualPrice : option.monthlyPrice;

          return (
            <div
              key={option.value}
              className={[
                'rounded-[24px] border transition-all duration-200',
                selected
                  ? 'border-emerald-800 bg-emerald-800 text-white shadow-[0_14px_30px_rgba(0,44,31,0.18)]'
                  : 'border-white/70 bg-white/[0.28] text-[#002c1f] hover:border-emerald-800/20 hover:bg-emerald-800/[0.065]',
              ].join(' ')}
            >
              <button
                type="button"
                onClick={() => onChange(option.value)}
                aria-pressed={selected}
                className="w-full px-5 py-4 text-left"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 gap-3">
                    <span
                      className={[
                        'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border',
                        selected
                          ? 'border-white/18 bg-white/12 text-white'
                          : 'border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]',
                      ].join(' ')}
                    >
                      <Icon size={17} strokeWidth={1.8} />
                    </span>

                    <span>
                      <span
                        className={[
                          'block text-[0.64rem] font-semibold uppercase tracking-[0.18em]',
                          selected ? 'text-white/70' : 'text-[#747D79]',
                        ].join(' ')}
                      >
                        {option.eyebrow}
                      </span>

                      <span className="mt-1 block text-base font-semibold">
                        {option.label}
                      </span>

                      <span
                        className={[
                          'mt-1 block text-xs leading-5',
                          selected ? 'text-white/78' : 'text-[#747D79]',
                        ].join(' ')}
                      >
                        {option.description}
                      </span>
                    </span>
                  </div>

                  <span className="shrink-0 text-right">
                    <span className="block font-display text-2xl leading-none tracking-[-0.035em]">
                      {price}
                    </span>

                    <span
                      className={[
                        'mt-1 block text-[0.64rem] font-semibold uppercase tracking-[0.14em]',
                        selected ? 'text-white/64' : 'text-[#747D79]',
                      ].join(' ')}
                    >
                      {billingCycle === 'annual' ? 'anual' : 'mensal'}
                    </span>
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {option.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className={[
                        'rounded-full border px-3 py-1 text-[0.68rem] font-semibold',
                        selected
                          ? 'border-white/18 bg-white/12 text-white/84'
                          : 'border-white/70 bg-white/[0.28] text-[#002c1f]',
                      ].join(' ')}
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </button>

              <div
                className={[
                  'flex items-center justify-between gap-3 border-t px-5 py-3',
                  selected ? 'border-white/14' : 'border-white/60',
                ].join(' ')}
              >
                <p
                  className={[
                    'text-xs leading-5',
                    selected ? 'text-white/70' : 'text-[#747D79]',
                  ].join(' ')}
                >
                  Veja diferenças, limites e uso ideal.
                </p>

                <PlanInfoDrawer title={option.drawerTitle}>
                  {option.drawer.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </PlanInfoDrawer>
              </div>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
