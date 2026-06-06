'use client'
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { useState } from 'react';

export default function BasicInfoPage() {
  const router = useRouter();
  const { firstName, birthDate, updateField } = useOnboardingStore();
  const [name, setName] = useState(firstName);
  const [date, setDate] = useState(birthDate);

  const handleNext = () => {
    updateField('firstName', name);
    updateField('birthDate', date);
    
    const birthYear = new Date(date).getFullYear();
    const currentYear = new Date().getFullYear();
    if (currentYear - birthYear < 18) {
      router.push('/onboarding/kids'); // Desvio Zero-Trust
    } else {
      router.push('/onboarding/avatar');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center"><h1 className="font-display text-3xl text-[#1B3A2E]">Como devemos chamar você?</h1></div>
      <div className="space-y-4">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" className="w-full p-4 rounded-xl border border-[#E2E7E3] focus:border-[#9A7CA7] focus:ring-1 focus:ring-[#9A7CA7] outline-none transition-all bg-white" />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-4 rounded-xl border border-[#E2E7E3] focus:border-[#9A7CA7] outline-none transition-all bg-white text-[#476153]" />
      </div>
      <div className="flex justify-between pt-4">
        <button onClick={() => router.back()} className="text-[#7A877F] px-4 py-2 hover:bg-[#E2E7E3] rounded-lg transition-colors">Voltar</button>
        <button onClick={handleNext} disabled={!name || !date} className="bg-[#1B3A2E] text-[#FAF7F2] px-6 py-2 rounded-lg disabled:opacity-50">Continuar com calma</button>
      </div>
    </div>
  );
}