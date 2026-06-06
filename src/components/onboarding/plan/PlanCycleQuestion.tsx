'use client';

import { CalendarDays, RefreshCcw } from 'lucide-react';
import { PlanInfoDrawer } from './PlanInfoDrawer';

type PlanCycleQuestionProps = {
  value: string;
  onChange: (value: string) => void;
};

export function PlanCycleQuestion({ value, onChange }: PlanCycleQuestionProps) {
  const options = [
    {
      value: 'monthly',
      label: 'Mensal',
      description: 'Mais flexível para começar.',
      icon: RefreshCcw,
    },
    {
      value: 'annual',
      label: 'Anual',
      description: 'Melhor para quem quer continuidade.',
      icon: CalendarDays,
    },
  ];

  return (
    <fieldset className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <legend className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
          Como prefere organizar o plano?
        </legend>

        <PlanInfoDrawer title="Planos anuais">
          <p>
            O plano anual serve para quem quer usar a IRIS como espaço contínuo, com menos interrupção e melhor previsibilidade.
          </p>
          <p>
            O pagamento, desconto final, emissão, cancelamento e cobrança ainda serão implementados depois. Nesta etapa, salvamos apenas sua preferência.
          </p>
          <p>
            O plano mensal continua sendo a opção mais flexível para começar sem compromisso longo.
          </p>
        </PlanInfoDrawer>
      </div>

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
                <Icon
                  size={17}
                  strokeWidth={1.8}
                  className={selected ? 'mt-0.5 text-white' : 'mt-0.5 text-[#002c1f]'}
                />

                <span>
                  <span className="block text-sm font-semibold">
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
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
