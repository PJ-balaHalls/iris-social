'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { IrisCalendarField } from '@/components/ui/IrisCalendarField';
import { MinimalOptionalField } from '@/components/onboarding/MinimalOptionalField';
import { OnboardingBottomActions } from '@/components/onboarding/OnboardingBottomActions';
import { OnboardingFieldLine } from '@/components/onboarding/OnboardingFieldLine';
import { OnboardingMinimalStep } from '@/components/onboarding/OnboardingMinimalStep';
import { useOnboardingStore } from '@/lib/store/onboardingStore';

type BasicInfoErrors = {
  firstName?: string;
  birthDate?: string;
};

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function formatDateToISO(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
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
  const { firstName, socialName, birthDate, updateField } = useOnboardingStore();

  const [name, setName] = useState(firstName);
  const [optionalSocialName, setOptionalSocialName] = useState(socialName);
  const [date, setDate] = useState(birthDate);
  const [errors, setErrors] = useState<BasicInfoErrors>({});

  function validate() {
    const nextErrors: BasicInfoErrors = {};

    if (!name.trim()) nextErrors.firstName = 'Digite como devemos chamar você.';
    if (!date) nextErrors.birthDate = 'Selecione sua data de nascimento.';

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
    updateField('cpf', '');
    updateField('birthDate', date);

    if (age !== null && age < 13) {
      router.push('/onboarding/kids');
      return;
    }

    router.push('/onboarding/username');
  }

  return (
    <OnboardingMinimalStep
      eyebrow="Dados básicos"
      title="Como devemos chamar você?"
    >
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl">
        <div data-iris-onboarding-surface className="rounded-[26px] bg-white/[0.22] px-4 py-2 backdrop-blur-sm">
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
        </div>

        <OnboardingBottomActions
          helpTitle="O que essa etapa faz"
          help={
            <>
              <p>Esta etapa cria apenas a base mínima do seu perfil.</p>
              <p>Nome e nascimento ajudam a IRIS a montar uma experiência segura. Nome social é opcional.</p>
              <p>CPF e dados sensíveis não fazem parte do cadastro essencial.</p>
            </>
          }
          left={
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="min-h-12 rounded-[18px] px-6 text-[#747D79] hover:text-[#002c1f]"
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
              disabled={!name.trim() || !date}
              className="min-h-12 rounded-[18px] px-8"
            >
              Continuar
            </Button>
          }
        />
      </form>
    </OnboardingMinimalStep>
  );
}
