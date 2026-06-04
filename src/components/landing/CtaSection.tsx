'use client';

import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-emerald/10 to-emotion/10">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-h2 font-display mb-4">Pronto para começar sua jornada?</h2>
        <p className="text-text-secondary max-w-xl mx-auto mb-8">
        Junte-se a uma comunidade que valoriza memórias, presença e conexões profundas.
        </p>
        <Button size="lg" variant="primary" className="gap-2">
          Criar minha conta gratuita <ArrowRight size={18} />
        </Button>
      </div>
    </section>
  );
}