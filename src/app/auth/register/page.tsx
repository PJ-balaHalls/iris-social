'use client'
import { useState } from 'react';
import Link from 'next/link';
import { registerAction } from '@/lib/actions/auth.actions';

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    const password = formData.get('password') as string;
    if (password.length < 8) {
      setError('Sua senha precisa ter pelo menos 8 caracteres para garantir sua segurança.');
      setLoading(false);
      return;
    }

    try {
      const response = await registerAction(formData);
      if (response?.error) {
        setError(response.error);
        setLoading(false);
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado ao plantar suas raízes.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl text-[#1B3A2E] mb-2">Plante suas raízes.</h2>
        <p className="text-[#476153]">O primeiro passo para criar o seu espaço no IRIS.</p>
      </div>

      {error && (
        <div className="p-4 bg-[#FCE8E8] text-[#B3261E] rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="text-sm font-medium text-[#476153]" htmlFor="email">E-mail</label>
          <input 
            id="email"
            name="email"
            type="email" 
            required 
            placeholder="voce@exemplo.com"
            className="w-full p-4 rounded-xl border border-[#E2E7E3] focus:border-[#9A7CA7] focus:ring-1 focus:ring-[#9A7CA7] outline-none transition-all bg-white text-[#1B3A2E]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-[#476153]" htmlFor="password">Senha (Mínimo 8 caracteres)</label>
          <input 
            id="password"
            name="password"
            type="password" 
            required 
            placeholder="••••••••"
            className="w-full p-4 rounded-xl border border-[#E2E7E3] focus:border-[#9A7CA7] focus:ring-1 focus:ring-[#9A7CA7] outline-none transition-all bg-white text-[#1B3A2E]"
          />
        </div>

        <p className="text-xs text-[#7A877F] mt-2">
          Ao continuar, você concorda com nossos Termos de Privacidade e Proteção de Memórias.
        </p>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#1B3A2E] text-white py-4 rounded-xl font-medium hover:bg-[#00563E] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Semeando espaço...' : 'Criar minha conta'}
        </button>
      </form>

      <div className="text-center">
        <p className="text-[#7A877F] text-sm">
          Já tem o seu espaço?{' '}
          <Link href="/auth/login" className="text-[#1B3A2E] font-bold hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}