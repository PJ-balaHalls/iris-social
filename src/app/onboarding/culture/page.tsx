'use client'
import { useRouter } from 'next/navigation';
export default function CulturePage() {
  const router = useRouter();
  return (
    <div className="text-center space-y-8 animate-in fade-in">
      <h1 className="font-display text-3xl text-[#1B3A2E]">Seus Universos</h1>
      <p className="text-[#7A877F]">O que molda sua visão de mundo? (Artes, Filosofia, Ciência...)</p>
      <button onClick={() => router.push('/onboarding/intention')} className="bg-[#1B3A2E] text-white px-6 py-2 rounded-lg w-full">Continuar</button>
    </div>
  );
}