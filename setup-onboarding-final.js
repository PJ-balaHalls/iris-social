const fs = require('fs');
const path = require('path');

const dirs = [
  'src/lib/actions',
  'src/components/onboarding',
  'src/app/onboarding/kids'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const files = {
  // 1. COMPONENTE: BARRA DE PROGRESSO EMOCIONAL
  'src/components/onboarding/EmotionalProgressBar.tsx': `
'use client'
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const routeProgress: Record<string, number> = {
  '/onboarding/welcome': 5,
  '/onboarding/basic-info': 15,
  '/onboarding/avatar': 25,
  '/onboarding/username': 40,
  '/onboarding/personality': 55,
  '/onboarding/culture': 70,
  '/onboarding/intention': 85,
  '/onboarding/privacy': 95,
  '/onboarding/plan': 98,
  '/onboarding/finish': 100,
};

export function EmotionalProgressBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Evita mostrar progresso na rota kids
    if (pathname.includes('/kids')) {
      setProgress(0);
      return;
    }
    const currentProgress = routeProgress[pathname] || 0;
    setProgress(currentProgress);
  }, [pathname]);

  if (progress === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto h-1 bg-[#E2E7E3] rounded-full overflow-hidden mt-6">
      <div 
        className="h-full bg-[#9A7CA7] transition-all duration-1000 ease-out-soft"
        style={{ width: \`\${progress}%\` }}
      />
    </div>
  );
}
`,

  // 2. ATUALIZAÇÃO DO LAYOUT COM A BARRA DE PROGRESSO
  'src/app/onboarding/layout.tsx': `
import React from 'react';
import { EmotionalProgressBar } from '@/components/onboarding/EmotionalProgressBar';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1B3A2E] flex flex-col items-center justify-center font-sans relative overflow-hidden">
      {/* Fundo Botânico Suave (Efeito Blur/Glow sutil) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#DDEEE6] opacity-30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] bg-[#E9DDEE] opacity-30 rounded-full blur-3xl pointer-events-none" />

      <header className="absolute top-0 w-full p-8 flex flex-col items-center justify-center z-10">
        <div className="font-display font-bold text-2xl tracking-widest text-[#1B3A2E]">IRIS</div>
        <EmotionalProgressBar />
      </header>
      
      <div className="w-full max-w-md px-6 z-10">
        {children}
      </div>
    </main>
  );
}
`,

  // 3. TELA DE DESVIO: IRIS KIDS
  'src/app/onboarding/kids/page.tsx': `
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
`,

  // 4. SERVER ACTION: CONSOLIDAÇÃO ZERO-TRUST
  'src/lib/actions/onboarding.actions.ts': `
'use server'

import { createServer } from '@/lib/supabase/server';
import { FloraEspecie, FloraEstagio, FloraInclinacao, SubscriptionPlan } from '@/types/flora';

interface OnboardingPayload {
  firstName: string;
  birthDate: string;
  username: string;
  avatarUrl?: string;
  colorSymbol?: string;
  intention: FloraInclinacao;
  plan: SubscriptionPlan;
  privacyLevel: string;
  personalityData: any;
  cultureTags: string[];
}

export async function completeOnboardingAction(data: OnboardingPayload) {
  const supabase = createServer();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('IRIS_AUTH_002: Usuário não autenticado. A sessão pode ter expirado.');
  }

  // 1. ZERO-TRUST: Validação e Construção da Taxonomia Flora
  let especie: FloraEspecie = 'DENTEDELEAO';
  let estagio: FloraEstagio = 'BROTO';

  const birthYear = new Date(data.birthDate).getFullYear();
  const currentYear = new Date().getFullYear();
  if ((currentYear - birthYear) < 18) {
    throw new Error('IRIS_SEC_001: Menores de idade devem usar o ambiente IRIS Kids.');
  }

  if (data.plan === 'premium' || data.plan === 'duo') {
    especie = 'LOTUS';
    estagio = 'FLORESCENCIA';
  }

  // 2. Transação no Banco de Dados (Atualização do Perfil)
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      full_name: data.firstName,
      username: data.username,
      birth_date: data.birthDate,
      avatar_url: data.avatarUrl || null,
      color_symbol: data.colorSymbol || '#1B3A2E',
      personality_data: data.personalityData || {},
      especie,
      estagio,
      inclinacao: data.intention,
      onboarding_completed: true,
    })
    .eq('id', user.id);

  if (profileError) {
    // Tratar erro de username duplicado (Unique Constraint)
    if (profileError.code === '23505') {
      throw new Error('IRIS_DB_001: Este identificador único (@username) já encontrou um dono. Escolha outro.');
    }
    throw new Error('IRIS_DB_002: Falha ao semear o seu perfil. Tente novamente.');
  }

  // 3. Atualização da Assinatura
  const { error: subError } = await supabase
    .from('subscriptions')
    .update({ plan: data.plan })
    .eq('user_id', user.id);

  if (subError) console.error('Erro ao atualizar assinatura:', subError);

  // 4. Atualização das Claims do Auth (Crucial para o Middleware e Segurança Edge)
  await supabase.auth.updateUser({
    data: { 
      flora_claim: \`\${especie}-\${estagio}-\${data.intention}\`,
      onboarding_completed: true 
    }
  });

  return { success: true, redirect: '/app/home' };
}
`
};

Object.entries(files).forEach(([filepath, content]) => {
  fs.writeFileSync(filepath, content.trim());
  console.log(`📄 Arquivo atualizado/criado: ${filepath}`);
});

console.log('\\n✨ Consolidação do Onboarding concluída com sucesso!');