'use client';

import { Button } from '@/components/ui/Button';

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 md:px-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-light leading-tight tracking-tight text-foreground">
          O tempo passa,
          <br />
          mas o que sentimos
          <br />
          <span className="text-emotion">permanece.</span>
        </h1>
        <p className="mt-8 text-base md:text-lg text-text-secondary max-w-xl mx-auto">
          Uma rede de memórias, presença e conexões profundas.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="primary">
            Criar conta
          </Button>
          <Button size="lg" variant="outline">
            Explorar manifesto
          </Button>
        </div>
      </div>
    </section>
  );
}