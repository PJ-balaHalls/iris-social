import { redirect } from 'next/navigation';
import { createServer } from '@/lib/supabase/server';
import { IntegrationsSettingsClient } from './IntegrationsSettingsClient';

type IntegrationsSettingsPageProps = {
  searchParams?: {
    saved?: string;
    error?: string;
  };
};

export default async function IntegrationsSettingsPage({
  searchParams,
}: IntegrationsSettingsPageProps) {
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
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  return (
    <IntegrationsSettingsClient
      profile={profile || {}}
      feedback={searchParams}
    />
  );
}
