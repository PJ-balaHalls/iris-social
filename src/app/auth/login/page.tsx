'use client'
import { useState } from 'react';
import Link from 'next/link';
import { loginAction } from '@/lib/actions/auth.actions';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await loginAction(formData);
      if (response?.error) {
        setError(response.error);
        setLoading(false);
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl text-[#1B3A2E] mb-2">Que bom ter você aqui.</h2>
        <p className="text-[#476153]">Acesse seu espaço seguro de memórias.</p>
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
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-[#476153]" htmlFor="password">Senha</label>
            <Link href="/auth/forgot-password" className="text-sm text-[#9A7CA7] hover:underline">Esqueceu a senha?</Link>
          </div>
          <input 
            id="password"
            name="password"
            type="password" 
            required 
            placeholder="••••••••"
            className="w-full p-4 rounded-xl border border-[#E2E7E3] focus:border-[#9A7CA7] focus:ring-1 focus:ring-[#9A7CA7] outline-none transition-all bg-white text-[#1B3A2E]"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#1B3A2E] text-white py-4 rounded-xl font-medium hover:bg-[#00563E] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
        >
          {loading ? 'Destrancando seu espaço...' : 'Entrar no IRIS'}
        </button>
      </form>

      <div className="text-center">
        <p className="text-[#7A877F] text-sm">
          Ainda não tem o seu espaço?{' '}
          <Link href="/auth/register" className="text-[#1B3A2E] font-bold hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}