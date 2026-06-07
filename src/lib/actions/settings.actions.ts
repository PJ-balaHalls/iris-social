'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServer } from '@/lib/supabase/server';
import { getSettingByKey } from '@/lib/settings/settingsCatalog';
import { getFieldsForSetting, type SettingsField } from '@/lib/settings/settingsFields';

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

function parseJson(raw: string) {
  const trimmed = raw.trim();

  if (!trimmed) {
    return {};
  }

  return JSON.parse(trimmed);
}

function parseArray(raw: string) {
  return raw
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseValue(field: SettingsField, raw: string) {
  if (field.readonly || field.type === 'readonly') {
    return undefined;
  }

  if (field.type === 'json') {
    return parseJson(raw);
  }

  if (field.type === 'array') {
    return parseArray(raw);
  }

  const trimmed = raw.trim();

  if (!trimmed) {
    return null;
  }

  return trimmed;
}

function isMissingColumnError(error: any) {
  const message = String(error?.message || '').toLowerCase();

  return (
    error?.code === 'PGRST204' ||
    message.includes('could not find') ||
    message.includes('schema cache')
  );
}

function buildRedirectPath(sectionKey: string, params: Record<string, string>) {
  const search = new URLSearchParams(params);
  return `/settings/${sectionKey}?${search.toString()}`;
}

export async function updateSettingsSectionAction(formData: FormData) {
  const sectionKey = getString(formData, 'sectionKey');
  const option = getSettingByKey(sectionKey);

  if (!sectionKey || !option) {
    redirect('/settings?error=unknown-section');
  }

  if (option.source !== 'profiles') {
    redirect(buildRedirectPath(sectionKey, { readonly: '1' }));
  }

  const supabase = createServer();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/auth/login');
  }

  const fields = getFieldsForSetting(option.key, option.columns);
  const payload: Record<string, unknown> = {};

  try {
    for (const field of fields) {
      const value = parseValue(field, getString(formData, field.name));

      if (value !== undefined) {
        payload[field.name] = value;
      }
    }
  } catch {
    redirect(buildRedirectPath(sectionKey, { error: 'invalid-json' }));
  }

  if (!Object.keys(payload).length) {
    redirect(buildRedirectPath(sectionKey, { readonly: '1' }));
  }

  const { error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', user.id);

  if (!error) {
    revalidatePath('/settings');
    revalidatePath(`/settings/${sectionKey}`);
    redirect(buildRedirectPath(sectionKey, { saved: '1' }));
  }

  if (error.code === '23505') {
    redirect(buildRedirectPath(sectionKey, { error: 'duplicate' }));
  }

  if (!isMissingColumnError(error)) {
    console.error('[IRIS_SETTINGS_UPDATE_FAILED]', {
      sectionKey,
      code: error.code,
      message: error.message,
      details: error.details,
    });

    redirect(buildRedirectPath(sectionKey, { error: 'database' }));
  }

  const accepted: string[] = [];

  for (const [column, value] of Object.entries(payload)) {
    const { error: singleError } = await supabase
      .from('profiles')
      .update({ [column]: value })
      .eq('id', user.id);

    if (!singleError) {
      accepted.push(column);
      continue;
    }

    if (singleError.code === '23505') {
      redirect(buildRedirectPath(sectionKey, { error: 'duplicate' }));
    }

    console.warn('[IRIS_SETTINGS_COLUMN_SKIPPED]', {
      sectionKey,
      column,
      code: singleError.code,
      message: singleError.message,
    });
  }

  revalidatePath('/settings');
  revalidatePath(`/settings/${sectionKey}`);

  if (accepted.length) {
    redirect(
      buildRedirectPath(sectionKey, {
        saved: 'partial',
        fields: String(accepted.length),
      }),
    );
  }

  redirect(buildRedirectPath(sectionKey, { error: 'missing-columns' }));
}