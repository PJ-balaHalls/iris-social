import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import {
  getPostAuthDestinationFromProfile,
  IRIS_ROUTES,
  isAuthRoute,
  isEssentialOnboardingRoute,
  isProtectedRoute,
} from '@/lib/auth/routes';

async function getDestinationForUser(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('first_name,full_name,birth_date,username,onboarding_status')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.warn('[IRIS_MIDDLEWARE_PROFILE_LOOKUP]', {
      code: error.code,
      message: error.message,
    });

    return IRIS_ROUTES.onboardingBasicInfo;
  }

  return getPostAuthDestinationFromProfile(data);
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isRoot = pathname === IRIS_ROUTES.home;
  const authenticated = Boolean(user);

  if (!authenticated && isProtectedRoute(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = IRIS_ROUTES.authLogin;
    loginUrl.searchParams.set('next', pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (authenticated && user && (isAuthRoute(pathname) || isRoot)) {
    const destination = await getDestinationForUser(supabase, user.id);

    if (destination !== pathname) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = destination;
      redirectUrl.search = '';

      return NextResponse.redirect(redirectUrl);
    }
  }

  if (
    authenticated &&
    user &&
    isEssentialOnboardingRoute(pathname) &&
    !request.nextUrl.searchParams.has('edit')
  ) {
    const destination = await getDestinationForUser(supabase, user.id);

    if (destination === IRIS_ROUTES.app) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = IRIS_ROUTES.app;
      redirectUrl.search = '';

      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)).*)',
  ],
};
