#!/usr/bin/env bash
set -euo pipefail

mkdir -p src/components/onboarding
mkdir -p src/components/ui
mkdir -p src/app/onboarding/basic-info

cat > src/components/onboarding/OnboardingContentFrame.tsx <<'TSX'
'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

type OnboardingContentFrameProps = {
  children: ReactNode;
};

export function OnboardingContentFrame({ children }: OnboardingContentFrameProps) {
  const pathname = usePathname();

  const frameClass =
    pathname === '/onboarding/welcome'
      ? 'max-w-7xl'
      : pathname === '/onboarding/basic-info'
        ? 'max-w-6xl'
        : 'max-w-xl';

  return (
    <div className={`w-full ${frameClass} transition-all duration-300 ease-out`}>
      {children}
    </div>
  );
}
TSX

cat > src/components/ui/IrisList.tsx <<'TSX'
import type { ReactNode } from 'react';

type IrisListProps = {
  children: ReactNode;
  className?: string;
};

type IrisListItemProps = {
  title: string;
  children?: ReactNode;
  marker?: ReactNode;
  className?: string;
};

export function IrisList({ children, className = '' }: IrisListProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {children}
    </div>
  );
}

export function IrisListItem({
  title,
  children,
  marker,
  className = '',
}: IrisListItemProps) {
  return (
    <div
      className={[
        'group flex gap-3 rounded-[22px] border border-[#DDE6DA]/70 bg-white/[0.38] p-4',
        'shadow-[0_10px_28px_rgba(17,17,17,0.025)] backdrop-blur-md transition-all duration-200',
        'hover:border-emerald-800/20 hover:bg-emerald-800/[0.035]',
        className,
      ].join(' ')}
    >
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#DDE6DA] bg-white/70 text-xs font-semibold text-[#002c1f] transition-colors group-hover:border-emerald-800/25 group-hover:bg-emerald-800/10">
        {marker ?? '•'}
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold leading-5 text-[#002c1f]">
          {title}
        </p>

        {children && (
          <p className="mt-1 text-sm leading-6 text-[#476153]">
            {children}
          </p>
        )}
      </div>
    </div>
  );
}
TSX

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
      className={[
        'overflow-hidden rounded-[24px] border p-0 backdrop-blur-xl transition-all duration-300 ease-out',
        open
          ? 'border-emerald-800/18 !bg-white/[0.76] shadow-[0_18px_48px_rgba(17,17,17,0.055)]'
          : 'border-[#DDE6DA]/62 !bg-white/[0.38] shadow-[0_8px_24px_rgba(17,17,17,0.025)]',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-4 px-5 py-3.5 text-left transition-colors hover:bg-emerald-800/[0.035] focus:outline-none focus:ring-4 focus:ring-emerald-800/10"
      >
        <span className="min-w-0">
          <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#8A9690]">
            {eyebrow}
          </span>

          <span className="mt-1 block text-sm font-semibold leading-tight text-[#002c1f]">
            {title}
          </span>

          {open && (
            <span className="mt-2 block text-sm leading-6 text-[#476153]">
              {description}
            </span>
          )}
        </span>

        <span
          className={[
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-lg leading-none shadow-sm',
            'transition-all duration-300 ease-out',
            open
              ? 'rotate-45 border-emerald-800/20 bg-emerald-800/10 text-[#002c1f]'
              : 'rotate-0 border-[#DDE6DA] bg-white/58 text-[#002c1f] group-hover:scale-105 group-hover:bg-emerald-800/10',
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
          <div className="border-t border-[#DDE6DA]/60 px-5 pb-5 pt-4">
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

type CalendarView = 'days' | 'months' | 'years';

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

const shortMonthNames = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
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

function isMonthOutOfRange(year: number, month: number, minDate?: string, maxDate?: string) {
  const firstDay = formatDateToISO(new Date(year, month, 1));
  const lastDay = formatDateToISO(new Date(year, month + 1, 0));

  if (minDate && lastDay < minDate) return true;
  if (maxDate && firstDay > maxDate) return true;

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

function getMinYear(minDate?: string) {
  return parseISODate(minDate)?.getFullYear() ?? new Date().getFullYear() - 120;
}

function getMaxYear(maxDate?: string) {
  return parseISODate(maxDate)?.getFullYear() ?? new Date().getFullYear();
}

function getYearPageEnd(year: number, minYear: number, maxYear: number) {
  return Math.min(maxYear, Math.max(minYear + 11, year + 5));
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
  const minYear = getMinYear(minDate);
  const maxYear = getMaxYear(maxDate);

  const initialDate =
    parseISODate(value) ||
    parseISODate(maxDate) ||
    new Date(new Date().getFullYear() - 18, new Date().getMonth(), 1);

  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<CalendarView>('days');
  const [viewDate, setViewDate] = useState(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
  );
  const [yearPageEnd, setYearPageEnd] = useState(
    getYearPageEnd(initialDate.getFullYear(), minYear, maxYear)
  );

  const fieldId = id || label.toLowerCase().replace(/\s+/g, '-');
  const monthDays = useMemo(() => getMonthMatrix(viewDate), [viewDate]);

  const previousMonth = addMonths(viewDate, -1);
  const nextMonth = addMonths(viewDate, 1);

  const yearGrid = useMemo(
    () => Array.from({ length: 12 }, (_, index) => yearPageEnd - index),
    [yearPageEnd]
  );

  const canGoPrevious =
    viewMode === 'years'
      ? yearPageEnd - 12 >= minYear
      : viewMode === 'months'
        ? viewDate.getFullYear() - 1 >= minYear
        : !minDate ||
          formatDateToISO(
            new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0)
          ) >= minDate;

  const canGoNext =
    viewMode === 'years'
      ? yearPageEnd < maxYear
      : viewMode === 'months'
        ? viewDate.getFullYear() + 1 <= maxYear
        : !maxDate ||
          formatDateToISO(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1)) <= maxDate;

  const selectedLabel = formatDateToBR(value);

  function handlePrevious() {
    if (!canGoPrevious) return;

    if (viewMode === 'years') {
      setYearPageEnd((current) => Math.max(minYear + 11, current - 12));
      return;
    }

    if (viewMode === 'months') {
      setViewDate((current) => new Date(current.getFullYear() - 1, current.getMonth(), 1));
      return;
    }

    setViewDate(previousMonth);
  }

  function handleNext() {
    if (!canGoNext) return;

    if (viewMode === 'years') {
      setYearPageEnd((current) => Math.min(maxYear, current + 12));
      return;
    }

    if (viewMode === 'months') {
      setViewDate((current) => new Date(current.getFullYear() + 1, current.getMonth(), 1));
      return;
    }

    setViewDate(nextMonth);
  }

  function selectYear(year: number) {
    if (year < minYear || year > maxYear) return;

    setViewDate((current) => new Date(year, current.getMonth(), 1));
    setViewMode('months');
  }

  function selectMonth(month: number) {
    if (isMonthOutOfRange(viewDate.getFullYear(), month, minDate, maxDate)) return;

    setViewDate((current) => new Date(current.getFullYear(), month, 1));
    setViewMode('days');
  }

  function handleSelectDay(day: number) {
    const selectedISO = formatDateToISO(
      new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
    );

    if (isOutOfRange(selectedISO, minDate, maxDate)) return;

    onChange(selectedISO);
    setOpen(false);
    setViewMode('days');
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
          'flex min-h-12 w-full items-center justify-between gap-4 rounded-[18px] border px-4 py-3 text-left',
          'bg-white/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.70)] outline-none backdrop-blur-xl',
          'transition-all duration-200 ease-out hover:border-emerald-800/25 hover:bg-emerald-800/[0.035]',
          'focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/10 disabled:cursor-not-allowed disabled:opacity-60',
          error ? 'border-[var(--color-danger)]' : 'border-[#DDE6DA]',
        ].join(' ')}
      >
        <span className={selectedLabel ? 'text-[#002c1f]' : 'text-[#9AA4A1]'}>
          {selectedLabel || placeholder}
        </span>

        <span
          className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.06] text-sm text-[#002c1f]"
          aria-hidden="true"
        >
          ◷
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-50 mt-3 overflow-hidden rounded-[30px] border border-emerald-800/12 bg-[#FAF7F2]/72 p-4 shadow-[0_28px_80px_rgba(0,44,31,0.16)] backdrop-blur-2xl sm:right-auto sm:w-[420px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(0,44,31,0.10),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.76),rgba(0,44,31,0.045))]" />

          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={!canGoPrevious}
                onClick={handlePrevious}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-800/12 bg-white/48 text-[#002c1f] shadow-sm transition-all hover:border-emerald-800/25 hover:bg-emerald-800/10 disabled:cursor-not-allowed disabled:opacity-35"
                aria-label="Voltar no calendário"
              >
                ‹
              </button>

              <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode('months')}
                  className={[
                    'rounded-full px-4 py-2 text-sm font-semibold transition-all',
                    viewMode === 'months'
                      ? 'bg-emerald-800 text-white shadow-[0_8px_20px_rgba(0,44,31,0.18)]'
                      : 'bg-white/46 text-[#002c1f] hover:bg-emerald-800/10',
                  ].join(' ')}
                >
                  {monthNames[viewDate.getMonth()]}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setYearPageEnd(getYearPageEnd(viewDate.getFullYear(), minYear, maxYear));
                    setViewMode('years');
                  }}
                  className={[
                    'rounded-full px-4 py-2 text-sm font-semibold transition-all',
                    viewMode === 'years'
                      ? 'bg-emerald-800 text-white shadow-[0_8px_20px_rgba(0,44,31,0.18)]'
                      : 'bg-white/46 text-[#002c1f] hover:bg-emerald-800/10',
                  ].join(' ')}
                >
                  {viewDate.getFullYear()}
                </button>
              </div>

              <button
                type="button"
                disabled={!canGoNext}
                onClick={handleNext}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-800/12 bg-white/48 text-[#002c1f] shadow-sm transition-all hover:border-emerald-800/25 hover:bg-emerald-800/10 disabled:cursor-not-allowed disabled:opacity-35"
                aria-label="Avançar no calendário"
              >
                ›
              </button>
            </div>

            {viewMode === 'years' && (
              <div className="grid grid-cols-3 gap-2">
                {yearGrid.map((year) => {
                  const disabledYear = year < minYear || year > maxYear;
                  const selectedYear = year === viewDate.getFullYear();

                  return (
                    <button
                      key={year}
                      type="button"
                      disabled={disabledYear}
                      onClick={() => selectYear(year)}
                      className={[
                        'min-h-12 rounded-[18px] border text-sm font-semibold transition-all duration-150',
                        selectedYear
                          ? 'border-emerald-800 bg-emerald-800 text-white shadow-[0_10px_24px_rgba(0,44,31,0.18)]'
                          : 'border-emerald-800/8 bg-white/46 text-[#002c1f] hover:border-emerald-800/22 hover:bg-emerald-800/10 hover:shadow-[0_10px_24px_rgba(0,44,31,0.08)]',
                        disabledYear ? 'cursor-not-allowed opacity-25 hover:bg-white/46 hover:shadow-none' : '',
                      ].join(' ')}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            )}

            {viewMode === 'months' && (
              <div className="grid grid-cols-3 gap-2">
                {shortMonthNames.map((month, index) => {
                  const disabledMonth = isMonthOutOfRange(
                    viewDate.getFullYear(),
                    index,
                    minDate,
                    maxDate
                  );
                  const selectedMonth = index === viewDate.getMonth();

                  return (
                    <button
                      key={month}
                      type="button"
                      disabled={disabledMonth}
                      onClick={() => selectMonth(index)}
                      className={[
                        'min-h-12 rounded-[18px] border text-sm font-semibold transition-all duration-150',
                        selectedMonth
                          ? 'border-emerald-800 bg-emerald-800 text-white shadow-[0_10px_24px_rgba(0,44,31,0.18)]'
                          : 'border-emerald-800/8 bg-white/46 text-[#002c1f] hover:border-emerald-800/22 hover:bg-emerald-800/10 hover:shadow-[0_10px_24px_rgba(0,44,31,0.08)]',
                        disabledMonth ? 'cursor-not-allowed opacity-25 hover:bg-white/46 hover:shadow-none' : '',
                      ].join(' ')}
                    >
                      {month}
                    </button>
                  );
                })}
              </div>
            )}

            {viewMode === 'days' && (
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
                      onClick={() => handleSelectDay(day)}
                      className={[
                        'flex h-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-150',
                        selected
                          ? 'bg-emerald-800 text-white shadow-[0_10px_24px_rgba(0,44,31,0.18)]'
                          : 'text-[#002c1f] hover:bg-emerald-800/10 hover:text-emerald-900 hover:shadow-[0_8px_18px_rgba(0,44,31,0.08)]',
                        disabledDay ? 'cursor-not-allowed opacity-25 hover:bg-transparent hover:shadow-none' : '',
                      ].join(' ')}
                      aria-label={`Selecionar ${pad(day)}/${pad(
                        viewDate.getMonth() + 1
                      )}/${viewDate.getFullYear()}`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            )}
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

cat > src/app/onboarding/basic-info/page.tsx <<'TSX'
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { IrisCalendarField } from '@/components/ui/IrisCalendarField';
import { IrisList, IrisListItem } from '@/components/ui/IrisList';
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
    <section className="relative mx-auto w-full">
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
        className="iris-basic-enter w-full rounded-[40px] border border-[#E2E7E3]/78 !bg-white/[0.58] p-5 shadow-[0_28px_90px_rgba(17,17,17,0.08)] backdrop-blur-xl sm:p-7 md:p-9 lg:p-11"
      >
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12 xl:gap-14">
          <aside className="lg:sticky lg:top-8">
            <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
              Dados básicos
            </p>

            <h1 className="font-display text-[2.45rem] leading-[1.02] tracking-[-0.045em] text-[#002c1f] sm:text-[3.1rem] lg:text-[3.35rem]">
              Como devemos chamar você?
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#476153] sm:text-base">
              A IRIS usa essas informações para construir seu espaço com cuidado, respeitando sua identidade e sua privacidade desde o primeiro passo.
            </p>

            <IrisList className="mt-7 hidden lg:block">
              <IrisListItem title="Nome principal" marker="01">
                É o nome usado nas saudações e primeiras experiências do onboarding.
              </IrisListItem>

              <IrisListItem title="Nascimento" marker="02">
                Ajuda a proteger áreas sensíveis e direcionar menores para o IRIS Kids.
              </IrisListItem>

              <IrisListItem title="Campos opcionais" marker="03">
                Nome social e CPF ficam fechados e só aparecem se você quiser preencher.
              </IrisListItem>
            </IrisList>
          </aside>

          <form
            onSubmit={handleSubmit}
            className="rounded-[34px] border border-[#DDE6DA]/72 bg-white/[0.50] p-4 shadow-[0_18px_54px_rgba(17,17,17,0.045)] backdrop-blur-xl sm:p-6 md:p-7"
          >
            <div className="space-y-5">
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

              <div className="grid gap-3">
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
            </div>
          </form>
        </div>
      </Card>
    </section>
  );
}
TSX

echo "✅ FE-IRIS-028 aplicado: basic-info mais largo, lista UI criada e calendário com grids/verde translúcido."
