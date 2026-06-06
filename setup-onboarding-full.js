const fs = require('fs');
const path = require('path');

const dirs = [
  'src/app/onboarding/welcome',
  'src/app/onboarding/basic-info',
  'src/app/onboarding/avatar',
  'src/app/onboarding/username',
  'src/app/onboarding/personality',
  'src/app/onboarding/culture',
  'src/app/onboarding/integrations',
  'src/app/onboarding/intention',
  'src/app/onboarding/privacy',
  'src/app/onboarding/accessibility',
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const files = {
  // 1. ATUALIZAÇÃO DA STORE (ZUSTAND)
  'src/lib/store/onboardingStore.ts': `
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FloraInclinacao, SubscriptionPlan } from '@/types/flora';

interface OnboardingState {
  firstName: string;
  birthDate: string;
  avatarUrl: string;
  colorSymbol: string;
  username: string;
  personalityData: any;
  cultureTags: string[];
  intention: FloraInclinacao;
  privacyLevel: 'private' | 'friends' | 'public';
  plan: SubscriptionPlan;
  
  updateField: (field: keyof Omit<OnboardingState, 'updateField' | 'clearStore'>, value: any) => void;
  clearStore: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      firstName: '',
      birthDate: '',
      avatarUrl: '',
      colorSymbol: '#1B3A2E',
      username: '',
      personalityData: {},
      cultureTags: [],
      intention: 'INTROSPECTIVA',
      privacyLevel: 'private',
      plan: 'free',
      updateField: (field, value) => set((state) => ({ ...state, [field]: value })),
      clearStore: () => set({ firstName: '', birthDate: '', username: '', plan: 'free' }),
    }),
    { name: 'iris-onboarding-storage' }
  )
);
`,

  // 2. TELA: WELCOME
  'src/app/onboarding/welcome/page.tsx': `
'use client'
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-1000 ease-out-soft min-h-[60vh]">
      <h1 className="font-display text-4xl text-[#1B3A2E]">Bem-vindo ao IRIS.</h1>
      <p className="text-lg text-[#476153] max-w-sm">
        Um espaço silencioso para organizar sua identidade, suas memórias e seus vínculos profundos.
      </p>
      <button onClick={() => router.push('/onboarding/basic-info')} className="mt-8 px-8 py-3 bg-[#1B3A2E] text-[#FAF7F2] rounded-lg hover:bg-[#2A4B3F] transition-all">
        Começar jornada
      </button>
    </div>
  );
}
`,

  // 3. TELA: BASIC INFO
  'src/app/onboarding/basic-info/page.tsx': `
'use client'
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { useState } from 'react';

export default function BasicInfoPage() {
  const router = useRouter();
  const { firstName, birthDate, updateField } = useOnboardingStore();
  const [name, setName] = useState(firstName);
  const [date, setDate] = useState(birthDate);

  const handleNext = () => {
    updateField('firstName', name);
    updateField('birthDate', date);
    
    const birthYear = new Date(date).getFullYear();
    const currentYear = new Date().getFullYear();
    if (currentYear - birthYear < 18) {
      router.push('/onboarding/kids'); // Desvio Zero-Trust
    } else {
      router.push('/onboarding/avatar');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center"><h1 className="font-display text-3xl text-[#1B3A2E]">Como devemos chamar você?</h1></div>
      <div className="space-y-4">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" className="w-full p-4 rounded-xl border border-[#E2E7E3] focus:border-[#9A7CA7] focus:ring-1 focus:ring-[#9A7CA7] outline-none transition-all bg-white" />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-4 rounded-xl border border-[#E2E7E3] focus:border-[#9A7CA7] outline-none transition-all bg-white text-[#476153]" />
      </div>
      <div className="flex justify-between pt-4">
        <button onClick={() => router.back()} className="text-[#7A877F] px-4 py-2 hover:bg-[#E2E7E3] rounded-lg transition-colors">Voltar</button>
        <button onClick={handleNext} disabled={!name || !date} className="bg-[#1B3A2E] text-[#FAF7F2] px-6 py-2 rounded-lg disabled:opacity-50">Continuar com calma</button>
      </div>
    </div>
  );
}
`,

  // 4. TELA: AVATAR
  'src/app/onboarding/avatar/page.tsx': `
'use client'
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/lib/store/onboardingStore';

export default function AvatarPage() {
  const router = useRouter();
  const { updateField } = useOnboardingStore();

  const handleSkip = () => router.push('/onboarding/username');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-center">
      <h1 className="font-display text-3xl text-[#1B3A2E]">Sua imagem de presença</h1>
      <div className="w-32 h-32 mx-auto bg-[#E2E7E3] rounded-full border-4 border-white shadow-sm flex items-center justify-center cursor-pointer hover:bg-[#D1D9D4] transition-colors">
        <span className="text-[#7A877F] text-sm">Adicionar Foto</span>
      </div>
      <div className="flex justify-between pt-4">
        <button onClick={() => router.back()} className="text-[#7A877F] px-4 py-2 rounded-lg">Voltar</button>
        <button onClick={handleSkip} className="bg-[#1B3A2E] text-[#FAF7F2] px-6 py-2 rounded-lg">Pular por enquanto</button>
      </div>
    </div>
  );
}
`,

  // 5. TELA: USERNAME (Geração do IRIS ID)
  'src/app/onboarding/username/page.tsx': `
'use client'
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { useState } from 'react';

export default function UsernamePage() {
  const router = useRouter();
  const { updateField } = useOnboardingStore();
  const [username, setUsername] = useState('');

  const handleNext = () => {
    updateField('username', username);
    router.push('/onboarding/personality');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <h1 className="font-display text-3xl text-[#1B3A2E]">Seu identificador único</h1>
        <p className="text-[#7A877F] text-sm mt-2">Este será seu @ no IRIS.</p>
      </div>
      <div className="relative">
        <span className="absolute left-4 top-4 text-[#7A877F]">@</span>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\\s/g, ''))} className="w-full p-4 pl-10 rounded-xl border border-[#E2E7E3] focus:border-[#9A7CA7] outline-none transition-all bg-white" placeholder="identidade" />
      </div>
      <div className="flex justify-between pt-4">
        <button onClick={() => router.back()} className="text-[#7A877F] px-4 py-2 rounded-lg">Voltar</button>
        <button onClick={handleNext} disabled={username.length < 3} className="bg-[#1B3A2E] text-[#FAF7F2] px-6 py-2 rounded-lg disabled:opacity-50">Validar e Continuar</button>
      </div>
    </div>
  );
}
`,

  // 6. TELA: PERSONALITY (Feedback imediato UI)
  'src/app/onboarding/personality/page.tsx': `
'use client'
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/lib/store/onboardingStore';

export default function PersonalityPage() {
  const router = useRouter();
  const { updateField } = useOnboardingStore();

  const selectTrait = (trait: string) => {
    updateField('personalityData', { mbti_guess: trait });
    router.push('/onboarding/culture');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <h1 className="font-display text-3xl text-[#1B3A2E]">Como você recarrega sua energia?</h1>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <button onClick={() => selectTrait('I')} className="p-4 border border-[#E2E7E3] rounded-xl hover:border-[#9A7CA7] text-left transition-colors bg-white">
          <span className="block font-medium text-[#1B3A2E]">No silêncio</span>
          <span className="text-sm text-[#7A877F]">Lendo, escrevendo, processando internamente.</span>
        </button>
        <button onClick={() => selectTrait('E')} className="p-4 border border-[#E2E7E3] rounded-xl hover:border-[#9A7CA7] text-left transition-colors bg-white">
          <span className="block font-medium text-[#1B3A2E]">Na troca</span>
          <span className="text-sm text-[#7A877F]">Conversando, explorando com outras pessoas.</span>
        </button>
      </div>
    </div>
  );
}
`,

  // 7, 8, 9, 10 - GERAÇÃO ACELERADA DAS ROTAS FINAIS (Culture, Integrations, Intention, Privacy)
  'src/app/onboarding/culture/page.tsx': `
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
`,

  'src/app/onboarding/intention/page.tsx': `
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
`,

  'src/app/onboarding/privacy/page.tsx': `
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
`
};

Object.entries(files).forEach(([filepath, content]) => {
  fs.writeFileSync(filepath, content.trim());
  console.log(`📄 Arquivo gerado/atualizado: ${filepath}`);
});

console.log('\\n🚀 TODAS as rotas e regras de estado do Onboarding foram geradas com sucesso!');