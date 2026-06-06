import { createClient } from '@/lib/supabase/client';
import { logOnboardingError } from '@/lib/errors/onboarding';
import { buildProfilePayload } from './onboardingSnapshot';

type SaveOnboardingResult = {
  ok: boolean;
  message: string;
};

export async function saveOnboardingProfile(state: any): Promise<SaveOnboardingResult> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    const definition = logOnboardingError(userError || new Error('Session not found'), {
      area: 'saveOnboardingProfile',
      step: 'getUser',
    });

    return {
      ok: false,
      message: definition.userMessage,
    };
  }

  const payload = buildProfilePayload(state, user.id);

  const { error } = await supabase
    .from('profiles')
    .upsert(payload, {
      onConflict: 'id',
    });

  if (error) {
    const definition = logOnboardingError(error, {
      area: 'saveOnboardingProfile',
      step: 'profiles.upsert',
      profileId: user.id,
    });

    return {
      ok: false,
      message: definition.userMessage,
    };
  }

  return {
    ok: true,
    message: 'Perfil salvo com sucesso.',
  };
}
