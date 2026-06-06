'use client'
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/lib/store/onboardingStore';

export default function PersonalityPage() {
  const router = useRouter();
  const { updateField } = useOnboardingStore();

  const selectTrait = (trait: string) => {
    updateField('personalityData', { mbti_guess: trait });
    router.push('/onboarding/culture');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <h1 className="font-display text-3xl text-[#1B3A2E]">Como você recarrega sua energia?</h1>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <button onClick={() => selectTrait('I')} className="p-4 border border-[#E2E7E3] rounded-xl hover:border-[#9A7CA7] text-left transition-colors bg-white">
          <span className="block font-medium text-[#1B3A2E]">No silêncio</span>
          <span className="text-sm text-[#7A877F]">Lendo, escrevendo, processando internamente.</span>
        </button>
        <button onClick={() => selectTrait('E')} className="p-4 border border-[#E2E7E3] rounded-xl hover:border-[#9A7CA7] text-left transition-colors bg-white">
          <span className="block font-medium text-[#1B3A2E]">Na troca</span>
          <span className="text-sm text-[#7A877F]">Conversando, explorando com outras pessoas.</span>
        </button>
      </div>
    </div>
  );
}