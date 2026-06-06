'use client'
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/lib/store/onboardingStore';

export default function AvatarPage() {
  const router = useRouter();
  const { updateField } = useOnboardingStore();

  const handleSkip = () => router.push('/onboarding/username');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-center">
      <h1 className="font-display text-3xl text-[#1B3A2E]">Sua imagem de presença</h1>
      <div className="w-32 h-32 mx-auto bg-[#E2E7E3] rounded-full border-4 border-white shadow-sm flex items-center justify-center cursor-pointer hover:bg-[#D1D9D4] transition-colors">
        <span className="text-[#7A877F] text-sm">Adicionar Foto</span>
      </div>
      <div className="flex justify-between pt-4">
        <button onClick={() => router.back()} className="text-[#7A877F] px-4 py-2 rounded-lg">Voltar</button>
        <button onClick={handleSkip} className="bg-[#1B3A2E] text-[#FAF7F2] px-6 py-2 rounded-lg">Pular por enquanto</button>
      </div>
    </div>
  );
}