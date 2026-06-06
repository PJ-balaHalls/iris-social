'use client'

import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { completeOnboardingAction } from '@/lib/actions/onboarding.actions';
import { useState } from 'react';

export default function FinishPage() {
  const state = useOnboardingStore();
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    setLoading(true);
    try {
      await completeOnboardingAction({
        firstName: state.firstName || 'Viajante',
        birthDate: state.birthDate || '2000-01-01',
        intention: state.intention,
        plan: state.plan,
      });
      state.clearStore();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="text-center space-y-8 animate-in fade-in duration-1000">
      <div className="w-24 h-24 bg-[#E9DDEE] rounded-full mx-auto flex items-center justify-center">
        <div className="w-12 h-12 bg-[#9A7CA7] rounded-full animate-pulse" />
      </div>
      <h1 className="font-display text-4xl text-[#1B3A2E]">Tudo pronto.</h1>
      <p className="text-[#476153] text-lg">Suas raízes foram plantadas. O tempo passa, mas o que sentimos permanece.</p>
      
      <button 
        onClick={handleFinish}
        disabled={loading}
        className="w-full bg-[#006D4E] text-white py-4 rounded-xl font-medium hover:bg-[#00563E] transition-colors disabled:opacity-50"
      >
        {loading ? 'Preparando seu espaço...' : 'Entrar no IRIS'}
      </button>
    </div>
  );
}