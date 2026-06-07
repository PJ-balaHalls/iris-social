'use client';

import type { ReactNode } from 'react';
import {
  CalendarDays,
  Globe2,
  Languages,
  LockKeyhole,
  UserRound,
} from 'lucide-react';
import { IrisCalendarField } from '@/components/ui/IrisCalendarField';
import { IrisSelectField } from '@/components/ui/IrisSelectField';
import {
  formatDate,
  formatDateInput,
  languageLabels,
  languageOptions,
  rawString,
  stringValue,
  type AccountProfile,
} from '../_utils/accountSettings';
import { AccountInfoDisclosure } from './AccountInfoDisclosure';

export type AccountInfoSection = 'essenciais' | 'contexto' | '';

function LockedLine({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="grid gap-3 border-b border-[#E2E7E3] py-5 last:border-b-0 sm:grid-cols-[220px_1fr_auto] sm:items-center">
      <div className="flex items-center gap-3">
        {icon ? (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-[#1B3A2E]">
            {icon}
          </span>
        ) : null}

        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#747D79]">
          {label}
        </p>
      </div>

      <p className="min-w-0 break-words text-base font-medium leading-7 text-[#1B3A2E]">
        {value}
      </p>

      <LockKeyhole
        size={15}
        strokeWidth={1.8}
        className="hidden text-[#9AA4A1] sm:block"
      />
    </div>
  );
}

function EditableLine({
  label,
  name,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-3 border-b border-[#E2E7E3] py-5 last:border-b-0 sm:grid-cols-[220px_1fr] sm:items-center">
      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#747D79]">
        {label}
      </span>

      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-none border-0 border-b border-[#C7CFCC] bg-transparent px-0 pb-3 text-base font-medium text-[#1B3A2E] outline-none transition placeholder:text-[#9AA4A1] focus:border-[#1B3A2E]"
      />
    </label>
  );
}

function EditableCalendarLine({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-3 border-b border-[#E2E7E3] py-5 last:border-b-0 sm:grid-cols-[220px_1fr] sm:items-start">
      <span className="pt-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#747D79]">
        Nascimento
      </span>

      <div>
        <IrisCalendarField
          id="account-birth-date"
          label="Data de nascimento"
          value={value}
          onChange={onChange}
          placeholder="Selecionar data"
          minDate="1900-01-01"
          maxDate={new Date().toISOString().slice(0, 10)}
        />

        <input type="hidden" name="birth_date" value={value} />
      </div>
    </div>
  );
}

function EditableLanguageLine({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-3 border-b border-[#E2E7E3] py-5 last:border-b-0 sm:grid-cols-[220px_1fr] sm:items-start">
      <span className="pt-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#747D79]">
        Idioma
      </span>

      <IrisSelectField
        id="account-language"
        name="language"
        label="Idioma da experiência"
        value={value}
        onChange={onChange}
        options={languageOptions}
        placeholder="Selecionar idioma"
        helper="Essa escolha define textos, mensagens e preferências locais da IRIS."
      />
    </div>
  );
}

function toggleSection(
  current: AccountInfoSection,
  target: Exclude<AccountInfoSection, ''>,
  onChange: (section: AccountInfoSection) => void,
) {
  onChange(current === target ? '' : target);
}

export function AccountReadFields({
  profile,
  openSection,
  onOpenSectionChange,
}: {
  profile: AccountProfile;
  openSection: AccountInfoSection;
  onOpenSectionChange: (section: AccountInfoSection) => void;
}) {
  return (
    <div className="space-y-2">
      <AccountInfoDisclosure
        eyebrow="Essenciais"
        title="Identidade básica"
        description="Abra para ver os dados usados para reconhecer sua conta."
        open={openSection === 'essenciais'}
        onToggle={() => toggleSection(openSection, 'essenciais', onOpenSectionChange)}
      >
        <div className="border-t border-[#E2E7E3]">
          <LockedLine
            label="Nome completo"
            value={stringValue(profile.full_name)}
            icon={<UserRound size={17} strokeWidth={1.8} />}
          />
          <LockedLine
            label="Primeiro nome"
            value={stringValue(profile.first_name)}
            icon={<UserRound size={17} strokeWidth={1.8} />}
          />
          <LockedLine
            label="Nome social"
            value={stringValue(profile.social_name, 'Não definido')}
            icon={<UserRound size={17} strokeWidth={1.8} />}
          />
        </div>
      </AccountInfoDisclosure>

      <AccountInfoDisclosure
        eyebrow="Contexto"
        title="Localização e idioma"
        description="Abra para revisar nascimento, país e idioma da experiência."
        open={openSection === 'contexto'}
        onToggle={() => toggleSection(openSection, 'contexto', onOpenSectionChange)}
      >
        <div className="border-t border-[#E2E7E3]">
          <LockedLine
            label="Nascimento"
            value={formatDate(profile.birth_date)}
            icon={<CalendarDays size={17} strokeWidth={1.8} />}
          />
          <LockedLine
            label="País"
            value={stringValue(profile.country)}
            icon={<Globe2 size={17} strokeWidth={1.8} />}
          />
          <LockedLine
            label="Idioma"
            value={languageLabels[rawString(profile.language)] || stringValue(profile.language)}
            icon={<Languages size={17} strokeWidth={1.8} />}
          />
        </div>
      </AccountInfoDisclosure>
    </div>
  );
}

export function AccountEditFields({
  profile,
  birthDate,
  onBirthDateChange,
  language,
  onLanguageChange,
  openSection,
  onOpenSectionChange,
}: {
  profile: AccountProfile;
  birthDate: string;
  onBirthDateChange: (value: string) => void;
  language: string;
  onLanguageChange: (value: string) => void;
  openSection: AccountInfoSection;
  onOpenSectionChange: (section: AccountInfoSection) => void;
}) {
  return (
    <div className="space-y-2">
      <AccountInfoDisclosure
        eyebrow="Essenciais"
        title="Editar identidade básica"
        description="Abra para alterar nome completo, primeiro nome e nome social."
        open={openSection === 'essenciais'}
        onToggle={() => toggleSection(openSection, 'essenciais', onOpenSectionChange)}
      >
        <div className="border-t border-[#E2E7E3]">
          <EditableLine
            label="Nome completo"
            name="full_name"
            defaultValue={rawString(profile.full_name)}
            placeholder="Seu nome completo"
          />
          <EditableLine
            label="Primeiro nome"
            name="first_name"
            defaultValue={rawString(profile.first_name)}
            placeholder="Como devemos te chamar"
          />
          <EditableLine
            label="Nome social"
            name="social_name"
            defaultValue={rawString(profile.social_name)}
            placeholder="Opcional"
          />
        </div>
      </AccountInfoDisclosure>

      <AccountInfoDisclosure
        eyebrow="Contexto"
        title="Editar localização e idioma"
        description="Abra para alterar nascimento, país e idioma."
        open={openSection === 'contexto'}
        onToggle={() => toggleSection(openSection, 'contexto', onOpenSectionChange)}
      >
        <div className="border-t border-[#E2E7E3]">
          <EditableCalendarLine
            value={birthDate || formatDateInput(profile.birth_date)}
            onChange={onBirthDateChange}
          />
          <EditableLine
            label="País"
            name="country"
            defaultValue={rawString(profile.country)}
            placeholder="Brasil"
          />
          <EditableLanguageLine value={language} onChange={onLanguageChange} />
        </div>
      </AccountInfoDisclosure>
    </div>
  );
}
