// setup-onboarding.js
const fs = require('fs');
const path = require('path');

const dirs = [
  'src/types',
  'src/lib/store',
  'src/lib/actions',
  'src/app/onboarding',
  'src/app/onboarding/welcome',
  'src/app/onboarding/basic-info',
  'src/app/onboarding/plan',
  'src/app/onboarding/finish'
];

// Cria os diretórios
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Diretório criado: ${dir}`);
  }
});

const files = {
  'src/types/flora.d.ts': `
// Definições Globais da Taxonomia Flora
export type FloraEspecie = 'DENTEDELEAO' | 'LOTUS' | 'ORQUIDEA' | 'TULIPA' | 'IRIS';
export type FloraEstagio = 'DORMENTE' | 'BROTO' | 'FLORESCENCIA' | 'BIOMA';
export type FloraInclinacao = 'INTROSPECTIVA' | 'SIMBIOTICA' | 'CULTURAL' | 'NULA';
export type SubscriptionPlan = 'free' | 'premium' | 'duo';

export interface UserFloraContext {
  especie: FloraEspecie;
  estagio: FloraEstagio;
  inclinacao: FloraInclinacao;
}
`,

  'src/lib/store/onboardingStore.ts': `
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FloraInclinacao, SubscriptionPlan } from '@/types/flora';

interface OnboardingState {
  firstName: string;
  birthDate: string;
  intention: FloraInclinacao;
  plan: SubscriptionPlan;
  setBasicInfo: (name: string, date: string) => void;
  setIntention: (intention: FloraInclinacao) => void;
  setPlan: (plan: SubscriptionPlan) => void;
  clearStore: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      firstName: '',
      birthDate: '',
      intention: 'INTROSPECTIVA',
      plan: 'free',
      setBasicInfo: (firstName, birthDate) => set({ firstName, birthDate }),
      setIntention: (intention) => set({ intention }),
      setPlan: (plan) => set({ plan }),
      clearStore: () => set({ firstName: '', birthDate: '', intention: 'INTROSPECTIVA', plan: 'free' }),
    }),
    {
      name: 'iris-onboarding-storage',
    }
  )
);
`,

  'src/lib/actions/onboarding.actions.ts': `
'use server'

import { createServer } from '@/lib/supabase/server';
import { FloraEspecie, FloraEstagio, FloraInclinacao, SubscriptionPlan } from '@/types/flora';
import { redirect } from 'next/navigation';

