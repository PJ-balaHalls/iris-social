#!/usr/bin/env bash
set -euo pipefail

mkdir -p src/components/onboarding
mkdir -p src/app/onboarding/welcome
mkdir -p src/app/onboarding/basic-info
mkdir -p src/app/onboarding/avatar
mkdir -p src/app/onboarding/username

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

cat > src/components/onboarding/OnboardingBottomActions.tsx <<'TSX'
import type { ReactNode } from 'react';
import { OnboardingStepInfoDrawer } from './OnboardingStepInfoDrawer';

type OnboardingBottomActionsProps = {
  helpTitle: string;
  help: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
};

export function OnboardingBottomActions({
  helpTitle,
  help,
  left,
  right,
  className = '',
}: OnboardingBottomActionsProps) {
  return (
    <div
      className={[
        'grid grid-cols-1 items-center gap-3 pt-8 sm:grid-cols-[1fr_auto_1fr]',
        className,
      ].join(' ')}
    >
      <div className="sm:justify-self-start">
        {left}
      </div>

      <div className="justify-self-center">
        <OnboardingStepInfoDrawer title={helpTitle}>
          {help}
        </OnboardingStepInfoDrawer>
      </div>

      <div className="sm:justify-self-end">
        {right}
      </div>
    </div>
  );
}
TSX

cat > src/components/onboarding/OnboardingFieldLine.tsx <<'TSX'
import type { ReactNode } from 'react';

type OnboardingFieldLineProps = {
  children: ReactNode;
  className?: string;
};

export function OnboardingFieldLine({
  children,
  className = '',
}: OnboardingFieldLineProps) {
  return (
    <div className={`border-t border-white/70 py-4 first:border-t-0 first:pt-0 last:pb-0 ${className}`}>
      {children}
    </div>
  );
}
TSX

cat > src/components/onboarding/MinimalOptionalField.tsx <<'TSX'
'use client';

import { useState, type ReactNode } from 'react';

type MinimalOptionalFieldProps = {
  title: string;
  description: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function MinimalOptionalField({
  title,
  description,
  children,
  defaultOpen = false,
}: MinimalOptionalFieldProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-4 text-left"
      >
        <span>
          <span className="text-sm font-semibold text-[#002c1f]">
            {title}
          </span>

          {open && (
            <span className="mt-1 block text-sm leading-6 text-[#747D79]">
              {description}
            </span>
          )}
        </span>

        <span
          className={[
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-lg leading-none transition-all',
            open
              ? 'rotate-45 border-emerald-800/20 bg-emerald-800/10 text-[#002c1f]'
              : 'border-[#DDE6DA] bg-white/40 text-[#002c1f] group-hover:bg-emerald-800/10',
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
          <div className="pt-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
TSX

cat > src/app/onboarding/welcome/page.tsx <<'TSX'
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
TSX

cat > src/app/onboarding/basic-info/page.tsx <<'TSX'
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
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;

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

        <OnboardingBottomActions
          helpTitle="O que essa etapa faz"
          help={
            <>
              <p>Esta etapa define o nome usado nas saudações e confirma a idade para direcionar experiências protegidas.</p>
              <p>Nome social e CPF são opcionais. Eles só aparecem se você abrir os campos.</p>
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
TSX

cat > src/app/onboarding/avatar/page.tsx <<'TSX'
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/global/Loader/Spinner';
import { IrisImageCropUpload } from '@/components/onboarding/IrisImageCropUpload';
import { OnboardingBottomActions } from '@/components/onboarding/OnboardingBottomActions';
import { OnboardingFieldLine } from '@/components/onboarding/OnboardingFieldLine';
import { OnboardingMinimalStep } from '@/components/onboarding/OnboardingMinimalStep';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { createClient } from '@/lib/supabase/client';

async function dataUrlToBlob(dataUrl: string) {
  const response = await fetch(dataUrl);
  return response.blob();
}

function getImageExtension(blob: Blob) {
  if (blob.type.includes('png')) return 'png';
  if (blob.type.includes('webp')) return 'webp';
  return 'jpg';
}

async function uploadOnboardingImage(dataUrl: string, kind: 'avatar' | 'cover') {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) return dataUrl;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return dataUrl;

  const blob = await dataUrlToBlob(dataUrl);
  const extension = getImageExtension(blob);
  const path = `${user.id}/${kind}-${Date.now()}.${extension}`;

  const { error } = await supabase.storage.from('iris-onboarding').upload(path, blob, {
    cacheControl: '3600',
    contentType: blob.type || 'image/jpeg',
    upsert: true,
  });

  if (error) {
    console.warn('[IRIS_ONBOARDING_IMAGE_UPLOAD]', { kind, message: error.message });
    return dataUrl;
  }

  const { data } = supabase.storage.from('iris-onboarding').getPublicUrl(path);

  return data.publicUrl || dataUrl;
}

export default function AvatarPage() {
  const router = useRouter();
  const { avatarUrl, coverUrl, updateField } = useOnboardingStore();

  const [avatarPreview, setAvatarPreview] = useState(avatarUrl);
  const [coverPreview, setCoverPreview] = useState(coverUrl);
  const [saving, setSaving] = useState(false);
  const [warning, setWarning] = useState('');

  async function handleContinue() {
    setSaving(true);
    setWarning('');

    try {
      const [finalAvatarUrl, finalCoverUrl] = await Promise.all([
        avatarPreview ? uploadOnboardingImage(avatarPreview, 'avatar') : Promise.resolve(''),
        coverPreview ? uploadOnboardingImage(coverPreview, 'cover') : Promise.resolve(''),
      ]);

      updateField('avatarUrl', finalAvatarUrl);
      updateField('coverUrl', finalCoverUrl);

      router.push('/onboarding/username');
    } catch {
      setWarning('Não conseguimos salvar suas imagens agora.');
      setSaving(false);
    }
  }

  return (
    <OnboardingMinimalStep
      eyebrow="Identidade visual"
      title="Adicione imagem e capa."
    >
      <div className="mx-auto w-full max-w-2xl">
        {warning && (
          <div className="mb-4 rounded-[20px] border border-[#E8CF8B] bg-[#FFF7DC]/70 px-4 py-3 text-sm leading-6 text-[#7A5A12]">
            {warning}
          </div>
        )}

        <div className="rounded-[26px] bg-white/[0.22] px-4 py-2 backdrop-blur-sm">
          <OnboardingFieldLine>
            <IrisImageCropUpload
              kind="avatar"
              title="Foto de perfil"
              value={avatarPreview}
              onImageReady={setAvatarPreview}
            />
          </OnboardingFieldLine>

          <OnboardingFieldLine>
            <IrisImageCropUpload
              kind="cover"
              title="Capa"
              value={coverPreview}
              onImageReady={setCoverPreview}
            />
          </OnboardingFieldLine>
        </div>

        <OnboardingBottomActions
          helpTitle="O que essa etapa faz"
          help={
            <>
              <p>A foto aparece como avatar em áreas de perfil, comentários e navegação.</p>
              <p>A capa aparece no seu espaço de identidade. As duas imagens podem ser alteradas depois.</p>
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
          }
        />
      </div>
    </OnboardingMinimalStep>
  );
}
TSX

cat > src/app/onboarding/username/page.tsx <<'TSX'
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
    router.push('/onboarding/personality');
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

        <div className="rounded-[26px] bg-white/[0.22] px-4 py-2 backdrop-blur-sm">
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
TSX

echo "✅ FE-IRIS-033 aplicado: 'O que essa etapa faz' agora aparece em todas as etapas feitas até agora."
