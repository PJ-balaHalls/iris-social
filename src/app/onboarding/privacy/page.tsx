'use client'
import { useRouter } from 'next/navigation';
export default function PrivacyPage() {
  const router = useRouter();
  return (
    <div className="text-center space-y-8 animate-in fade-in">
      <h1 className="font-display text-3xl text-[#1B3A2E]">Privacidade por Padrão</h1>
      <p className="text-[#7A877F]">No IRIS, você controla quem vê seus blocos de memória. Criptografia E2EE está ativada nas suas cartas.</p>
      <button onClick={() => router.push('/onboarding/plan')} className="bg-[#1B3A2E] text-white px-6 py-2 rounded-lg w-full">Compreendido</button>
    </div>
  );
}