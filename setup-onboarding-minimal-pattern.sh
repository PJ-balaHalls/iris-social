#!/usr/bin/env bash
set -euo pipefail

mkdir -p src/components/onboarding
mkdir -p src/app/onboarding/welcome/components
mkdir -p src/app/onboarding/username/components
mkdir -p src/lib/username

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
      ? 'max-w-5xl'
      : pathname === '/onboarding/basic-info' ||
          pathname === '/onboarding/avatar' ||
          pathname === '/onboarding/username'
        ? 'max-w-4xl'
        : 'max-w-xl';

  return (
    <div className={`w-full ${frameClass} transition-all duration-300 ease-out`}>
      {children}
    </div>
  );
}
TSX

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
        className="inline-flex items-center gap-2 rounded-full border border-emerald-800/12 bg-white/38 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#002c1f] backdrop-blur-xl transition-all hover:border-emerald-800/24 hover:bg-emerald-800/[0.055] focus:outline-none focus:ring-4 focus:ring-emerald-800/10"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-800/10 text-[0.68rem]">
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

          <aside className="absolute bottom-0 left-0 right-0 max-h-[78vh] overflow-auto rounded-t-[32px] border border-white/40 bg-[#FAF7F2]/92 p-6 shadow-[0_-24px_80px_rgba(0,44,31,0.18)] backdrop-blur-2xl md:bottom-auto md:left-auto md:right-5 md:top-5 md:h-[calc(100vh-40px)] md:w-full md:max-w-[420px] md:rounded-[32px] md:p-7">
            <div className="mb-6 flex items-start justify-between gap-5">
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
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-800/12 bg-white/54 text-[#002c1f] transition-all hover:bg-emerald-800/10 focus:outline-none focus:ring-4 focus:ring-emerald-800/10"
                aria-label="Fechar drawer"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 text-sm leading-7 text-[#476153]">
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
import { OnboardingStepInfoDrawer } from './OnboardingStepInfoDrawer';

type OnboardingMinimalStepProps = {
  eyebrow: string;
  title: string;
  drawerTitle: string;
  drawer: ReactNode;
  children: ReactNode;
};

export function OnboardingMinimalStep({
  eyebrow,
  title,
  drawerTitle,
  drawer,
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
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <header>
            <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
              {eyebrow}
            </p>

            <h1 className="max-w-3xl font-display text-[2.85rem] leading-[0.98] tracking-[-0.055em] text-[#002c1f] sm:text-[3.7rem] lg:text-[4.25rem]">
              {title}
            </h1>
          </header>

          <OnboardingStepInfoDrawer title={drawerTitle}>
            {drawer}
          </OnboardingStepInfoDrawer>
        </div>

        {children}
      </div>
    </section>
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
    <div className="border-t border-[#DDE6DA]/72 pt-4">
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
import { ButtonLink } from '@/components/ui/Button';
import { OnboardingMinimalStep } from '@/components/onboarding/OnboardingMinimalStep';

export default function WelcomePage() {
  return (
    <OnboardingMinimalStep
      eyebrow="Primeiro passo"
      title="Vamos começar com o essencial."
      drawerTitle="O que acontece agora"
      drawer={
        <>
          <p>
            O onboarding ajuda a IRIS a preparar um espaço mais coerente com sua identidade.
          </p>
          <p>
            Você vai passar por pequenas etapas: dados básicos, imagem, nome público e preferências iniciais.
          </p>
          <p>
            Tudo poderá ser ajustado depois nas configurações.
          </p>
        </>
      }
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
    <OnboardingMinimalStep
      eyebrow="Dados básicos"
      title="Como devemos chamar você?"
      drawerTitle="O que essa etapa faz"
      drawer={
        <>
          <p>
            Esta etapa define o nome usado nas saudações e confirma a idade para direcionar experiências protegidas.
          </p>
          <p>
            Nome social e CPF são opcionais. Eles só aparecem se você abrir os campos.
          </p>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl space-y-5">
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
          helper="Necessário para proteção de idade."
          error={errors.birthDate}
          minDate={minBirthDate}
          maxDate={maxBirthDate}
        />

        <div className="space-y-4 pt-2">
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
        </div>

        <div className="flex flex-col-reverse gap-3 pt-8 sm:flex-row sm:items-center sm:justify-between">
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
            Continuar
          </Button>
        </div>
      </form>
    </OnboardingMinimalStep>
  );
}
TSX

cat > src/components/onboarding/IrisImageCropUpload.tsx <<'TSX'
'use client';

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { Button } from '@/components/ui/Button';

type CropKind = 'avatar' | 'cover';

type IrisImageCropUploadProps = {
  kind: CropKind;
  title: string;
  value?: string;
  onImageReady: (dataUrl: string) => void;
};

type Position = {
  x: number;
  y: number;
};

const cropConfig = {
  avatar: {
    aspectClass: 'aspect-square',
    outputWidth: 640,
    outputHeight: 640,
    previewClass: 'rounded-full',
  },
  cover: {
    aspectClass: 'aspect-[16/7]',
    outputWidth: 1600,
    outputHeight: 700,
    previewClass: 'rounded-[22px]',
  },
};

function isImageFile(file: File) {
  return file.type.startsWith('image/');
}

function revokeObjectUrl(url?: string) {
  if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
}

export function IrisImageCropUpload({
  kind,
  title,
  value,
  onImageReady,
}: IrisImageCropUploadProps) {
  const config = cropConfig[kind];

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const cropAreaRef = useRef<HTMLDivElement | null>(null);

  const [sourceUrl, setSourceUrl] = useState(value || '');
  const [appliedUrl, setAppliedUrl] = useState(value || '');
  const [cropMode, setCropMode] = useState(false);
  const [zoom, setZoom] = useState(1.08);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [lastPoint, setLastPoint] = useState<Position | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setAppliedUrl(value || '');
    setSourceUrl(value || '');
  }, [value]);

  useEffect(() => {
    return () => revokeObjectUrl(sourceUrl);
  }, [sourceUrl]);

  function openFileDialog() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    setError('');

    if (!file) return;

    if (!isImageFile(file)) {
      setError('Escolha um arquivo de imagem válido.');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError('A imagem precisa ter até 8MB.');
      return;
    }

    revokeObjectUrl(sourceUrl);

    const objectUrl = URL.createObjectURL(file);

    setSourceUrl(objectUrl);
    setCropMode(true);
    setZoom(1.08);
    setPosition({ x: 0, y: 0 });
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!cropMode) return;

    setDragging(true);
    setLastPoint({ x: event.clientX, y: event.clientY });
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging || !lastPoint) return;

    setPosition((current) => ({
      x: current.x + event.clientX - lastPoint.x,
      y: current.y + event.clientY - lastPoint.y,
    }));

    setLastPoint({ x: event.clientX, y: event.clientY });
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    setDragging(false);
    setLastPoint(null);

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {}
  }

  function applyCrop() {
    const image = imageRef.current;
    const cropArea = cropAreaRef.current;

    if (!image || !cropArea) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = config.outputWidth;
    canvas.height = config.outputHeight;

    const displayWidth = cropArea.clientWidth || config.outputWidth;
    const displayHeight = cropArea.clientHeight || config.outputHeight;

    const baseScale = Math.max(
      config.outputWidth / image.naturalWidth,
      config.outputHeight / image.naturalHeight
    );

    const finalScale = baseScale * zoom;
    const drawnWidth = image.naturalWidth * finalScale;
    const drawnHeight = image.naturalHeight * finalScale;

    const scaledPositionX = position.x * (config.outputWidth / displayWidth);
    const scaledPositionY = position.y * (config.outputHeight / displayHeight);

    const drawX = (config.outputWidth - drawnWidth) / 2 + scaledPositionX;
    const drawY = (config.outputHeight - drawnHeight) / 2 + scaledPositionY;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(image, drawX, drawY, drawnWidth, drawnHeight);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    setAppliedUrl(dataUrl);
    setCropMode(false);
    onImageReady(dataUrl);
  }

  const visibleImage = cropMode ? sourceUrl : appliedUrl || sourceUrl;
  const hasImage = Boolean(visibleImage);

  return (
    <section className="border-t border-[#DDE6DA]/72 pt-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-semibold text-[#002c1f]">
          {title}
        </h2>

        <Button
          type="button"
          variant="outline"
          size="md"
          className="min-h-11 rounded-[18px] border-emerald-800/18 text-emerald-900 hover:bg-emerald-800/10"
          onClick={openFileDialog}
        >
          {hasImage ? 'Trocar imagem' : 'Escolher imagem'}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && (
        <p className="mb-4 rounded-[18px] border border-[#F3C9C7] bg-[#FCE8E8] px-4 py-3 text-sm text-[#8F312D]">
          {error}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-[1fr_180px] md:items-start">
        <div
          ref={cropAreaRef}
          role="presentation"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={[
            'relative isolate w-full overflow-hidden border border-emerald-800/12 bg-white/32 shadow-inner',
            'select-none touch-none',
            config.aspectClass,
            kind === 'avatar' ? 'rounded-[28px]' : 'rounded-[24px]',
            cropMode ? 'cursor-grab active:cursor-grabbing' : '',
          ].join(' ')}
        >
          {visibleImage ? (
            <img
              ref={imageRef}
              src={visibleImage}
              alt=""
              draggable={false}
              className="absolute left-1/2 top-1/2 h-full w-full max-w-none object-cover"
              style={{
                transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${cropMode ? zoom : 1})`,
                transformOrigin: 'center',
              }}
            />
          ) : (
            <button
              type="button"
              onClick={openFileDialog}
              className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-[#747D79] transition-colors hover:bg-emerald-800/[0.035]"
            >
              <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-800/12 bg-white/40 text-xl text-[#002c1f]">
                +
              </span>
              <span className="text-sm">
                Escolher imagem
              </span>
            </button>
          )}

          {cropMode && (
            <div
              className={[
                'pointer-events-none absolute border-2 border-white/90',
                kind === 'avatar'
                  ? 'inset-6 rounded-full shadow-[0_0_0_999px_rgba(0,44,31,0.16)]'
                  : 'inset-5 rounded-[22px] shadow-[0_0_0_999px_rgba(0,44,31,0.10)]',
              ].join(' ')}
            />
          )}
        </div>

        <div>
          <div
            className={[
              'mx-auto overflow-hidden border-4 border-white bg-[#DDE6DA] shadow-[0_14px_36px_rgba(0,44,31,0.10)]',
              kind === 'avatar'
                ? 'h-28 w-28 rounded-full'
                : 'aspect-[16/7] w-full rounded-[18px]',
            ].join(' ')}
          >
            {appliedUrl || sourceUrl ? (
              <img
                src={appliedUrl || sourceUrl}
                alt={kind === 'avatar' ? 'Preview do avatar' : 'Preview da capa'}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-[#747D79]">
                Preview
              </div>
            )}
          </div>

          {cropMode && (
            <div className="mt-4 space-y-3">
              <input
                aria-label={`Zoom da imagem de ${title}`}
                type="range"
                min="1"
                max="2.8"
                step="0.01"
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="w-full accent-emerald-800"
              />

              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="rounded-[16px]"
                  onClick={() => {
                    setZoom(1.08);
                    setPosition({ x: 0, y: 0 });
                  }}
                >
                  Resetar
                </Button>

                <Button
                  type="button"
                  variant="auth"
                  size="sm"
                  className="rounded-[16px]"
                  onClick={applyCrop}
                >
                  Usar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
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
    console.warn('[IRIS_ONBOARDING_IMAGE_UPLOAD]', {
      kind,
      message: error.message,
    });

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
      drawerTitle="O que essa etapa faz"
      drawer={
        <>
          <p>
            A foto aparece como avatar em áreas de perfil, comentários e navegação.
          </p>
          <p>
            A capa aparece no seu espaço de identidade. As duas imagens podem ser alteradas depois.
          </p>
        </>
      }
    >
      <div className="mx-auto w-full max-w-3xl space-y-6">
        {warning && (
          <div className="rounded-[20px] border border-[#E8CF8B] bg-[#FFF7DC]/70 px-4 py-3 text-sm leading-6 text-[#7A5A12]">
            {warning}
          </div>
        )}

        <IrisImageCropUpload
          kind="avatar"
          title="Foto de perfil"
          value={avatarPreview}
          onImageReady={setAvatarPreview}
        />

        <IrisImageCropUpload
          kind="cover"
          title="Capa"
          value={coverPreview}
          onImageReady={setCoverPreview}
        />

        <div className="flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
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
        </div>
      </div>
    </OnboardingMinimalStep>
  );
}
TSX

cat > src/app/onboarding/username/components/UsernameSuggestionGrid.tsx <<'TSX'
'use client';

type UsernameSuggestionGridProps = {
  suggestions: string[];
  selected?: string;
  loading?: boolean;
  onSelect: (username: string) => void;
};

export function UsernameSuggestionGrid({
  suggestions,
  selected,
  loading = false,
  onSelect,
}: UsernameSuggestionGridProps) {
  if (loading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-10 w-28 animate-pulse rounded-full border border-[#DDE6DA]/70 bg-white/32"
          />
        ))}
      </div>
    );
  }

  if (!suggestions.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((username) => {
        const isSelected = selected === username;

        return (
          <button
            key={username}
            type="button"
            onClick={() => onSelect(username)}
            className={[
              'min-h-10 rounded-full border px-4 text-sm font-semibold transition-all duration-200',
              isSelected
                ? 'border-emerald-800 bg-emerald-800 text-white shadow-[0_10px_24px_rgba(0,44,31,0.18)]'
                : 'border-emerald-800/10 bg-white/[0.32] text-[#002c1f] hover:border-emerald-800/24 hover:bg-emerald-800/10',
            ].join(' ')}
          >
            @{username}
          </button>
        );
      })}
    </div>
  );
}
TSX

cat > src/app/onboarding/username/components/UsernameAvailabilityField.tsx <<'TSX'
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Spinner } from '@/components/global/Loader/Spinner';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';
import {
  createUsernameSuggestions,
  normalizeUsername,
  validateUsername,
} from '@/lib/username/username';
import { UsernameSuggestionGrid } from './UsernameSuggestionGrid';

type AvailabilityStatus =
  | 'idle'
  | 'invalid'
  | 'checking'
  | 'available'
  | 'unavailable'
  | 'error';

type UsernameAvailabilityFieldProps = {
  value: string;
  firstName?: string;
  socialName?: string;
  onChange: (username: string) => void;
  onAvailabilityChange: (available: boolean) => void;
};

export function UsernameAvailabilityField({
  value,
  firstName,
  socialName,
  onChange,
  onAvailabilityChange,
}: UsernameAvailabilityFieldProps) {
  const supabase = useMemo(() => createClient(), []);
  const [status, setStatus] = useState<AvailabilityStatus>('idle');
  const [message, setMessage] = useState('Use de 3 a 24 caracteres.');
  const [availableSuggestions, setAvailableSuggestions] = useState<string[]>([]);
  const [checkingSuggestions, setCheckingSuggestions] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkUsername() {
      const validation = validateUsername(value);

      if (!value) {
        setStatus('idle');
        setMessage('Use de 3 a 24 caracteres.');
        onAvailabilityChange(false);
        return;
      }

      if (!validation.valid) {
        setStatus('invalid');
        setMessage(validation.message);
        onAvailabilityChange(false);
        return;
      }

      setStatus('checking');
      setMessage('Verificando disponibilidade...');
      onAvailabilityChange(false);

      await new Promise((resolve) => setTimeout(resolve, 420));

      if (!active) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', value)
        .maybeSingle();

      if (!active) return;

      if (error) {
        setStatus('error');
        setMessage('Não conseguimos verificar agora.');
        onAvailabilityChange(false);
        return;
      }

      if (data) {
        setStatus('unavailable');
        setMessage('Esse nome já está em uso.');
        onAvailabilityChange(false);
        return;
      }

      setStatus('available');
      setMessage('Disponível.');
      onAvailabilityChange(true);
    }

    checkUsername();

    return () => {
      active = false;
    };
  }, [onAvailabilityChange, supabase, value]);

  useEffect(() => {
    let active = true;

    async function loadSuggestions() {
      const baseSuggestions = createUsernameSuggestions({
        firstName,
        socialName,
        current: value,
      }).filter((suggestion) => suggestion !== value);

      if (!baseSuggestions.length) {
        setAvailableSuggestions([]);
        return;
      }

      setCheckingSuggestions(true);

      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .in('username', baseSuggestions);

      if (!active) return;

      if (error) {
        setAvailableSuggestions(baseSuggestions.slice(0, 5));
        setCheckingSuggestions(false);
        return;
      }

      const unavailable = new Set((data || []).map((item) => item.username));
      const available = baseSuggestions.filter((suggestion) => !unavailable.has(suggestion));

      setAvailableSuggestions(available.slice(0, 6));
      setCheckingSuggestions(false);
    }

    loadSuggestions();

    return () => {
      active = false;
    };
  }, [firstName, socialName, supabase, value]);

  const statusClass =
    status === 'available'
      ? 'text-emerald-900'
      : status === 'unavailable' || status === 'invalid'
        ? 'text-[#8F312D]'
        : 'text-[#747D79]';

  return (
    <div className="space-y-5">
      <div className="relative">
        <Input
          id="username"
          name="username"
          label="Nome de usuário"
          value={value ? `@${value}` : ''}
          onChange={(event) => {
            const normalized = normalizeUsername(event.target.value.replace(/^@/, ''));
            onChange(normalized);
          }}
          placeholder="@seunome"
          autoComplete="username"
          helper="Letras, números e underline."
        />

        {status === 'checking' && (
          <div className="pointer-events-none absolute bottom-[38px] right-4">
            <Spinner size="sm" tone="brand" label="Verificando username..." />
          </div>
        )}
      </div>

      <p className={`text-sm font-medium ${statusClass}`}>
        {message}
      </p>

      <UsernameSuggestionGrid
        suggestions={availableSuggestions}
        selected={value}
        loading={checkingSuggestions}
        onSelect={onChange}
      />
    </div>
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
      drawerTitle="O que essa etapa faz"
      drawer={
        <>
          <p>
            O @ é o identificador público do seu perfil dentro da IRIS.
          </p>
          <p>
            Ele precisa ser único e pode ser usado para convites, busca e vínculo com outros espaços.
          </p>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl space-y-6">
        {alert && (
          <div className="rounded-[20px] border border-[#E8CF8B] bg-[#FFF7DC]/70 px-4 py-3 text-sm leading-6 text-[#7A5A12]">
            {alert}
          </div>
        )}

        <UsernameAvailabilityField
          value={draftUsername}
          firstName={firstName}
          socialName={socialName}
          onChange={handleUsernameChange}
          onAvailabilityChange={handleAvailabilityChange}
        />

        <div className="border-t border-[#DDE6DA]/72 pt-5">
          <p className="text-sm text-[#747D79]">
            Preview
          </p>

          <p className="mt-2 font-display text-3xl tracking-[-0.035em] text-[#002c1f]">
            {socialName || firstName || 'Seu nome'}
          </p>

          <p className="mt-1 font-mono text-sm text-[#476153]">
            @{draftUsername || 'username'}
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 pt-8 sm:flex-row sm:items-center sm:justify-between">
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
        </div>
      </form>
    </OnboardingMinimalStep>
  );
}
TSX

echo "✅ FE-IRIS-031 aplicado: onboarding minimalista nas etapas welcome, basic-info, avatar e username."
