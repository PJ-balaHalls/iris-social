'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServer } from '@/lib/supabase/server';

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

function parseJson(value: string) {
  if (!value.trim()) return {};
  return JSON.parse(value);
}

function redirectIntegrations(params: Record<string, string>) {
  const search = new URLSearchParams(params);
  redirect(`/settings/integrations?${search.toString()}`);
}

export async function updateIntegrationPreferencesAction(formData: FormData) {
  const supabase = createServer();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/auth/login');
  }

  let integration_preferences: Record<string, unknown> = {};
  let integration_data: Record<string, unknown> = {};

  try {
    integration_preferences = parseJson(getString(formData, 'integration_preferences'));
    integration_data = parseJson(getString(formData, 'integration_data'));
  } catch {
    redirectIntegrations({ error: 'invalid-json' });
  }

  const now = new Date().toISOString();

  const { error } = await supabase
    .from('profiles')
    .update({
      integration_preferences: {
        ...integration_preferences,
        updated_at: now,
      },
      integration_data: {
        ...integration_data,
        updated_at: now,
      },
    })
    .eq('id', user.id);

  if (error) {
    console.error('[IRIS_INTEGRATIONS_UPDATE_FAILED]', {
      code: error.code,
      message: error.message,
      details: error.details,
    });

    redirectIntegrations({ error: 'database' });
  }

  revalidatePath('/settings/integrations');
  redirectIntegrations({ saved: '1' });
}
