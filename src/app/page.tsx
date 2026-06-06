'use client'

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1B3A2E] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-1000">
      
      {/* Espaço Editorial */}
      <div className="max-w-2xl space-y-6">
        <div className="font-display text-5xl md:text-6xl font-bold tracking-tight">
          IRIS Social
        </div>
        <p className="text-xl md:text-2xl text-[#476153] leading-relaxed">
          Um espaço digital para organizar sua identidade, preservar memórias e cultivar vínculos profundos.
        </p>
      </div>

      {/* Ações de Entrada */}
      <div className="flex flex-col md:flex-row gap-4 mt-12 w-full max-w-sm">
        <Button 
          variant="primary" 
          className="w-full py-4 text-lg"
          onClick={() => router.push('/auth/register')}
        >
          Criar minha conta
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full py-4 text-lg border border-[#E2E7E3]"
          onClick={() => router.push('/auth/login')}
        >
          Entrar
        </Button>
      </div>

      {/* Rodapé institucional minimalista */}
      <footer className="absolute bottom-8 text-sm text-[#7A877F]">
        <nav className="flex gap-6">
          <button onClick={() => router.push('/manifesto')} className="hover:underline">Manifesto</button>
          <button onClick={() => router.push('/produto')} className="hover:underline">Conceito</button>
          <button onClick={() => router.push('/planos')} className="hover:underline">Planos</button>
        </nav>
      </footer>
    </main>
  );
}