export async function completeOnboardingAction(data: {
  firstName: string;
  birthDate: string;
  intention: FloraInclinacao;
  plan: SubscriptionPlan;
}) {
  const supabase = createServer();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) throw new Error('Não autenticado');

  // CORE-IRIS-002: Lógica de Motor Flora (Server-Side)
  let especie: FloraEspecie = 'DENTEDELEAO';
  let estagio: FloraEstagio = 'BROTO';

  // Validação de Menor de Idade (Exemplo simples, em prod usar lib de datas)
  const birthYear = new Date(data.birthDate).getFullYear();
  const currentYear = new Date().getFullYear();
  const isUnderage = (currentYear - birthYear) < 18;

  if (isUnderage) {
    especie = 'DENTEDELEAO';
    estagio = 'BROTO'; // Força Kids/Broto
  } else if (data.plan === 'premium' || data.plan === 'duo') {
    // Em produção: verificar se o pagamento no Stripe foi confirmado antes de setar LOTUS
    especie = 'LOTUS';
    estagio = 'FLORESCENCIA';
  }

  // 1. Atualiza Perfil
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      full_name: data.firstName,
      birth_date: data.birthDate,
      especie,
      estagio,
      inclinacao: data.intention,
      onboarding_completed: true,
    })
    .eq('id', user.id);

  if (profileError) throw new Error('Falha ao atualizar perfil afetivo.');

  // 2. Atualiza Assinatura
  await supabase
    .from('subscriptions')
    .update({ plan: data.plan })
    .eq('user_id', user.id);

  // 3. Atualiza claims customizadas no Auth (para o Middleware e Edge Functions)
  await supabase.auth.updateUser({
    data: { flora_claim: \`\${especie}-\${estagio}-\${data.intention}\` }
  });

  // Redireciona para o App Principal
  redirect('/app/home');
}
`,

  'src/app/onboarding/layout.tsx': `
import React from 'react';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1B3A2E] flex flex-col items-center justify-center font-sans">
      <header className="absolute top-0 w-full p-8 flex justify-between items-center max-w-7xl">
        <div className="font-display font-bold text-2xl tracking-widest">IRIS</div>
        {/* Futura barra de progresso emocional */}
      </header>
      <div className="w-full max-w-md px-6">
        {children}
      </div>
    </main>
  );
}
`,

  'src/app/onboarding/plan/page.tsx': `
'use client'

import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { useRouter } from 'next/navigation';

export default function PlanPage() {
  const { setPlan } = useOnboardingStore();
  const router = useRouter();

  const handleSelectPlan = (plan: 'free' | 'premium' | 'duo') => {
    setPlan(plan);
    router.push('/onboarding/finish');
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h1 className="font-display text-4xl text-[#1B3A2E]">Como deseja cultivar seu espaço?</h1>
        <p className="text-[#476153] text-lg">Escolha como suas memórias criarão raízes no IRIS.</p>
      </div>

      <div className="flex flex-col gap-4">
        <button 
          onClick={() => handleSelectPlan('free')}
          className="p-6 border border-[#E2E7E3] rounded-2xl hover:border-[#006D4E] transition-all text-left bg-white shadow-sm"
        >
          <h3 className="font-bold text-xl text-[#1B3A2E]">Dente-de-Leão (Gratuito)</h3>
          <p className="text-[#7A877F] mt-2">Para quem deseja observar. 5 blocos de memória.</p>
        </button>

        <button 
          onClick={() => handleSelectPlan('premium')}
          className="p-6 border-2 border-[#006D4E] rounded-2xl hover:bg-[#DDEEE6] transition-all text-left bg-[#FAF7F2] shadow-md relative overflow-hidden"
        >
          <span className="absolute top-0 right-0 bg-[#006D4E] text-white text-xs px-3 py-1 rounded-bl-lg font-medium">Recomendado</span>
          <h3 className="font-bold text-xl text-[#1B3A2E]">Lótus (Premium)</h3>
          <p className="text-[#7A877F] mt-2">Blocos ilimitados. IRIS AI avançada. O espaço perfeito para sua identidade.</p>
        </button>
      </div>
    </div>
  );
}
`,

  'src/app/onboarding/finish/page.tsx': `
'use client'

import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { completeOnboardingAction } from '@/lib/actions/onboarding.actions';
import { useState } from 'react';

export default function FinishPage() {
  const state = useOnboardingStore();
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    setLoading(true);
    try {
      await completeOnboardingAction({
        firstName: state.firstName || 'Viajante',
        birthDate: state.birthDate || '2000-01-01',
        intention: state.intention,
        plan: state.plan,
      });
      state.clearStore();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="text-center space-y-8 animate-in fade-in duration-1000">
      <div className="w-24 h-24 bg-[#E9DDEE] rounded-full mx-auto flex items-center justify-center">
        <div className="w-12 h-12 bg-[#9A7CA7] rounded-full animate-pulse" />
      </div>
      <h1 className="font-display text-4xl text-[#1B3A2E]">Tudo pronto.</h1>
      <p className="text-[#476153] text-lg">Suas raízes foram plantadas. O tempo passa, mas o que sentimos permanece.</p>
      
      <button 
        onClick={handleFinish}
        disabled={loading}
        className="w-full bg-[#006D4E] text-white py-4 rounded-xl font-medium hover:bg-[#00563E] transition-colors disabled:opacity-50"
      >
        {loading ? 'Preparando seu espaço...' : 'Entrar no IRIS'}
      </button>
    </div>
  );
}
`
};

Object.entries(files).forEach(([filepath, content]) => {
  fs.writeFileSync(filepath, content.trim());
  console.log(`📄 Arquivo criado: ${filepath}`);
});

console.log('\\n🚀 Estrutura base de Onboarding finalizada com sucesso!');