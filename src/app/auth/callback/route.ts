import { NextRequest, NextResponse } from 'next/server';
import { createAuthServerClient } from '@/lib/supabase/server-auth';
import { resolvePostAuthDestination } from '@/lib/auth/resolvePostAuthDestination';
import { IRIS_ROUTES, isSafeInternalPath } from '@/lib/auth/routes';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next');

  if (!code) {
    return NextResponse.redirect(new URL(IRIS_ROUTES.authLogin, request.url));
  }

  const supabase = await createAuthServerClient();
  await supabase.auth.exchangeCodeForSession(code);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL(IRIS_ROUTES.authLogin, request.url));
  }

  const destination = isSafeInternalPath(next)
    ? next!
    : await resolvePostAuthDestination(supabase, user.id);

  return NextResponse.redirect(new URL(destination, request.url));
}
