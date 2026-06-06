'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useOnboardingStore } from '@/lib/store/onboardingStore';

type IrisProfileProviderProps = {
  children: ReactNode;
};

type Status = 'loading' | 'ready' | 'redirecting' | 'error';

export function IrisProfileProvider({ children }: IrisProfileProviderProps) {
  const router = useRouter();

  const ownerUserId = useOnboardingStore((state) => state.ownerUserId);
  const updateField = useOnboardingStore((state) => state.updateField);
  const clearStore = useOnboardingStore((state) => state.clearStore);

  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('Sincronizando perfil');

  useEffect(() => {
    let active = true;

    async function hydrateProfile() {
      try {
        const supabase = createClient();

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (!active) return;

        if (userError || !user) {
          clearStore();
          setStatus('redirecting');
          router.replace('/auth/login');
          return;
        }

        if (ownerUserId && ownerUserId !== user.id) {
          clearStore();
        }

        updateField('ownerUserId', user.id);

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (!active) return;

        if (error) {
          console.warn('[IRIS_PROFILE_PROVIDER_HYDRATE_ERROR]', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
          });

          setMessage('Não foi possível carregar seu perfil');
          setStatus('error');
          return;
        }

        if (!data) {
          clearStore();
          updateField('ownerUserId', user.id);
          setStatus('redirecting');
          router.replace('/onboarding/basic-info');
          return;
        }

        const hasBasicInfo = Boolean(data.first_name && data.birth_date);
        const hasUsername = Boolean(data.username);

        if (!hasBasicInfo) {
          setStatus('redirecting');
          router.replace('/onboarding/basic-info');
          return;
        }

        if (!hasUsername) {
          setStatus('redirecting');
          router.replace('/onboarding/username');
          return;
        }

        const mappings: Array<[any, any]> = [
          ['ownerUserId', user.id],
          ['firstName', data.first_name || ''],
          ['socialName', data.social_name || ''],
          ['cpf', ''],
          ['birthDate', data.birth_date || ''],
          ['avatarUrl', data.avatar_url || ''],
          ['coverUrl', data.cover_url || ''],
          ['colorSymbol', data.color_symbol || '#1B3A2E'],
          ['username', data.username || ''],
          ['personalityData', data.personality_data || {}],
          ['cultureTags', data.culture_tags || []],
          ['cultureData', data.culture_data || {}],
          ['integrationPreferences', data.integration_preferences || []],
          ['integrationData', data.integration_data || {}],
          ['intention', data.intention || 'INTROSPECTIVA'],
          ['intentionData', data.intention_data || {}],
          ['privacyLevel', data.privacy_level || 'private'],
          ['privacyData', data.privacy_data || {}],
          ['accessibilityData', data.accessibility_data || {}],
          ['usLifeInviteData', data.uslife_invite_data || {}],
          ['plan', data.plan_key || 'free'],
          ['planData', data.plan_data || {}],
        ];

        mappings.forEach(([field, value]) => {
          updateField(field, value);
        });

        setStatus('ready');
      } catch (error) {
        console.warn('[IRIS_PROFILE_PROVIDER_UNKNOWN_ERROR]', error);
        if (!active) return;

        setMessage('Erro inesperado ao carregar o perfil');
        setStatus('error');
      }
    }

    hydrateProfile();

    return () => {
      active = false;
    };
  }, [clearStore, ownerUserId, router, updateField]);

  if (status !== 'ready') {
    return (
      <main
        data-iris-onboarding-root
        className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-5 text-[#002c1f]"
      >
        <div className="w-full max-w-md rounded-[30px] border border-white/70 bg-white/[0.28] p-6 text-center shadow-[0_24px_80px_rgba(0,44,31,0.10)] backdrop-blur-xl">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
            IRIS
          </p>

          <h1 className="mt-3 font-display text-4xl tracking-[-0.055em] text-[#002c1f]">
            {message}
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#476153]">
            Estamos garantindo que os dados exibidos pertencem ao usuário autenticado.
          </p>

          {status === 'error' && (
            <button
              type="button"
              onClick={() => router.refresh()}
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[16px] bg-emerald-800 px-5 text-sm font-semibold text-white"
            >
              Tentar novamente
            </button>
          )}
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
