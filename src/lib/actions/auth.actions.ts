'use server';

import { redirect } from 'next/navigation';
import { resolvePostAuthDestination } from '@/lib/auth/resolvePostAuthDestination';
import { IRIS_ROUTES, isSafeInternalPath } from '@/lib/auth/routes';
import { createServer } from '@/lib/supabase/server';
import {
  AUTH_LOGIN_ERRORS,
  AUTH_REGISTER_ERRORS,
  logAuthError,
  resolveLoginAuthError,
  resolveRegisterAuthError,
  toAuthActionError,
} from '@/lib/erros/auth';

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

export async function loginAction(formData: FormData) {
  const email = getRequiredString(formData, 'email');
  const password = getRequiredString(formData, 'password');
  const next = getRequiredString(formData, 'next');

  if (!email || !password) {
    const irisError = AUTH_LOGIN_ERRORS.EMPTY_CREDENTIALS;
    logAuthError(irisError, { hasEmail: Boolean(email), hasPassword: Boolean(password) });
    return toAuthActionError(irisError);
  }

  const supabase = createServer();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const irisError = resolveLoginAuthError(error);
    logAuthError(irisError, {
      providerMessage: error.message,
      providerStatus: error.status,
      providerCode: error.code,
      email,
    });

    return toAuthActionError(irisError);
  }

  const destination = await resolvePostAuthDestination(supabase, data.user.id);

  if (destination === IRIS_ROUTES.app && isSafeInternalPath(next)) {
    redirect(next);
  }

  redirect(destination);
}

export async function registerAction(formData: FormData) {
  const email = getRequiredString(formData, 'email');
  const password = getRequiredString(formData, 'password');

  if (!email || !password) {
    const irisError = AUTH_REGISTER_ERRORS.EMPTY_CREDENTIALS;
    logAuthError(irisError, { hasEmail: Boolean(email), hasPassword: Boolean(password) });
    return toAuthActionError(irisError);
  }

  if (password.length < 8) {
    const irisError = AUTH_REGISTER_ERRORS.WEAK_PASSWORD;
    logAuthError(irisError, { email, passwordLength: password.length });
    return toAuthActionError(irisError);
  }

  const supabase = createServer();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    const irisError = resolveRegisterAuthError(error);
    logAuthError(irisError, {
      providerMessage: error.message,
      providerStatus: error.status,
      providerCode: error.code,
      email,
    });

    return toAuthActionError(irisError);
  }

  redirect(IRIS_ROUTES.onboardingWelcome);
}
