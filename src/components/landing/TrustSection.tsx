'use client';

import { Shield, Lock, Eye, Key } from 'lucide-react';

const trustItems = [
  { icon: <Lock size={32} />, title: 'Privacidade por padrão', description: 'Suas memórias são suas. Controle total sobre quem vê o quê.' },
  { icon: <Shield size={32} />, title: 'Criptografia E2EE', description: 'Mensagens e cartas protegidas com criptografia de ponta a ponta.' },
  { icon: <Eye size={32} />, title: 'Zero-Knowledge', description: 'Nem nós vemos seus dados mais sensíveis.' },
  { icon: <Key size={32} />, title: 'Moderação ética', description: 'Comunidade saudável, sem algoritmos viciantes.' },
];

export function TrustSection() {
  return (
    <section id="seguranca" className="py-20 md:py-28 bg-bg-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-h2 font-display text-emotion">Segurança e confiança</h2>
          <p className="text-text-secondary max-w-2xl mx-auto mt-4">
            Construído para proteger o que é mais importante.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustItems.map((item, idx) => (
            <div key={idx} className="text-center p-6">
              <div className="text-emotion mx-auto mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-text-muted text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}