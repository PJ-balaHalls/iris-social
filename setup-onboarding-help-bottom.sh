#!/usr/bin/env bash
set -euo pipefail

cat > src/components/onboarding/OnboardingStepInfoDrawer.tsx <<'TSX'
'use client';

import { useEffect, useState, type ReactNode } from 'react';

type OnboardingStepInfoDrawerProps = {
  title: string;
  children: ReactNode;
};

export function OnboardingStepInfoDrawer({
  title,
  children,
}: OnboardingStepInfoDrawerProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-[#747D79] transition-colors hover:text-[#002c1f] focus:outline-none focus:ring-4 focus:ring-emerald-800/10"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#C7CFCC] text-[0.65rem] text-[#747D79]">
          ?
        </span>
        O que essa etapa faz
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Fechar explicação"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-[#0f1512]/24 backdrop-blur-[2px]"
          />

          <aside className="absolute bottom-0 right-0 top-0 flex h-full w-[92vw] max-w-[430px] flex-col border-l border-[#DDE6DA] bg-[#FAF7F2] p-6 shadow-[-24px_0_80px_rgba(0,44,31,0.18)] md:w-full md:p-7">
            <div className="mb-6 flex items-start justify-between gap-5 border-b border-[#DDE6DA] pb-5">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
                  IRIS
                </p>

                <h2 className="mt-2 font-display text-3xl leading-tight tracking-[-0.035em] text-[#002c1f]">
                  {title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#DDE6DA] bg-white text-[#002c1f] transition-all hover:bg-emerald-800/10 focus:outline-none focus:ring-4 focus:ring-emerald-800/10"
                aria-label="Fechar drawer"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto text-sm leading-7 text-[#476153]">
              {children}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
TSX

cat > src/components/onboarding/OnboardingMinimalStep.tsx <<'TSX'
import type { ReactNode } from 'react';

type OnboardingMinimalStepProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
};

export function OnboardingMinimalStep({
  eyebrow,
  title,
  children,
}: OnboardingMinimalStepProps) {
  return (
    <section className="mx-auto w-full">
      <style>
        {`
          @keyframes iris-minimal-enter {
            from {
              opacity: 0;
              transform: translateY(14px);
              filter: blur(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
              filter: blur(0);
            }
          }

          .iris-minimal-enter {
            animation: iris-minimal-enter 560ms cubic-bezier(0.22, 1, 0.36, 1) both;
          }

          @media (prefers-reduced-motion: reduce) {
            .iris-minimal-enter {
              animation: none !important;
              opacity: 1 !important;
              transform: none !important;
              filter: none !important;
            }
          }
        `}
      </style>

      <div className="iris-minimal-enter">
        <header className="mb-9 min-w-0">
          <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
            {eyebrow}
          </p>

          <h1 className="font-display text-[2.55rem] leading-[1] tracking-[-0.055em] text-[#002c1f] sm:text-[3.15rem] lg:text-[3.6rem] xl:text-[3.9rem] md:whitespace-nowrap">
            {title}
          </h1>
        </header>

        {children}
      </div>
    </section>
  );
}
TSX

cat > src/app/onboarding/welcome/page.tsx <<'TSX'
import { ButtonLink } from '@/components/ui/Button';
import { OnboardingMinimalStep } from '@/components/onboarding/OnboardingMinimalStep';
import { OnboardingStepInfoDrawer } from '@/components/onboarding/OnboardingStepInfoDrawer';

export default function WelcomePage() {
  return (
    <OnboardingMinimalStep
      eyebrow="Primeiro passo"
      title="Vamos começar com o essencial."
    >
      <div className="mx-auto mt-14 flex w-full max-w-xl flex-col items-center text-center">
        <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-[#B9C8B5] to-transparent" />

        <ButtonLink
          href="/onboarding/basic-info"
          variant="auth"
          size="lg"
          className="min-h-12 rounded-[18px] px-9"
        >
          Começar
        </ButtonLink>

        <div className="mt-6">
          <OnboardingStepInfoDrawer title="O que acontece agora">
            <p>
              O onboarding ajuda a IRIS a preparar um espaço mais coerente com sua identidade.
            </p>
            <p>
              Você vai passar por pequenas etapas: dados básicos, imagem, nome público e preferências iniciais.
            </p>
            <p>
              Tudo poderá ser ajustado depois nas configurações.
            </p>
          </OnboardingStepInfoDrawer>
        </div>
      </div>
    </OnboardingMinimalStep>
  );
}
TSX

cat > src/app/onboarding/basic-info/page.tsx <<'TSX'
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { IrisCalendarField } from '@/components/ui/IrisCalendarField';
import { MinimalOptionalField } from '@/components/onboarding/MinimalOptionalField';
import { OnboardingFieldLine } from '@/components/onboarding/OnboardingFieldLine';
import { OnboardingMinimalStep } from '@/components/onboarding/OnboardingMinimalStep';
import { OnboardingStepInfoDrawer } from '@/components/onboarding/OnboardingStepInfoDrawer';
import { useOnboardingStore } from '@/lib/store/onboardingStore';

type BasicInfoErrors = {
  firstName?: string;
  birthDate?: string;
  cpf?: string;
};

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function formatDateToISO(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

function formatCpf(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function calculateAgeFromISODate(value: string) {
  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) return null;

  const birthDate = new Date(year, month - 1, day);

  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  const hasNotHadBirthdayThisYear =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());

  if (hasNotHadBirthdayThisYear) age -= 1;

  return age;
}

const today = new Date();
const maxBirthDate = formatDateToISO(today);
const minBirthDate = `${today.getFullYear() - 120}-01-01`;

export default function BasicInfoPage() {
  const router = useRouter();
  const { firstName, socialName, cpf, birthDate, updateField } = useOnboardingStore();

  const [name, setName] = useState(firstName);
  const [optionalSocialName, setOptionalSocialName] = useState(socialName);
  const [optionalCpf, setOptionalCpf] = useState(formatCpf(cpf));
  const [date, setDate] = useState(birthDate);
  const [errors, setErrors] = useState<BasicInfoErrors>({});

  const isCpfFilled = onlyDigits(optionalCpf).length > 0;
  const isCpfComplete = onlyDigits(optionalCpf).length === 11;

  function validate() {
    const nextErrors: BasicInfoErrors = {};

    if (!name.trim()) nextErrors.firstName = 'Digite como devemos chamar você.';
    if (!date) nextErrors.birthDate = 'Selecione sua data de nascimento.';

    if (isCpfFilled && !isCpfComplete) {
      nextErrors.cpf = 'Complete os 11 dígitos do CPF ou deixe o campo em branco.';
    }

    const age = date ? calculateAgeFromISODate(date) : null;

    if (date && age === null) nextErrors.birthDate = 'Selecione uma data válida.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) return;

    const age = calculateAgeFromISODate(date);

    updateField('firstName', name.trim());
    updateField('socialName', optionalSocialName.trim());
    updateField('cpf', onlyDigits(optionalCpf));
    updateField('birthDate', date);

    if (age !== null && age < 18) {
      router.push('/onboarding/kids');
      return;
    }

    router.push('/onboarding/avatar');
  }

  return (
    <OnboardingMinimalStep
      eyebrow="Dados básicos"
      title="Como devemos chamar você?"
    >
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl">
        <div className="rounded-[26px] bg-white/[0.22] px-4 py-2 backdrop-blur-sm">
          <OnboardingFieldLine>
            <Input
              id="firstName"
              name="firstName"
              label="Nome principal"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setErrors((current) => ({ ...current, firstName: undefined }));
              }}
              placeholder="Seu nome"
              autoComplete="given-name"
              error={errors.firstName}
            />
          </OnboardingFieldLine>

          <OnboardingFieldLine>
            <IrisCalendarField
              id="birthDate"
              label="Data de nascimento"
              value={date}
              onChange={(value) => {
                setDate(value);
                setErrors((current) => ({ ...current, birthDate: undefined }));
              }}
              placeholder="Selecionar nascimento"
              helper="Necessário para proteção de idade."
              error={errors.birthDate}
              minDate={minBirthDate}
              maxDate={maxBirthDate}
            />
          </OnboardingFieldLine>

          <OnboardingFieldLine>
            <MinimalOptionalField
              title="Nome social"
              description="Use este campo se quiser que a IRIS respeite outro nome dentro da experiência."
              defaultOpen={Boolean(optionalSocialName)}
            >
              <Input
                id="socialName"
                name="socialName"
                label="Nome social"
                value={optionalSocialName}
                onChange={(event) => setOptionalSocialName(event.target.value)}
                placeholder="Como você prefere ser chamado(a)"
                autoComplete="name"
                helper="Campo opcional."
              />
            </MinimalOptionalField>
          </OnboardingFieldLine>

          <OnboardingFieldLine>
            <MinimalOptionalField
              title="CPF"
              description="Documento opcional para futuras verificações de segurança e recuperação de conta."
              defaultOpen={Boolean(cpf)}
            >
              <Input
                id="cpf"
                name="cpf"
                label="CPF"
                value={optionalCpf}
                onChange={(event) => {
                  setOptionalCpf(formatCpf(event.target.value));
                  setErrors((current) => ({ ...current, cpf: undefined }));
                }}
                placeholder="000.000.000-00"
                inputMode="numeric"
                maxLength={14}
                error={errors.cpf}
                helper="Campo opcional."
              />
            </MinimalOptionalField>
          </OnboardingFieldLine>
        </div>

        <div className="grid grid-cols-1 items-center gap-3 pt-8 sm:grid-cols-[1fr_auto_1fr]">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="min-h-12 rounded-[18px] px-6 text-[#747D79] hover:text-[#002c1f] sm:justify-self-start"
            onClick={() => router.back()}
          >
            Voltar
          </Button>

          <div className="justify-self-center">
            <OnboardingStepInfoDrawer title="O que essa etapa faz">
              <p>
                Esta etapa define o nome usado nas saudações e confirma a idade para direcionar experiências protegidas.
              </p>
              <p>
                Nome social e CPF são opcionais. Eles só aparecem se você abrir os campos.
              </p>
            </OnboardingStepInfoDrawer>
          </div>

          <Button
            type="submit"
            variant="auth"
            size="lg"
            disabled={!name.trim() || !date}
            className="min-h-12 rounded-[18px] px-8 sm:justify-self-end"
          >
            Continuar
          </Button>
        </div>
      </form>
    </OnboardingMinimalStep>
  );
}
TSX

python - <<'PY'
from pathlib import Path

avatar = Path("src/app/onboarding/avatar/page.tsx")
text = avatar.read_text()

text = text.replace(
"import { OnboardingMinimalStep } from '@/components/onboarding/OnboardingMinimalStep';",
"import { OnboardingMinimalStep } from '@/components/onboarding/OnboardingMinimalStep';\nimport { OnboardingStepInfoDrawer } from '@/components/onboarding/OnboardingStepInfoDrawer';"
)

text = text.replace(
"""    <OnboardingMinimalStep
      eyebrow="Identidade visual"
      title="Adicione imagem e capa."
      drawerTitle="O que essa etapa faz"
      drawer={
        <>
          <p>A foto aparece como avatar em áreas de perfil, comentários e navegação.</p>
          <p>A capa aparece no seu espaço de identidade. As duas imagens podem ser alteradas depois.</p>
        </>
      }
    >""",
"""    <OnboardingMinimalStep
      eyebrow="Identidade visual"
      title="Adicione imagem e capa."
    >"""
)

text = text.replace(
"""        <div className="flex flex-col-reverse gap-3 pt-8 sm:flex-row sm:items-center sm:justify-between">
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

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="min-h-12 rounded-[18px] border-emerald-800/18 px-6 text-emerald-900 hover:bg-emerald-800/10"
              disabled={saving}
              onClick={() => router.push('/onboarding/username')}
            >
              Pular
            </Button>

            <Button
              type="button"
              variant="auth"
              size="lg"
              className="min-h-12 rounded-[18px] px-8"
              disabled={saving}
              onClick={handleContinue}
            >
              {saving ? (
                <span className="inline-flex items-center gap-3">
                  <Spinner size="sm" tone="light" label="Salvando imagens..." />
                  Salvando...
                </span>
              ) : (
                'Continuar'
              )}
            </Button>
          </div>
        </div>""",
"""        <div className="grid grid-cols-1 items-center gap-3 pt-8 sm:grid-cols-[1fr_auto_1fr]">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="min-h-12 rounded-[18px] px-6 text-[#747D79] hover:text-[#002c1f] sm:justify-self-start"
            disabled={saving}
            onClick={() => router.back()}
          >
            Voltar
          </Button>

          <div className="justify-self-center">
            <OnboardingStepInfoDrawer title="O que essa etapa faz">
              <p>A foto aparece como avatar em áreas de perfil, comentários e navegação.</p>
              <p>A capa aparece no seu espaço de identidade. As duas imagens podem ser alteradas depois.</p>
            </OnboardingStepInfoDrawer>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-self-end">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="min-h-12 rounded-[18px] border-emerald-800/18 px-6 text-emerald-900 hover:bg-emerald-800/10"
              disabled={saving}
              onClick={() => router.push('/onboarding/username')}
            >
              Pular
            </Button>

            <Button
              type="button"
              variant="auth"
              size="lg"
              className="min-h-12 rounded-[18px] px-8"
              disabled={saving}
              onClick={handleContinue}
            >
              {saving ? (
                <span className="inline-flex items-center gap-3">
                  <Spinner size="sm" tone="light" label="Salvando imagens..." />
                  Salvando...
                </span>
              ) : (
                'Continuar'
              )}
            </Button>
          </div>
        </div>"""
)

avatar.write_text(text)

username = Path("src/app/onboarding/username/page.tsx")
text = username.read_text()

text = text.replace(
"import { OnboardingMinimalStep } from '@/components/onboarding/OnboardingMinimalStep';",
"import { OnboardingMinimalStep } from '@/components/onboarding/OnboardingMinimalStep';\nimport { OnboardingStepInfoDrawer } from '@/components/onboarding/OnboardingStepInfoDrawer';"
)

text = text.replace(
"""    <OnboardingMinimalStep
      eyebrow="Identidade pública"
      title="Escolha seu @."
      drawerTitle="O que essa etapa faz"
      drawer={
        <>
          <p>O @ é o identificador público do seu perfil dentro da IRIS.</p>
          <p>Ele precisa ser único e pode ser usado para convites, busca e vínculo com outros espaços.</p>
        </>
      }
    >""",
"""    <OnboardingMinimalStep
      eyebrow="Identidade pública"
      title="Escolha seu @."
    >"""
)

text = text.replace(
"""        <div className="flex flex-col-reverse gap-3 pt-8 sm:flex-row sm:items-center sm:justify-between">
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
        </div>""",
"""        <div className="grid grid-cols-1 items-center gap-3 pt-8 sm:grid-cols-[1fr_auto_1fr]">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="min-h-12 rounded-[18px] px-6 text-[#747D79] hover:text-[#002c1f] sm:justify-self-start"
            disabled={saving}
            onClick={() => router.back()}
          >
            Voltar
          </Button>

          <div className="justify-self-center">
            <OnboardingStepInfoDrawer title="O que essa etapa faz">
              <p>O @ é o identificador público do seu perfil dentro da IRIS.</p>
              <p>Ele precisa ser único e pode ser usado para convites, busca e vínculo com outros espaços.</p>
            </OnboardingStepInfoDrawer>
          </div>

          <Button
            type="submit"
            variant="auth"
            size="lg"
            disabled={!available || saving}
            className="min-h-12 rounded-[18px] px-8 sm:justify-self-end"
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
        </div>"""
)

username.write_text(text)
PY

echo "✅ FE-IRIS-033 aplicado: ajuda discreta movida para baixo, entre Voltar e Continuar."
