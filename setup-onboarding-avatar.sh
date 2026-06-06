#!/usr/bin/env bash
set -euo pipefail

mkdir -p src/app/onboarding/avatar
mkdir -p src/components/onboarding
mkdir -p src/components/ui
mkdir -p src/lib/store

cat > src/app/onboarding/loading.tsx <<'TSX'
import { Spinner } from '@/components/global/Loader/Spinner';

export default function OnboardingLoading() {
  return (
    <div className="flex min-h-[520px] w-full items-center justify-center">
      <div className="rounded-[28px] border border-[#DDE6DA]/80 bg-white/[0.64] px-8 py-7 shadow-[0_18px_54px_rgba(17,17,17,0.06)] backdrop-blur-xl">
        <Spinner
          size="lg"
          tone="brand"
          withBrand
          label="Preparando seu onboarding..."
        />
      </div>
    </div>
  );
}
TSX

cat > src/app/onboarding/avatar/loading.tsx <<'TSX'
import { Spinner } from '@/components/global/Loader/Spinner';

export default function AvatarLoading() {
  return (
    <div className="flex min-h-[520px] w-full items-center justify-center">
      <div className="rounded-[28px] border border-[#DDE6DA]/80 bg-white/[0.64] px-8 py-7 shadow-[0_18px_54px_rgba(17,17,17,0.06)] backdrop-blur-xl">
        <Spinner
          size="lg"
          tone="brand"
          withBrand
          label="Abrindo editor de imagem..."
        />
      </div>
    </div>
  );
}
TSX

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
      : pathname === '/onboarding/basic-info' || pathname === '/onboarding/avatar'
        ? 'max-w-6xl'
        : 'max-w-xl';

  return (
    <div className={`w-full ${frameClass} transition-all duration-300 ease-out`}>
      {children}
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
  coverUrl: string;
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
  coverUrl: '',
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
import { Card } from '@/components/ui/Card';

type CropKind = 'avatar' | 'cover';

type IrisImageCropUploadProps = {
  kind: CropKind;
  title: string;
  description: string;
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
    helper: 'Arraste para posicionar e use o zoom para ajustar o rosto.',
  },
  cover: {
    aspectClass: 'aspect-[16/7]',
    outputWidth: 1600,
    outputHeight: 700,
    previewClass: 'rounded-[28px]',
    helper: 'Escolha uma imagem horizontal ou ajuste o enquadramento com calma.',
  },
};

function isImageFile(file: File) {
  return file.type.startsWith('image/');
}

