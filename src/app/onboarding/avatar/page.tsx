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

      router.push('/onboarding/personality');
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

        <div data-iris-onboarding-surface className="rounded-[26px] bg-white/[0.22] px-4 py-2 backdrop-blur-sm">
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
                onClick={() => router.push('/onboarding/personality')}
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
