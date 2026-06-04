'use client';

import { Button } from '@/components/ui/Button';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '0',
    description: 'Para começar a guardar memórias',
    features: ['5 blocos no Identity Space', 'Uso básico da IRIS AI', 'Acesso inicial ao iLIFE', 'Comunidades limitadas'],
    buttonVariant: 'outline' as const,
    popular: false,
  },
  {
    name: 'Premium',
    price: '19,90',
    description: 'Experiência completa',
    features: ['Blocos ilimitados', 'IRIS AI avançada', 'Vídeos e uploads', 'Temas personalizados', 'Suporte prioritário'],
    buttonVariant: 'primary' as const,
    popular: true,
  },
  {
    name: 'Duo',
    price: '29,90',
    description: 'Para duas pessoas',
    features: ['Todos os benefícios Premium', 'Espaço usLIFE compartilhado', 'Cerimônia simbólica', 'Relíquia digital'],
    buttonVariant: 'outline' as const,
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="planos" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-h2 font-display text-emotion">Planos para cada jornada</h2>
          <p className="text-text-secondary max-w-2xl mx-auto mt-4">
          Escolha o plano que melhor se adapta à sua história.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`card p-6 relative ${
                plan.popular ? 'border-2 border-emotion shadow-lg' : ''
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emotion text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Mais popular
                </span>
              )}
              <div className="text-center">
                <h3 className="text-2xl font-display">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ {plan.price}</span>
                  <span className="text-text-muted">/mês</span>
                </div>
                <p className="text-sm text-text-muted mt-2">{plan.description}</p>
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <Check size={16} className="text-emerald" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant={plan.buttonVariant} className="w-full mt-8">
                Assinar
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}