'use client';

import { useCallback, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/global/Loader/Spinner';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { OnboardingBottomActions } from '@/components/onboarding/OnboardingBottomActions';
import { OnboardingFieldLine } from '@/components/onboarding/OnboardingFieldLine';
import { OnboardingMinimalStep } from '@/components/onboarding/OnboardingMinimalStep';
import { UsernameAvailabilityField } from './components/UsernameAvailabilityField';

export default function UsernamePage() {
  const router = useRouter();
  const { firstName, socialName, username, updateField } = useOnboardingStore();

  const [draftUsername, setDraftUsername] = useState(username);
  const [available, setAvailable] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState('');

  const handleAvailabilityChange = useCallback((value: boolean) => {
    setAvailable(value);
  }, []);

  function handleUsernameChange(value: string) {
    setDraftUsername(value);
    setAlert('');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!available) {
      setAlert('Escolha um nome disponível para continuar.');
      return;
    }

    setSaving(true);
    setAlert('');
    updateField('username', draftUsername);
    router.push('/onboarding/finish');
  }

  return (
    <OnboardingMinimalStep
      eyebrow="Identidade pública"
      title="Escolha seu @."
    >
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl">
        {alert && (
          <div className="mb-4 rounded-[20px] border border-[#E8CF8B] bg-[#FFF7DC]/70 px-4 py-3 text-sm leading-6 text-[#7A5A12]">
            {alert}
          </div>
        )}

        <div data-iris-onboarding-surface className="rounded-[26px] bg-white/[0.22] px-4 py-2 backdrop-blur-sm">
          <OnboardingFieldLine>
            <UsernameAvailabilityField
              value={draftUsername}
              firstName={firstName}
              socialName={socialName}
              onChange={handleUsernameChange}
              onAvailabilityChange={handleAvailabilityChange}
            />
          </OnboardingFieldLine>

          <OnboardingFieldLine>
            <p className="text-sm text-[#747D79]">Preview</p>

            <p className="mt-2 font-display text-3xl tracking-[-0.035em] text-[#002c1f]">
              {socialName || firstName || 'Seu nome'}
            </p>

            <p className="mt-1 font-mono text-sm text-[#476153]">
              @{draftUsername || 'username'}
            </p>
          </OnboardingFieldLine>
        </div>

        <OnboardingBottomActions
          helpTitle="O que essa etapa faz"
          help={
            <>
              <p>O @ é o identificador público do seu perfil dentro da IRIS.</p>
              <p>Ele precisa ser único e pode ser usado para convites, busca e vínculo com outros espaços.</p>
            </>
          }
          left={
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="min-h-12 rounded-[18px] px-6 text-[#747D79] hover:text-[#002c1f]"
              disabled={saving}
              onClick={() => router.back()}
            >
              Voltar
            </Button>
          }
          right={
            <Button
              type="submit"
              variant="auth"
              size="lg"
              disabled={!available || saving}
              className="min-h-12 rounded-[18px] px-8"
            >
              {saving ? (
                <span className="inline-flex items-center gap-3">
                  <Spinner size="sm" tone="light" label="Salvando username..." />
                  Salvando...
                </span>
              ) : (
                'Continuar'
              )}
            </Button>
          }
        />
      </form>
    </OnboardingMinimalStep>
  );
}
