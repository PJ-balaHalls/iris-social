'use server';

import { randomBytes, scryptSync } from 'crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServer } from '@/lib/supabase/server';

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function getBoolean(formData: FormData, key: string) {
  return getString(formData, key) === 'true';
}

function hashMemoryAnswer(answer: string) {
  const normalized = answer.trim().toLowerCase();
  const salt = randomBytes(16).toString('hex');
  const pepper = process.env.IRIS_SECURITY_PEPPER || 'dev-only-change-this-pepper';
  const hash = scryptSync(`${normalized}:${pepper}`, salt, 64).toString('hex');

  return {
    salt,
    hash,
  };
}

function redirectSecurity(params: Record<string, string>) {
  const search = new URLSearchParams(params);
  redirect(`/settings/security?${search.toString()}`);
}

export async function updateSecurityPreferencesAction(formData: FormData) {
  const supabase = createServer();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/auth/login');
  }

  const payload = {
    user_id: user.id,
    memory_access_enabled: getBoolean(formData, 'memory_access_enabled'),
    memory_access_max_attempts: Number(
      getString(formData, 'memory_access_max_attempts') || 5,
    ),
    require_2fa: getBoolean(formData, 'require_2fa'),
    login_alerts_enabled: getBoolean(formData, 'login_alerts_enabled'),
    trusted_devices_enabled: getBoolean(formData, 'trusted_devices_enabled'),
    session_review_required: getBoolean(formData, 'session_review_required'),
    account_switch_requires_confirmation: getBoolean(
      formData,
      'account_switch_requires_confirmation',
    ),
  };

  const { error } = await supabase
    .from('iris_user_security_preferences')
    .upsert(payload, { onConflict: 'user_id' });

  if (error) {
    console.error('[IRIS_SECURITY_PREFS_UPDATE_FAILED]', error);
    redirectSecurity({ error: 'preferences' });
  }

  revalidatePath('/settings/security');
  redirectSecurity({ saved: 'preferences' });
}

export async function updateMemoryAccessQuestionsAction(formData: FormData) {
  const supabase = createServer();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/auth/login');
  }

  const rows = [1, 2, 3]
    .map((index) => {
      const question = getString(formData, `question_${index}`);
      const answer = getString(formData, `answer_${index}`);

      if (!question && !answer) return null;

      if (question.length < 8 || answer.length < 4) {
        return {
          invalid: true,
        };
      }

      const hashed = hashMemoryAnswer(answer);

      return {
        user_id: user.id,
        sort_order: index,
        question_text: question,
        answer_hash: hashed.hash,
        answer_salt: hashed.salt,
        is_enabled: true,
      };
    })
    .filter(Boolean) as Array<any>;

  if (rows.some((row) => row.invalid)) {
    redirectSecurity({ error: 'memory-validation' });
  }

  const { error: deleteError } = await supabase
    .from('iris_memory_access_questions')
    .delete()
    .eq('user_id', user.id);

  if (deleteError) {
    console.error('[IRIS_MEMORY_QUESTIONS_DELETE_FAILED]', deleteError);
    redirectSecurity({ error: 'memory-delete' });
  }

  if (rows.length > 0) {
    const { error: insertError } = await supabase
      .from('iris_memory_access_questions')
      .insert(rows);

    if (insertError) {
      console.error('[IRIS_MEMORY_QUESTIONS_INSERT_FAILED]', insertError);
      redirectSecurity({ error: 'memory-insert' });
    }
  }

  await supabase
    .from('iris_user_security_preferences')
    .upsert(
      {
        user_id: user.id,
        memory_access_enabled: rows.length > 0,
      },
      { onConflict: 'user_id' },
    );

  revalidatePath('/settings/security');
  redirectSecurity({ saved: 'memories' });
}

export async function revokeSecurityDeviceAction(formData: FormData) {
  const deviceId = getString(formData, 'device_id');
  const supabase = createServer();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || !deviceId) {
    redirect('/auth/login');
  }

  const { error } = await supabase
    .from('iris_security_devices')
    .update({
      revoked_at: new Date().toISOString(),
      trust_level: 'blocked',
    })
    .eq('id', deviceId)
    .eq('user_id', user.id);

  if (error) {
    console.error('[IRIS_DEVICE_REVOKE_FAILED]', error);
    redirectSecurity({ error: 'device' });
  }

  revalidatePath('/settings/security');
  redirectSecurity({ saved: 'device-revoked' });
}

export async function signOutForAccountSwitchAction() {
  const supabase = createServer();

  await supabase.auth.signOut();

  redirect('/auth/login?mode=switch-account');
}
