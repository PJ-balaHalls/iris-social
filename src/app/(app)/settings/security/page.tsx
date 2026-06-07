import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServer } from '@/lib/supabase/server';
import { SecuritySettingsClient } from './SecuritySettingsClient';

type SecuritySettingsPageProps = {
  searchParams?: {
    saved?: string;
    error?: string;
    readonly?: string;
  };
};

export default async function SecuritySettingsPage({
  searchParams,
}: SecuritySettingsPageProps) {
  const supabase = createServer();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/auth/login');
  }

  const { data: preferences } = await supabase
    .from('iris_user_security_preferences')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  const { data: memoryQuestions } = await supabase
    .from('iris_memory_access_questions')
    .select('id, sort_order, question_text, is_enabled, created_at, updated_at, last_used_at')
    .eq('user_id', user.id)
    .eq('is_enabled', true)
    .order('sort_order', { ascending: true });

  const { data: devices } = await supabase
    .from('iris_security_devices')
    .select('id, label, user_agent, ip_address, location_label, trust_level, last_seen_at, created_at, revoked_at')
    .eq('user_id', user.id)
    .order('last_seen_at', { ascending: false })
    .limit(8);

  const { data: sessions } = await supabase
    .from('iris_security_sessions')
    .select('id, session_label, user_agent, ip_address, started_at, last_seen_at, expires_at, revoked_at')
    .eq('user_id', user.id)
    .order('last_seen_at', { ascending: false })
    .limit(8);

  const currentUserAgent = headers().get('user-agent');

  return (
    <SecuritySettingsClient
      preferences={preferences || null}
      memoryQuestions={memoryQuestions || []}
      devices={devices || []}
      sessions={sessions || []}
      currentUserAgent={currentUserAgent}
      feedback={searchParams}
    />
  );
}
