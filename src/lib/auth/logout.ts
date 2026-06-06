'use client';

import { createClient } from '@/lib/supabase/client';

export async function logoutAndClearIrisCache() {
  try {
    window.localStorage.removeItem('iris-onboarding-storage');
    window.localStorage.removeItem('iris-accessibility-preferences');
  } catch {
    // localStorage indisponível
  }

  const supabase = createClient();
  await supabase.auth.signOut();

  window.location.assign('/auth/login');
}
