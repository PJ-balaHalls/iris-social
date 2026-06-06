'use client'

import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { useRouter } from 'next/navigation';

export default function PlanPage() {
  const { setPlan } = useOnboardingStore();
  const router = useRouter();

  const handleSelectPlan = (plan: 'free' | 'premium' | 'duo') => {
    setPlan(plan);
    router.push('/onboarding/finish');
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h1 className="font-display text-4xl text-[#1B3A2E]">Como deseja cultivar seu espaço?</h1>
        <p className="text-[#476153] text-lg">Escolha como suas memórias criarão raízes no IRIS.</p>
      </div>

      <div className="flex flex-col gap-4">
        <button 
          onClick={() => handleSelectPlan('free')}
          className="p-6 border border-[#E2E7E3] rounded-2xl hover:border-[#006D4E] transition-all text-left bg-white shadow-sm"
        >
          <h3 className="font-bold text-xl text-[#1B3A2E]">Dente-de-Leão (Gratuito)</h3>
          <p className="text-[#7A877F] mt-2">Para quem deseja observar. 5 blocos de memória.</p>
        </button>

        <button 
          onClick={() => handleSelectPlan('premium')}
          className="p-6 border-2 border-[#006D4E] rounded-2xl hover:bg-[#DDEEE6] transition-all text-left bg-[#FAF7F2] shadow-md relative overflow-hidden"
        >
          <span className="absolute top-0 right-0 bg-[#006D4E] text-white text-xs px-3 py-1 rounded-bl-lg font-medium">Recomendado</span>
          <h3 className="font-bold text-xl text-[#1B3A2E]">Lótus (Premium)</h3>
          <p className="text-[#7A877F] mt-2">Blocos ilimitados. IRIS AI avançada. O espaço perfeito para sua identidade.</p>
        </button>
      </div>
    </div>
  );
}