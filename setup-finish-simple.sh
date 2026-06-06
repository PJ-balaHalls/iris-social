#!/usr/bin/env bash
set -euo pipefail

mkdir -p src/app/onboarding/finish

cat > src/app/onboarding/finish/page.tsx <<'TSX'
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { OnboardingMinimalStep } from '@/components/onboarding/OnboardingMinimalStep';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { saveOnboardingProfile } from '@/lib/onboarding/saveOnboardingProfile';

export default function FinishPage() {
  const router = useRouter();
  const onboardingState = useOnboardingStore();

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message: string;
  }>({
    type: 'idle',
    message: '',
  });

  async function handleEnterIris() {
    setSaving(true);
    setStatus({ type: 'idle', message: '' });

    const result = await saveOnboardingProfile(onboardingState);

    setSaving(false);

    if (!result.ok) {
      setStatus({
        type: 'error',
        message: result.message,
      });
      return;
    }

    router.push('/iris');
  }

  return (
    <OnboardingMinimalStep
      eyebrow="Finalização"
      title="Obrigado por configurar a IRIS."
    >
      <div className="mx-auto w-full max-w-2xl">
        <div
          data-iris-onboarding-surface
          className="rounded-[34px] border border-white/70 bg-white/[0.22] px-5 py-8 text-center backdrop-blur-sm sm:px-8 sm:py-10"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f] shadow-[0_18px_45px_rgba(0,44,31,0.08)]">
            <CheckCircle2 size={34} strokeWidth={1.7} />
          </div>

          <p className="mt-7 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
            Onboarding concluído
          </p>

          <h2 className="mx-auto mt-3 max-w-xl font-display text-4xl leading-[1] tracking-[-0.055em] text-[#002c1f] sm:text-5xl">
            Seu espaço inicial está pronto.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#476153] sm:text-base">
            A IRIS já recebeu suas preferências iniciais. Agora você pode acessar a tela inicial e conferir o resumo completo do que foi configurado.
          </p>

          {status.message && (
            <div
              className={[
                'mx-auto mt-6 max-w-xl rounded-[20px] border px-4 py-3 text-left text-sm leading-6',
                status.type === 'success'
                  ? 'border-emerald-800/18 bg-emerald-800/[0.07] text-[#002c1f]'
                  : 'border-[#F3C9C7] bg-[#FCE8E8]/76 text-[#8F312D]',
              ].join(' ')}
            >
              {status.message}
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse items-center justify-center gap-3 sm:flex-row">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              disabled={saving}
              className="min-h-12 rounded-[18px] px-6 text-[#747D79] hover:text-[#002c1f]"
              onClick={() => router.back()}
            >
              <ArrowLeft size={16} strokeWidth={1.8} />
              Voltar
            </Button>

            <Button
              type="button"
              variant="auth"
              size="lg"
              disabled={saving}
              className="min-h-12 rounded-[18px] px-8"
              onClick={handleEnterIris}
            >
              {saving ? (
                <>
                  <Loader2 size={16} strokeWidth={1.8} className="animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  Acessar IRIS
                  <ArrowRight size={16} strokeWidth={1.8} />
                </>
              )}
            </Button>
          </div>

          {status.type === 'error' && (
            <button
              type="button"
              onClick={() => router.push('/iris')}
              className="mt-5 inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#747D79] transition-colors hover:text-[#002c1f]"
            >
              <Sparkles size={14} strokeWidth={1.8} />
              Acessar mesmo assim
            </button>
          )}
        </div>
      </div>
    </OnboardingMinimalStep>
  );
}
TSX

echo "✅ FE-IRIS-046 aplicado: finish simplificado com agradecimento e botão para acessar a IRIS."
