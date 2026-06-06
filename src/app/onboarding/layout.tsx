import React from 'react';
import { EmotionalProgressBar } from '@/components/onboarding/EmotionalProgressBar';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1B3A2E] flex flex-col items-center justify-center font-sans relative overflow-hidden">
      {/* Fundo Botânico Suave (Efeito Blur/Glow sutil) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#DDEEE6] opacity-30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] bg-[#E9DDEE] opacity-30 rounded-full blur-3xl pointer-events-none" />

      <header className="absolute top-0 w-full p-8 flex flex-col items-center justify-center z-10">
        <div className="font-display font-bold text-2xl tracking-widest text-[#1B3A2E]">IRIS</div>
        <EmotionalProgressBar />
      </header>
      
      <div className="w-full max-w-md px-6 z-10">
        {children}
      </div>
    </main>
  );
}