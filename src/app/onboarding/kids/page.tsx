'use client'
import { useRouter } from 'next/navigation';

export default function KidsDeflectionPage() {
  const router = useRouter();

  return (
    <div className="text-center space-y-8 animate-in fade-in duration-700">
      <div className="w-20 h-20 bg-[#DDEEE6] rounded-3xl rotate-12 mx-auto flex items-center justify-center shadow-sm">
        <span className="text-3xl rotate-[-12deg]">🌱</span>
      </div>
      <h1 className="font-display text-3xl text-[#1B3A2E]">O seu espaço está brotando.</h1>
      <p className="text-[#476153]">
        Percebemos que você ainda está descobrindo o mundo. No IRIS, cuidamos das memórias de todos com muito carinho.
        Por isso, preparamos um ambiente especial e protegido chamado <strong>IRIS Kids</strong>.
      </p>
      <div className="pt-6">
        <button 
          onClick={() => router.push('/kids/home')}
          className="bg-[#1B3A2E] text-white px-8 py-3 rounded-xl hover:bg-[#00563E] transition-all"
        >
          Entrar no IRIS Kids
        </button>
      </div>
    </div>
  );
}