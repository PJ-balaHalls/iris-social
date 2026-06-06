import Link from 'next/link';
import { OnboardingMinimalStep } from '@/components/onboarding/OnboardingMinimalStep';
import { OnboardingBottomActions } from '@/components/onboarding/OnboardingBottomActions';

export default function WelcomePage() {
  return (
    <OnboardingMinimalStep
      eyebrow="Primeiro passo"
      title="Vamos começar com o essencial."
    >
      <div className="mx-auto mt-14 flex w-full max-w-xl flex-col items-center text-center">
        <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-[#B9C8B5] to-transparent" />

        <Link
          href="/onboarding/basic-info"
          className="inline-flex min-h-12 items-center justify-center rounded-[18px] bg-emerald-800 px-9 text-base font-medium text-white shadow-[0_12px_28px_rgba(0,44,31,0.18)] transition-all hover:bg-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-800/10"
        >
          Começar
        </Link>

        <OnboardingBottomActions
          className="w-full pt-6"
          helpTitle="O que acontece agora"
          help={
            <>
              <p>O onboarding ajuda a IRIS a preparar um espaço mais coerente com sua identidade.</p>
              <p>Você vai passar por pequenas etapas: dados básicos, imagem, nome público e preferências iniciais.</p>
              <p>Tudo poderá ser ajustado depois nas configurações.</p>
            </>
          }
        />
      </div>
    </OnboardingMinimalStep>
  );
}
