'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useOnboardingStore } from '@/lib/store/onboardingStore';

type HydrationStatus = 'idle' | 'loading' | 'loaded' | 'empty' | 'error';

export function IrisProfileHydrator() {
  const updateField = useOnboardingStore((state) => state.updateField);
  const [status, setStatus] = useState<HydrationStatus>('idle');

  useEffect(() => {
    let active = true;

    async function hydrate() {
      setStatus('loading');

      try {
        const supabase = createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (active) setStatus('empty');
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.warn('[IRIS_PROFILE_HYDRATE]', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
          });

          if (active) setStatus('error');
          return;
        }

        if (!data) {
          if (active) setStatus('empty');
          return;
        }

        const mappings: Array<[string, any]> = [
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
          updateField(field as any, value);
        });

        if (active) setStatus('loaded');
      } catch (error) {
        console.warn('[IRIS_PROFILE_HYDRATE_UNKNOWN]', error);
        if (active) setStatus('error');
      }
    }

    hydrate();

    return () => {
      active = false;
    };
  }, [updateField]);

  if (status === 'loading') {
    return (
      <div className="fixed bottom-4 right-4 z-50 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79] shadow-[0_18px_45px_rgba(0,44,31,0.10)] backdrop-blur-xl">
        Sincronizando perfil
      </div>
    );
  }

  return null;
}
