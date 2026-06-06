'use client'
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-1000 ease-out-soft min-h-[60vh]">
      <h1 className="font-display text-4xl text-[#1B3A2E]">Bem-vindo ao IRIS.</h1>
      <p className="text-lg text-[#476153] max-w-sm">
        Um espaço silencioso para organizar sua identidade, suas memórias e seus vínculos profundos.
      </p>
      <button onClick={() => router.push('/onboarding/basic-info')} className="mt-8 px-8 py-3 bg-[#1B3A2E] text-[#FAF7F2] rounded-lg hover:bg-[#2A4B3F] transition-all">
        Começar jornada
      </button>
    </div>
  );
}