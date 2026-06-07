import { redirect } from 'next/navigation';
import { createServer } from '@/lib/supabase/server';
import { AccountSettingsClient } from './AccountSettingsClient';

type AccountSettingsPageProps = {
  searchParams?: {
    saved?: string;
    error?: string;
    readonly?: string;
  };
};

export default async function AccountSettingsPage({
  searchParams,
}: AccountSettingsPageProps) {
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

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  return (
    <AccountSettingsClient
      profile={profile || {}}
      email={user.email}
      authUser={{
        id: user.id,
        email: user.email,
        phone: user.phone,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        email_confirmed_at: user.email_confirmed_at,
        user_metadata: user.user_metadata,
        app_metadata: user.app_metadata,
      }}
      subscription={subscription || null}
      feedback={searchParams}
    />
  );
}
