'use client';

import { CalendarDays, Leaf, RefreshCcw } from 'lucide-react';
import { PlanInfoDrawer } from './PlanInfoDrawer';

type PlanStartQuestionProps = {
  billingCycle: string;
  planIntent: string;
  onChooseFree: () => void;
  onChooseCycle: (cycle: 'monthly' | 'annual') => void;
};

export function PlanStartQuestion({
  billingCycle,
  planIntent,
  onChooseFree,
  onChooseCycle,
}: PlanStartQuestionProps) {
  const options = [
    {
      value: 'free_now',
      label: 'Seguir no gratuito agora',
      description: 'Comece sem pagamento. Você pode mudar de plano depois.',
      icon: Leaf,
      selected: planIntent === 'free_now',
      onClick: onChooseFree,
    },
    {
      value: 'monthly',
      label: 'Ver planos mensais',
      description: 'Mais flexível para começar e trocar depois.',
      icon: RefreshCcw,
      selected: planIntent === 'choose_plan' && billingCycle === 'monthly',
      onClick: () => onChooseCycle('monthly'),
    },
    {
      value: 'annual',
      label: 'Ver planos anuais',
      description: 'Melhor para continuidade e possível benefício anual.',
      icon: CalendarDays,
      selected: planIntent === 'choose_plan' && billingCycle === 'annual',
      onClick: () => onChooseCycle('annual'),
    },
  ];

  return (
    <fieldset className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <legend className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
          Como prefere começar?
        </legend>

        <PlanInfoDrawer title="Como funcionam os planos">
          <p>
            Você não precisa pagar agora. A opção gratuita permite terminar o onboarding e entrar na IRIS sem checkout.
          </p>
          <p>
            Os planos mensais e anuais apenas registram sua preferência. Pagamento, cupom, cobrança, upgrade e downgrade serão conectados depois.
          </p>
          <p>
            O ciclo anual existe para quem pretende usar a IRIS com continuidade. O benefício ou desconto final será definido quando o billing for implementado.
          </p>
        </PlanInfoDrawer>
      </div>

      <div className="grid gap-3">
        {options.map((option) => {
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              type="button"
              onClick={option.onClick}
              aria-pressed={option.selected}
              className={[
                'min-h-20 rounded-[22px] border px-5 py-4 text-left transition-all duration-200',
                option.selected
                  ? 'border-emerald-800 bg-emerald-800 text-white shadow-[0_12px_28px_rgba(0,44,31,0.18)]'
                  : 'border-white/70 bg-white/[0.28] text-[#002c1f] hover:border-emerald-800/20 hover:bg-emerald-800/[0.065]',
              ].join(' ')}
            >
              <span className="flex items-start gap-3">
                <Icon
                  size={17}
                  strokeWidth={1.8}
                  className={option.selected ? 'mt-0.5 text-white' : 'mt-0.5 text-[#002c1f]'}
                />

                <span>
                  <span className="block text-sm font-semibold">
                    {option.label}
                  </span>

                  <span
                    className={[
                      'mt-1 block text-xs leading-5',
                      option.selected ? 'text-white/78' : 'text-[#747D79]',
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