function revokeObjectUrl(url?: string) {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

export function IrisImageCropUpload({
  kind,
  title,
  description,
  value,
  onImageReady,
}: IrisImageCropUploadProps) {
  const config = cropConfig[kind];

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const cropAreaRef = useRef<HTMLDivElement | null>(null);

  const [sourceUrl, setSourceUrl] = useState<string>(value || '');
  const [appliedUrl, setAppliedUrl] = useState<string>(value || '');
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
    return () => {
      revokeObjectUrl(sourceUrl);
    };
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

    const deltaX = event.clientX - lastPoint.x;
    const deltaY = event.clientY - lastPoint.y;

    setPosition((current) => ({
      x: current.x + deltaX,
      y: current.y + deltaY,
    }));

    setLastPoint({ x: event.clientX, y: event.clientY });
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    setDragging(false);
    setLastPoint(null);

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // O navegador pode liberar o pointer automaticamente.
    }
  }

  async function applyCrop() {
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

  function resetCrop() {
    setZoom(1.08);
    setPosition({ x: 0, y: 0 });
  }

  const visibleImage = cropMode ? sourceUrl : appliedUrl || sourceUrl;
  const hasImage = Boolean(visibleImage);

  return (
    <Card
      hover={false}
      className="overflow-hidden rounded-[32px] border border-[#DDE6DA]/78 !bg-white/[0.54] p-0 shadow-[0_18px_54px_rgba(17,17,17,0.045)] backdrop-blur-xl"
    >
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
              {kind === 'avatar' ? 'Imagem de perfil' : 'Capa'}
            </p>

            <h2 className="mt-1 font-display text-2xl leading-tight tracking-[-0.03em] text-[#002c1f]">
              {title}
            </h2>

            <p className="mt-2 max-w-lg text-sm leading-6 text-[#476153]">
              {description}
            </p>
          </div>

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
          <p className="mt-4 rounded-[18px] border border-[#F3C9C7] bg-[#FCE8E8] px-4 py-3 text-sm text-[#8F312D]">
            {error}
          </p>
        )}

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.72fr] lg:items-start">
          <div
            ref={cropAreaRef}
            role="presentation"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={[
              'relative isolate w-full overflow-hidden border border-emerald-800/12 bg-[#FAF7F2]/76 shadow-inner',
              'select-none touch-none',
              config.aspectClass,
              kind === 'avatar' ? 'rounded-[32px]' : 'rounded-[30px]',
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
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,rgba(0,44,31,0.08),transparent_40%)] px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-800/12 bg-white/70 text-2xl text-[#002c1f]">
                  +
                </div>

                <p className="mt-4 text-sm font-semibold text-[#002c1f]">
                  Nenhuma imagem selecionada
                </p>

                <p className="mt-1 max-w-xs text-sm leading-6 text-[#747D79]">
                  Escolha uma imagem do dispositivo para abrir o editor.
                </p>
              </div>
            )}

            {cropMode && kind === 'avatar' && (
              <div className="pointer-events-none absolute inset-6 rounded-full border-2 border-white/90 shadow-[0_0_0_999px_rgba(0,44,31,0.16)]" />
            )}

            {cropMode && kind === 'cover' && (
              <div className="pointer-events-none absolute inset-5 rounded-[24px] border-2 border-white/88 shadow-[0_0_0_999px_rgba(0,44,31,0.10)]" />
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-emerald-800/10 bg-emerald-800/[0.045] p-4 backdrop-blur-xl">
              <p className="text-sm font-semibold text-[#002c1f]">
                Preview
              </p>

              <div className="mt-4">
                {kind === 'avatar' ? (
                  <div className="mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-[#DDE6DA] shadow-[0_14px_36px_rgba(0,44,31,0.12)]">
                    {appliedUrl || sourceUrl ? (
                      <img
                        src={appliedUrl || sourceUrl}
                        alt="Preview do avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-[#747D79]">
                        Avatar
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-[16/7] overflow-hidden rounded-[22px] border-4 border-white bg-[#DDE6DA] shadow-[0_14px_36px_rgba(0,44,31,0.12)]">
                    {appliedUrl || sourceUrl ? (
                      <img
                        src={appliedUrl || sourceUrl}
                        alt="Preview da capa"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-[#747D79]">
                        Capa
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {cropMode && (
              <div className="rounded-[28px] border border-[#DDE6DA]/78 bg-white/[0.58] p-4 backdrop-blur-xl">
                <label
                  htmlFor={`${kind}-zoom`}
                  className="text-sm font-semibold text-[#002c1f]"
                >
                  Zoom
                </label>

                <input
                  id={`${kind}-zoom`}
                  type="range"
                  min="1"
                  max="2.8"
                  step="0.01"
                  value={zoom}
                  onChange={(event) => setZoom(Number(event.target.value))}
                  className="mt-3 w-full accent-emerald-800"
                />

                <p className="mt-3 text-xs leading-5 text-[#747D79]">
                  {config.helper}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    className="min-h-11 rounded-[18px]"
                    onClick={resetCrop}
                  >
                    Reajustar
                  </Button>

                  <Button
                    type="button"
                    variant="auth"
                    size="md"
                    className="min-h-11 rounded-[18px]"
                    onClick={applyCrop}
                  >
                    Usar imagem
                  </Button>
                </div>
              </div>
            )}

            {!cropMode && hasImage && sourceUrl && (
              <Button
                type="button"
                variant="ghost"
                size="md"
                className="min-h-11 w-full rounded-[18px] text-[#002c1f] hover:bg-emerald-800/10"
                onClick={() => setCropMode(true)}
              >
                Editar corte
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
TSX

cat > src/app/onboarding/avatar/page.tsx <<'TSX'
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IrisList, IrisListItem } from '@/components/ui/IrisList';
import { Spinner } from '@/components/global/Loader/Spinner';
import { IrisImageCropUpload } from '@/components/onboarding/IrisImageCropUpload';
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

async function uploadOnboardingImage(
  dataUrl: string,
  kind: 'avatar' | 'cover'
) {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) {
    return dataUrl;
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return dataUrl;
  }

  const blob = await dataUrlToBlob(dataUrl);
  const extension = getImageExtension(blob);
  const path = `${user.id}/${kind}-${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from('iris-onboarding')
    .upload(path, blob, {
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

  const { data } = supabase.storage
    .from('iris-onboarding')
    .getPublicUrl(path);

  return data.publicUrl || dataUrl;
}

export default function AvatarPage() {
  const router = useRouter();

  const {
    firstName,
    avatarUrl,
    coverUrl,
    updateField,
  } = useOnboardingStore();

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
      setWarning('Não conseguimos salvar suas imagens agora. Você pode tentar novamente ou pular esta etapa.');
      setSaving(false);
    }
  }

  function handleSkip() {
    router.push('/onboarding/username');
  }

  return (
    <section className="relative mx-auto w-full">
      <style>
        {`
          @keyframes iris-avatar-enter {
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

          .iris-avatar-enter {
            animation: iris-avatar-enter 620ms cubic-bezier(0.22, 1, 0.36, 1) both;
          }

          @media (prefers-reduced-motion: reduce) {
            .iris-avatar-enter {
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
        className="iris-avatar-enter w-full rounded-[40px] border border-[#E2E7E3]/78 !bg-white/[0.58] p-5 shadow-[0_28px_90px_rgba(17,17,17,0.08)] backdrop-blur-xl sm:p-7 md:p-9 lg:p-11"
      >
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-12 xl:gap-14">
          <aside className="lg:sticky lg:top-8">
            <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
              Identidade visual
            </p>

            <h1 className="font-display text-[2.45rem] leading-[1.02] tracking-[-0.045em] text-[#002c1f] sm:text-[3.1rem] lg:text-[3.35rem]">
              Escolha como sua presença aparece.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#476153] sm:text-base">
              {firstName ? `${firstName}, ` : ''}
              adicione uma foto de perfil e uma capa para dar forma ao seu espaço.
              Você pode ajustar corte, zoom e enquadramento antes de continuar.
            </p>

            <IrisList className="mt-7 hidden lg:block">
              <IrisListItem title="Foto de perfil" marker="01">
                Use uma imagem nítida. Ela será exibida em formato circular na maior parte da interface.
              </IrisListItem>

              <IrisListItem title="Capa" marker="02">
                A capa cria atmosfera para seu Identity Space e pode ser mais ampla ou simbólica.
              </IrisListItem>

              <IrisListItem title="Edição local" marker="03">
                Corte, zoom e preview acontecem antes do envio, deixando a experiência mais leve.
              </IrisListItem>
            </IrisList>
          </aside>

          <div className="space-y-5">
            {warning && (
              <div className="rounded-[24px] border border-[#E8CF8B] bg-[#FFF7DC]/80 px-4 py-3 text-sm leading-6 text-[#7A5A12]">
                {warning}
              </div>
            )}

            <IrisImageCropUpload
              kind="avatar"
              title="Foto de perfil"
              description="Escolha uma imagem do dispositivo, ajuste o zoom e posicione com o mouse ou toque."
              value={avatarPreview}
              onImageReady={setAvatarPreview}
            />

            <IrisImageCropUpload
              kind="cover"
              title="Capa do perfil"
              description="A capa ajuda a criar o clima visual do seu espaço dentro da IRIS."
              value={coverPreview}
              onImageReady={setCoverPreview}
            />

            <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:items-center sm:justify-between">
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
                  onClick={handleSkip}
                >
                  Pular por enquanto
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
        </div>
      </Card>
    </section>
  );
}
TSX

echo "✅ FE-IRIS-029 aplicado: Spinner no onboarding, avatar/capa com crop, zoom, preview e upload Supabase."
