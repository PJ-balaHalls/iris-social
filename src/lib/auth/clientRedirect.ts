'use client';

import { createClient } from '@/lib/supabase/client';
import { getPostAuthDestinationFromProfile, IRIS_ROUTES } from './routes';

type RouterLike = {
  replace?: (href: string) => void;
  push?: (href: string) => void;
};

export async function getPostAuthDestination() {
  try {
    const response = await fetch('/api/auth/post-auth-destination', {
      method: 'GET',
      cache: 'no-store',
    });

    if (response.ok) {
      const payload = await response.json();

      if (typeof payload?.destination === 'string') {
        return payload.destination;
      }
    }
  } catch {
    // Fallback client-side abaixo.
  }

  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return IRIS_ROUTES.authLogin;

    const { data } = await supabase
      .from('profiles')
      .select('first_name,birth_date,username,onboarding_status')
      .eq('id', user.id)
      .maybeSingle();

    return getPostAuthDestinationFromProfile(data);
  } catch {
    return IRIS_ROUTES.onboardingBasicInfo;
  }
}

export async function redirectAfterAuth(router?: RouterLike) {
  const destination = await getPostAuthDestination();

  if (router?.replace) {
    router.replace(destination);
    return;
  }

  if (router?.push) {
    router.push(destination);
    return;
  }

  if (typeof window !== 'undefined') {
    window.location.assign(destination);
  }
}
