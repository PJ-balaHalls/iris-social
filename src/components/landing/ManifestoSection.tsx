'use client';

import { Quote } from 'lucide-react';

export function ManifestoSection() {
  return (
    <section className="min-h-screen flex items-center py-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-light tracking-tight">
              Nosso manifesto
            </h2>
            <div className="w-12 h-px bg-emotion/40 my-6" />
            <p className="text-base md:text-lg text-text-secondary leading-relaxed">
              As redes sociais atuais nos transformaram em produtos. Métricas vazias,
              algoritmos que exploram nossa atenção e conexões superficiais.
            </p>
            <p className="mt-4 text-base md:text-lg text-text-secondary leading-relaxed">
              O IRIS nasce para romper esse ciclo. Queremos devolver o significado
              às interações, proteger suas memórias mais íntimas e construir um
              espaço digital onde você é dono da sua história.
            </p>
            <div className="flex gap-4 pt-6">
              <Quote className="w-6 h-6 text-emotion/60" />
              <p className="italic text-text-secondary text-sm">
                Design não é decoração. Design é cuidado, presença e memória transformados em interface.
              </p>
            </div>
          </div>
          <div className="bg-bg-surface/30 backdrop-blur-sm rounded-2xl border border-border/30 p-6 shadow-sm">
            <h3 className="text-xl font-display font-light mb-4">Valores</h3>
            <ul className="space-y-3 text-text-secondary text-sm">
              <li className="flex gap-2"><span className="text-emotion">→</span> Privacidade como pilar</li>
              <li className="flex gap-2"><span className="text-emotion">→</span> Conexões profundas</li>
              <li className="flex gap-2"><span className="text-emotion">→</span> Design emocional e silencioso</li>
              <li className="flex gap-2"><span className="text-emotion">→</span> Propósito sobre métricas</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}