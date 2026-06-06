'use client'
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { useState } from 'react';

export default function UsernamePage() {
  const router = useRouter();
  const { updateField } = useOnboardingStore();
  const [username, setUsername] = useState('');

  const handleNext = () => {
    updateField('username', username);
    router.push('/onboarding/personality');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <h1 className="font-display text-3xl text-[#1B3A2E]">Seu identificador único</h1>
        <p className="text-[#7A877F] text-sm mt-2">Este será seu @ no IRIS.</p>
      </div>
      <div className="relative">
        <span className="absolute left-4 top-4 text-[#7A877F]">@</span>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))} className="w-full p-4 pl-10 rounded-xl border border-[#E2E7E3] focus:border-[#9A7CA7] outline-none transition-all bg-white" placeholder="identidade" />
      </div>
      <div className="flex justify-between pt-4">
        <button onClick={() => router.back()} className="text-[#7A877F] px-4 py-2 rounded-lg">Voltar</button>
        <button onClick={handleNext} disabled={username.length < 3} className="bg-[#1B3A2E] text-[#FAF7F2] px-6 py-2 rounded-lg disabled:opacity-50">Validar e Continuar</button>
      </div>
    </div>
  );
}