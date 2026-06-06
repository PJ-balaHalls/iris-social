'use client'
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/lib/store/onboardingStore';

export default function IntentionPage() {
  const router = useRouter();
  const { updateField } = useOnboardingStore();

  const setIntention = (intention: any) => {
    updateField('intention', intention);
    router.push('/onboarding/privacy');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <h1 className="font-display text-3xl text-[#1B3A2E] text-center">Sua intenção primária</h1>
      <button onClick={() => setIntention('INTROSPECTIVA')} className="w-full p-4 bg-white border border-[#E2E7E3] rounded-xl hover:border-[#9A7CA7]">Preservar minhas memórias</button>
      <button onClick={() => setIntention('SIMBIOTICA')} className="w-full p-4 bg-white border border-[#E2E7E3] rounded-xl hover:border-[#9A7CA7]">Construir um espaço a dois (usLIFE)</button>
      <button onClick={() => setIntention('CULTURAL')} className="w-full p-4 bg-white border border-[#E2E7E3] rounded-xl hover:border-[#9A7CA7]">Explorar comunidades</button>
    </div>
  );
}