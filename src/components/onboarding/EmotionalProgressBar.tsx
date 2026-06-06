'use client';

import { usePathname } from 'next/navigation';

const essentialSteps = [
  { path: '/onboarding/basic-info', label: 'Dados' },
  { path: '/onboarding/username', label: 'Usuário' },
  { path: '/onboarding/finish', label: 'Final' },
];

const profileSteps = [
  { path: '/onboarding/avatar', label: 'Imagem' },
  { path: '/onboarding/personality', label: 'Perfil' },
  { path: '/onboarding/culture', label: 'Cultura' },
  { path: '/onboarding/integrations', label: 'Integrações' },
  { path: '/onboarding/intention', label: 'Intenção' },
  { path: '/onboarding/privacy', label: 'Privacidade' },
  { path: '/onboarding/accessibility', label: 'Acessibilidade' },
  { path: '/onboarding/uslife-invite', label: 'usLIFE' },
  { path: '/onboarding/plan', label: 'Plano' },
  { path: '/onboarding/finish', label: 'Final' },
];

export function EmotionalProgressBar() {
  const pathname = usePathname();

  const isProfileCompletion = profileSteps.some((step) => pathname.startsWith(step.path));
  const steps = isProfileCompletion ? profileSteps : essentialSteps;

  const foundIndex = steps.findIndex((step) => pathname.startsWith(step.path));
  const currentIndex = Math.max(0, foundIndex);
  const percentage = ((currentIndex + 1) / steps.length) * 100;
  const currentStep = steps[currentIndex] || steps[0];

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mb-2 flex items-center justify-center gap-3 text-center">
        <span className="text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
          {String(currentIndex + 1).padStart(2, '0')}
        </span>

        <span className="h-px w-8 bg-[#C7CFCC]" />

        <span className="text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-[#002c1f]">
          {currentStep.label}
        </span>

        <span className="h-px w-8 bg-[#C7CFCC]" />

        <span className="text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
          {steps.length}
        </span>
      </div>

      <div className="relative h-[6px] overflow-hidden rounded-full border border-white/60 bg-white/52 shadow-[inset_0_1px_2px_rgba(17,17,17,0.04)] backdrop-blur-xl">
        <div
          className="h-full rounded-full bg-[#002c1f] transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
