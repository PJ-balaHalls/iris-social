#!/usr/bin/env bash
set -euo pipefail

mkdir -p src/components/onboarding
mkdir -p src/components/ui
mkdir -p src/app/onboarding/basic-info

cat > src/components/onboarding/OptionalIdentityField.tsx <<'TSX'
'use client';

import { useState, type ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

type OptionalIdentityFieldProps = {
  title: string;
  description: string;
  eyebrow?: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function OptionalIdentityField({
  title,
  description,
  eyebrow = 'Opcional',
  defaultOpen = false,
  children,
}: OptionalIdentityFieldProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card
      hover={false}
      className="overflow-hidden rounded-[28px] border border-[#DDE6DA]/90 !bg-white/[0.72] p-0 shadow-[0_18px_48px_rgba(17,17,17,0.05)] backdrop-blur-xl"
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[#FAF7F2]/70 focus:outline-none focus:ring-4 focus:ring-emerald-800/10"
      >
        <span>
          <span className="block text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
            {eyebrow}
          </span>

          <span className="mt-1 block font-display text-xl leading-tight tracking-[-0.025em] text-[#002c1f]">
            {title}
          </span>

          <span className="mt-1.5 block text-sm leading-6 text-[#476153]">
            {description}
          </span>
        </span>

        <span
          className={[
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#DDE6DA] bg-white/80 text-xl leading-none text-[#002c1f] shadow-sm transition-transform duration-300 ease-out',
            open ? 'rotate-45' : 'rotate-0 group-hover:scale-105',
          ].join(' ')}
          aria-hidden="true"
        >
          +
        </span>
      </button>

      <div
        className={[
          'grid transition-all duration-300 ease-out',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        ].join(' ')}
      >
        <div className="overflow-hidden">
          <div className="border-t border-[#DDE6DA]/80 px-5 pb-5 pt-4">
            {children}
          </div>
        </div>
      </div>
    </Card>
  );
}
TSX

cat > src/components/ui/IrisCalendarField.tsx <<'TSX'
'use client';

import { useMemo, useState } from 'react';

type IrisCalendarFieldProps = {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  helper?: string;
  error?: string;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
};

const monthNames = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function formatDateToISO(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseISODate(value?: string) {
  if (!value) return null;

  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) return null;

  const parsed = new Date(year, month - 1, day);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
}

function formatDateToBR(value?: string) {
  const parsed = parseISODate(value);

  if (!parsed) return '';

  return `${pad(parsed.getDate())}/${pad(parsed.getMonth() + 1)}/${parsed.getFullYear()}`;
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function isSameSelectedDay(value: string, viewDate: Date, day: number) {
  const selected = parseISODate(value);

  if (!selected) return false;

  return (
    selected.getFullYear() === viewDate.getFullYear() &&
    selected.getMonth() === viewDate.getMonth() &&
    selected.getDate() === day
  );
}

function isOutOfRange(isoDate: string, minDate?: string, maxDate?: string) {
  if (minDate && isoDate < minDate) return true;
  if (maxDate && isoDate > maxDate) return true;
  return false;
}

function getMonthMatrix(viewDate: Date) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstWeekDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: Array<number | null> = [];

  for (let index = 0; index < firstWeekDay; index += 1) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(day);
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
}

export function IrisCalendarField({
  id,
  label,
  value,
  onChange,
  helper,
  error,
  placeholder = 'Selecionar data',
  minDate,
  maxDate,
  disabled = false,
}: IrisCalendarFieldProps) {
  const initialDate =
    parseISODate(value) ||
    parseISODate(maxDate) ||
    new Date(new Date().getFullYear() - 18, new Date().getMonth(), 1);

  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
  );

  const fieldId = id || label.toLowerCase().replace(/\s+/g, '-');
  const monthDays = useMemo(() => getMonthMatrix(viewDate), [viewDate]);

  const previousMonth = addMonths(viewDate, -1);
  const nextMonth = addMonths(viewDate, 1);

  const canGoPrevious =
    !minDate ||
    formatDateToISO(new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0)) >=
      minDate;

  const canGoNext =
    !maxDate ||
    formatDateToISO(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1)) <= maxDate;

  const selectedLabel = formatDateToBR(value);

  function handleSelect(day: number) {
    const selectedISO = formatDateToISO(
      new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
    );

    if (isOutOfRange(selectedISO, minDate, maxDate)) return;

    onChange(selectedISO);
    setOpen(false);
  }

  return (
    <div className="relative w-full">
      <label
        htmlFor={fieldId}
        className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]"
      >
        {label}
      </label>

      <button
        id={fieldId}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={[
          'flex min-h-12 w-full items-center justify-between gap-4 rounded-[18px] border bg-white/92 px-4 py-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] outline-none transition-all duration-200 ease-out focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/10 disabled:cursor-not-allowed disabled:opacity-60',
          error ? 'border-[var(--color-danger)]' : 'border-[#DDE6DA]',
        ].join(' ')}
      >
        <span className={selectedLabel ? 'text-[#002c1f]' : 'text-[#9AA4A1]'}>
          {selectedLabel || placeholder}
        </span>

        <span
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FAF7F2] text-sm text-[#002c1f]"
          aria-hidden="true"
        >
          ◷
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-40 mt-3 rounded-[26px] border border-[#DDE6DA] bg-white/96 p-4 shadow-[0_22px_70px_rgba(17,17,17,0.12)] backdrop-blur-xl sm:right-auto sm:w-[340px]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={!canGoPrevious}
              onClick={() => setViewDate(previousMonth)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#DDE6DA] text-[#002c1f] transition-colors hover:bg-[#FAF7F2] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Mês anterior"
            >
              ‹
            </button>

            <p className="font-display text-xl leading-none tracking-[-0.025em] text-[#002c1f]">
              {monthNames[viewDate.getMonth()]}{' '}
              <span className="font-sans text-sm font-medium text-[#747D79]">
                {viewDate.getFullYear()}
              </span>
            </p>

            <button
              type="button"
              disabled={!canGoNext}
              onClick={() => setViewDate(nextMonth)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#DDE6DA] text-[#002c1f] transition-colors hover:bg-[#FAF7F2] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Próximo mês"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {weekDays.map((day, index) => (
              <span
                key={`${day}-${index}`}
                className="py-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#747D79]"
              >
                {day}
              </span>
            ))}

            {monthDays.map((day, index) => {
              if (!day) {
                return <span key={`empty-${index}`} className="h-10" />;
              }

              const isoDate = formatDateToISO(
                new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
              );

              const selected = isSameSelectedDay(value, viewDate, day);
              const disabledDay = isOutOfRange(isoDate, minDate, maxDate);

              return (
                <button
                  key={isoDate}
                  type="button"
                  disabled={disabledDay}
                  onClick={() => handleSelect(day)}
                  className={[
                    'flex h-10 items-center justify-center rounded-full text-sm font-medium transition-all duration-150',
                    selected
                      ? 'bg-emerald-800 text-white shadow-[0_8px_20px_rgba(0,44,31,0.18)]'
                      : 'text-[#002c1f] hover:bg-[#FAF7F2]',
                    disabledDay ? 'cursor-not-allowed opacity-25 hover:bg-transparent' : '',
                  ].join(' ')}
                  aria-label={`Selecionar ${pad(day)}/${pad(viewDate.getMonth() + 1)}/${viewDate.getFullYear()}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {error && (
        <p id={`${fieldId}-error`} className="mt-1.5 text-sm text-[var(--color-danger)]">
          {error}
        </p>
      )}

      {helper && !error && (
        <p id={`${fieldId}-helper`} className="mt-1.5 text-sm text-[var(--color-text-muted)]">
          {helper}
        </p>
      )}
    </div>
  );
}
TSX

cat > src/lib/store/onboardingStore.ts <<'TS'
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FloraInclinacao, SubscriptionPlan } from '@/types/flora';

interface OnboardingState {
  firstName: string;
  socialName: string;
  cpf: string;
  birthDate: string;
  avatarUrl: string;
  colorSymbol: string;
  username: string;
  personalityData: any;
  cultureTags: string[];
  intention: FloraInclinacao;
  privacyLevel: 'private' | 'friends' | 'public';
  plan: SubscriptionPlan;

  updateField: (
    field: keyof Omit<OnboardingState, 'updateField' | 'clearStore'>,
    value: any
  ) => void;
  clearStore: () => void;
}

const initialState = {
  firstName: '',
  socialName: '',
  cpf: '',
  birthDate: '',
  avatarUrl: '',
  colorSymbol: '#1B3A2E',
  username: '',
  personalityData: {},
  cultureTags: [],
  intention: 'INTROSPECTIVA' as FloraInclinacao,
  privacyLevel: 'private' as const,
  plan: 'free' as SubscriptionPlan,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialState,
      updateField: (field, value) => set((state) => ({ ...state, [field]: value })),
      clearStore: () => set({ ...initialState }),
    }),
    { name: 'iris-onboarding-storage' }
  )
);
TS

cat > src/app/onboarding/basic-info/page.tsx <<'TSX'
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { IrisCalendarField } from '@/components/ui/IrisCalendarField';
import { OptionalIdentityField } from '@/components/onboarding/OptionalIdentityField';
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

  if (hasNotHadBirthdayThisYear) {
    age -= 1;
  }

  return age;
}

const today = new Date();
const maxBirthDate = formatDateToISO(today);
const minBirthDate = `${today.getFullYear() - 120}-01-01`;

export default function BasicInfoPage() {
  const router = useRouter();

  const {
    firstName,
    socialName,
    cpf,
    birthDate,
    updateField,
  } = useOnboardingStore();

  const [name, setName] = useState(firstName);
  const [optionalSocialName, setOptionalSocialName] = useState(socialName);
  const [optionalCpf, setOptionalCpf] = useState(formatCpf(cpf));
  const [date, setDate] = useState(birthDate);
  const [errors, setErrors] = useState<BasicInfoErrors>({});

  const isCpfFilled = onlyDigits(optionalCpf).length > 0;
  const isCpfComplete = onlyDigits(optionalCpf).length === 11;

  function validate() {
    const nextErrors: BasicInfoErrors = {};

    if (!name.trim()) {
      nextErrors.firstName = 'Digite como devemos chamar você.';
    }

    if (!date) {
      nextErrors.birthDate = 'Selecione sua data de nascimento.';
    }

    if (isCpfFilled && !isCpfComplete) {
      nextErrors.cpf = 'Complete os 11 dígitos do CPF ou deixe o campo em branco.';
    }

    const age = date ? calculateAgeFromISODate(date) : null;

    if (date && age === null) {
      nextErrors.birthDate = 'Selecione uma data válida.';
    }

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
    <section className="relative mx-auto w-full max-w-2xl">
      <style>
        {`
          @keyframes iris-basic-enter {
            from {
              opacity: 0;
              transform: translateY(16px);
              filter: blur(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
              filter: blur(0);
            }
          }

          .iris-basic-enter {
            animation: iris-basic-enter 620ms cubic-bezier(0.22, 1, 0.36, 1) both;
          }

          @media (prefers-reduced-motion: reduce) {
            .iris-basic-enter {
              animation: none !important;
              opacity: 1 !important;
              transform: none !important;
              filter: none !important;
            }
          }
        `}
      </style>

      <Card
        hover={false}
        className="iris-basic-enter rounded-[36px] border border-[#E2E7E3]/85 !bg-white/[0.70] p-6 shadow-[0_24px_74px_rgba(17,17,17,0.08)] backdrop-blur-xl sm:p-8"
      >
        <header className="mb-8">
          <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
            Dados básicos
          </p>

          <h1 className="font-display text-[2.4rem] leading-[1.02] tracking-[-0.04em] text-[#002c1f] sm:text-[3rem]">
            Como devemos chamar você?
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-[#476153] sm:text-base">
            A IRIS usa essas informações para construir seu espaço com cuidado, respeitando sua identidade e sua privacidade desde o primeiro passo.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <IrisCalendarField
            id="birthDate"
            label="Data de nascimento"
            value={date}
            onChange={(value) => {
              setDate(value);
              setErrors((current) => ({ ...current, birthDate: undefined }));
            }}
            placeholder="Selecionar nascimento"
            helper="Usamos sua idade para proteger experiências sensíveis e ativar o IRIS Kids quando necessário."
            error={errors.birthDate}
            minDate={minBirthDate}
            maxDate={maxBirthDate}
          />

          <div className="grid gap-4">
            <OptionalIdentityField
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
                helper="Campo opcional. Você pode preencher agora ou ajustar depois."
              />
            </OptionalIdentityField>

            <OptionalIdentityField
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
                helper="Campo opcional. Se preencher, use os 11 dígitos."
              />
            </OptionalIdentityField>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="min-h-12 rounded-[18px] px-6 text-[#747D79] hover:text-[#002c1f]"
              onClick={() => router.back()}
            >
              Voltar
            </Button>

            <Button
              type="submit"
              variant="auth"
              size="lg"
              disabled={!name.trim() || !date}
              className="min-h-12 rounded-[18px] px-8"
            >
              Continuar com calma
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}
TSX

echo "✅ FE-IRIS-026 aplicado: basic-info refatorado com calendário IRIS, nome social e CPF opcionais."
