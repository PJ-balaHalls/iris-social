import { redirect } from 'next/navigation';
import { createServer } from '@/lib/supabase/server';
import { PrivacySettingsClient } from './PrivacySettingsClient';

type PrivacySettingsPageProps = {
  searchParams?: {
    saved?: string;
    error?: string;
    readonly?: string;
  };
};

export default async function PrivacySettingsPage({
  searchParams,
}: PrivacySettingsPageProps) {
  const supabase = createServer();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('privacy_level, privacy_data, privacy_completed_at, updated_at')
    .eq('id', user.id)
    .maybeSingle();

  return (
    <PrivacySettingsClient
      profile={profile || {}}
      feedback={searchParams}
    />
  );
}
