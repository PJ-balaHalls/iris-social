const fs = require('fs');
const path = require('path');

const dirs = [
  'src/lib/actions',
  'src/app/auth',
  'src/app/auth/login',
  'src/app/auth/register'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const files = {
  // 1. SERVER ACTIONS PARA AUTENTICAÇÃO (Segurança Zero-Trust)
  'src/lib/actions/auth.actions.ts': `
'use server'

import { createServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = createServer();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Tratamento de Erro IRIS
    console.error('IRIS_AUTH_001:', error.message);
    return { error: 'E-mail ou senha incorretos. Suas memórias estão protegidas.' };
  }

  // Verifica se o usuário já completou o onboarding lendo o banco de dados
  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', data.user.id)
    .single();

  if (profile?.onboarding_completed) {
    redirect('/app/home');
  } else {
    redirect('/onboarding/welcome');
  }
}

export async function registerAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = createServer();

  const { error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      // Evita o redirecionamento automático se a confirmação de email estiver ativa no Supabase
      emailRedirectTo: \`\${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback\`
    }
  });

  if (error) {
    console.error('IRIS_AUTH_003:', error.message);
    return { error: 'Não foi possível preparar o seu espaço. Tente novamente ou use outro e-mail.' };
  }

  // Se o Supabase estiver configurado para exigir confirmação de e-mail,
  // aqui deveríamos mandar para uma tela de "Verifique seu e-mail".
  // Supondo login direto após registro para o escopo atual:
  redirect('/onboarding/welcome');
}
`,

  // 2. LAYOUT COMPARTILHADO DA ÁREA DE AUTH
  'src/app/auth/layout.tsx': `
import React from 'react';
import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1B3A2E] flex flex-col md:flex-row font-sans overflow-hidden">
      {/* Coluna Esquerda - Espaço Visual (Manifesto Silencioso) */}
      <div className="hidden md:flex md:w-1/2 bg-[#1B3A2E] relative flex-col justify-between p-12 overflow-hidden">
        {/* Elemento Botânico Abstrato - Parallax/Glow */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-[#2A4B3F] rounded-full blur-[120px] opacity-60 pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#006D4E] rounded-full blur-[100px] opacity-40 pointer-events-none" />
        
        <div className="z-10 text-[#FAF7F2]">
          <h1 className="font-display font-bold text-3xl tracking-widest">IRIS</h1>
        </div>

        <div className="z-10 max-w-md">
          <p className="font-display text-4xl text-[#FAF7F2] leading-tight mb-4">
            O tempo passa,<br/>mas o que sentimos permanece.
          </p>
          <p className="text-[#A2B3AA] text-lg">
            Um espaço protegido para sua identidade, suas memórias e conexões profundas.
          </p>
        </div>
      </div>

      {/* Coluna Direita - Formulários */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 relative">
        <div className="md:hidden absolute top-8 left-8">
          <h1 className="font-display font-bold text-2xl text-[#1B3A2E] tracking-widest">IRIS</h1>
        </div>
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </div>
    </main>
  );
}
`,

  // 3. TELA DE LOGIN
  'src/app/auth/login/page.tsx': `
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
`,

  // 4. TELA DE REGISTRO
  'src/app/auth/register/page.tsx': `
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
`
};

Object.entries(files).forEach(([filepath, content]) => {
  fs.writeFileSync(filepath, content.trim());
  console.log(`📄 Arquivo atualizado/criado: ${filepath}`);
});

console.log('\\n🔐 Módulo de Autenticação (Login/Registro) gerado com sucesso!');