import React from 'react';
import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1B3A2E] flex flex-col md:flex-row font-sans overflow-hidden">
      {/* Coluna Esquerda - Espaço Visual (Manifesto Silencioso) */}
      <div className="hidden md:flex md:w-1/2 bg-[#1B3A2E] relative flex-col justify-between p-12 overflow-hidden">
        {/* Elemento Botânico Abstrato - Parallax/Glow */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-[#2A4B3F] rounded-full blur-[120px] opacity-60 pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#006D4E] rounded-full blur-[100px] opacity-40 pointer-events-none" />
        
        <div className="z-10 text-[#FAF7F2]">
          <h1 className="font-display font-bold text-3xl tracking-widest">IRIS</h1>
        </div>

        <div className="z-10 max-w-md">
          <p className="font-display text-4xl text-[#FAF7F2] leading-tight mb-4">
            O tempo passa,<br/>mas o que sentimos permanece.
          </p>
          <p className="text-[#A2B3AA] text-lg">
            Um espaço protegido para sua identidade, suas memórias e conexões profundas.
          </p>
        </div>
      </div>

      {/* Coluna Direita - Formulários */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 relative">
        <div className="md:hidden absolute top-8 left-8">
          <h1 className="font-display font-bold text-2xl text-[#1B3A2E] tracking-widest">IRIS</h1>
        </div>
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </div>
    </main>
  );
}