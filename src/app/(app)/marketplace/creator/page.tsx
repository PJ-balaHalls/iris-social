import { redirect } from 'next/navigation';
import { createServer } from '@/lib/supabase/server';
import { ThemeCreatorClient } from './ThemeCreatorClient';

export const dynamic = 'force-dynamic';

export default async function ThemeCreatorPage() {
  const supabase = createServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return <ThemeCreatorClient />;
}
