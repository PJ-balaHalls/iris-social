#!/usr/bin/env bash
set -euo pipefail

mkdir -p src/lib/auth
mkdir -p src/lib/supabase
mkdir -p src/app/api/auth/post-auth-destination
mkdir -p src/app/auth/callback
mkdir -p src/components/iris
mkdir -p src/components/iris/profile-completion
mkdir -p src/app/iris

cat > src/lib/auth/routes.ts <<'TS'
export const IRIS_ROUTES = {
  home: '/',
  app: '/iris',

  authLogin: '/auth/login',
  authRegister: '/auth/register',
  authCallback: '/auth/callback',

  onboardingBasicInfo: '/onboarding/basic-info',
  onboardingUsername: '/onboarding/username',
  onboardingFinish: '/onboarding/finish',
  onboardingAvatar: '/onboarding/avatar',
} as const;

export type IrisProfileRouteState = {
  first_name?: string | null;
  birth_date?: string | null;
  username?: string | null;
  onboarding_status?: string | null;
};

export function isAuthRoute(pathname: string) {
  return (
    pathname === IRIS_ROUTES.authLogin ||
    pathname === IRIS_ROUTES.authRegister ||
    pathname.startsWith('/auth/')
  );
}

export function isProtectedRoute(pathname: string) {
  return pathname.startsWith('/iris') || pathname.startsWith('/onboarding');
}

export function isEssentialOnboardingRoute(pathname: string) {
  return (
    pathname === IRIS_ROUTES.onboardingBasicInfo ||
    pathname === IRIS_ROUTES.onboardingUsername
  );
}

export function getPostAuthDestinationFromProfile(profile?: IrisProfileRouteState | null) {
  if (!profile) return IRIS_ROUTES.onboardingBasicInfo;

  const hasBasicInfo = Boolean(profile.first_name && profile.birth_date);
  const hasUsername = Boolean(profile.username);

  if (!hasBasicInfo) return IRIS_ROUTES.onboardingBasicInfo;
  if (!hasUsername) return IRIS_ROUTES.onboardingUsername;

  return IRIS_ROUTES.app;
}

export function isSafeInternalPath(value: string | null | undefined) {
  if (!value) return false;
  if (!value.startsWith('/')) return false;
  if (value.startsWith('//')) return false;
  if (value.startsWith('/auth')) return false;
  return true;
}
TS

cat > src/lib/auth/resolvePostAuthDestination.ts <<'TS'
import { getPostAuthDestinationFromProfile, IRIS_ROUTES } from './routes';

type SupabaseLike = {
  from: (table: string) => any;
};

export async function resolvePostAuthDestination(
  supabase: SupabaseLike,
  userId: string
) {
  if (!userId) return IRIS_ROUTES.authLogin;

  const { data, error } = await supabase
    .from('profiles')
    .select('first_name,birth_date,username,onboarding_status')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.warn('[IRIS_AUTH_ROUTE_PROFILE_LOOKUP]', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });

    return IRIS_ROUTES.onboardingBasicInfo;
  }

  return getPostAuthDestinationFromProfile(data);
}
TS

cat > src/lib/auth/clientRedirect.ts <<'TS'
'use client';

import { createClient } from '@/lib/supabase/client';
import { getPostAuthDestinationFromProfile, IRIS_ROUTES } from './routes';

type RouterLike = {
  replace?: (href: string) => void;
  push?: (href: string) => void;
};

export async function getPostAuthDestination() {
  try {
    const response = await fetch('/api/auth/post-auth-destination', {
      method: 'GET',
      cache: 'no-store',
    });

    if (response.ok) {
      const payload = await response.json();

      if (typeof payload?.destination === 'string') {
        return payload.destination;
      }
    }
  } catch {
    // Fallback client-side abaixo.
  }

  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return IRIS_ROUTES.authLogin;

    const { data } = await supabase
      .from('profiles')
      .select('first_name,birth_date,username,onboarding_status')
      .eq('id', user.id)
      .maybeSingle();

    return getPostAuthDestinationFromProfile(data);
  } catch {
    return IRIS_ROUTES.onboardingBasicInfo;
  }
}

export async function redirectAfterAuth(router?: RouterLike) {
  const destination = await getPostAuthDestination();

  if (router?.replace) {
    router.replace(destination);
    return;
  }

  if (router?.push) {
    router.push(destination);
    return;
  }

  if (typeof window !== 'undefined') {
    window.location.assign(destination);
  }
}
TS

cat > src/lib/supabase/server-auth.ts <<'TS'
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function createAuthServerClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Chamado em contexto server component sem permissão de set.
        }
      },
    },
  });
}
TS

cat > src/app/api/auth/post-auth-destination/route.ts <<'TS'
import { NextResponse } from 'next/server';
import { createAuthServerClient } from '@/lib/supabase/server-auth';
import { resolvePostAuthDestination } from '@/lib/auth/resolvePostAuthDestination';
import { IRIS_ROUTES } from '@/lib/auth/routes';

export async function GET() {
  try {
    const supabase = await createAuthServerClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        {
          destination: IRIS_ROUTES.authLogin,
          authenticated: false,
        },
        { status: 401 }
      );
    }

    const destination = await resolvePostAuthDestination(supabase, user.id);

    return NextResponse.json({
      destination,
      authenticated: true,
    });
  } catch (error) {
    console.warn('[IRIS_POST_AUTH_DESTINATION_ROUTE]', error);

    return NextResponse.json(
      {
        destination: IRIS_ROUTES.onboardingBasicInfo,
        authenticated: false,
      },
      { status: 500 }
    );
  }
}
TS

cat > src/app/auth/callback/route.ts <<'TS'
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
TS

cat > middleware.ts <<'TS'
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
    .select('first_name,birth_date,username,onboarding_status')
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
TS

cat > src/components/iris/IrisProfileHydrator.tsx <<'TSX'
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useOnboardingStore } from '@/lib/store/onboardingStore';

type HydrationStatus = 'idle' | 'loading' | 'loaded' | 'empty' | 'error';

export function IrisProfileHydrator() {
  const updateField = useOnboardingStore((state) => state.updateField);
  const [status, setStatus] = useState<HydrationStatus>('idle');

  useEffect(() => {
    let active = true;

    async function hydrate() {
      setStatus('loading');

      try {
        const supabase = createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (active) setStatus('empty');
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.warn('[IRIS_PROFILE_HYDRATE]', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
          });

          if (active) setStatus('error');
          return;
        }

        if (!data) {
          if (active) setStatus('empty');
          return;
        }

        const mappings: Array<[string, any]> = [
          ['firstName', data.first_name || ''],
          ['socialName', data.social_name || ''],
          ['cpf', ''],
          ['birthDate', data.birth_date || ''],
          ['avatarUrl', data.avatar_url || ''],
          ['coverUrl', data.cover_url || ''],
          ['colorSymbol', data.color_symbol || '#1B3A2E'],
          ['username', data.username || ''],
          ['personalityData', data.personality_data || {}],
          ['cultureTags', data.culture_tags || []],
          ['cultureData', data.culture_data || {}],
          ['integrationPreferences', data.integration_preferences || []],
          ['integrationData', data.integration_data || {}],
          ['intention', data.intention || 'INTROSPECTIVA'],
          ['intentionData', data.intention_data || {}],
          ['privacyLevel', data.privacy_level || 'private'],
          ['privacyData', data.privacy_data || {}],
          ['accessibilityData', data.accessibility_data || {}],
          ['usLifeInviteData', data.uslife_invite_data || {}],
          ['plan', data.plan_key || 'free'],
          ['planData', data.plan_data || {}],
        ];

        mappings.forEach(([field, value]) => {
          updateField(field as any, value);
        });

        if (active) setStatus('loaded');
      } catch (error) {
        console.warn('[IRIS_PROFILE_HYDRATE_UNKNOWN]', error);
        if (active) setStatus('error');
      }
    }

    hydrate();

    return () => {
      active = false;
    };
  }, [updateField]);

  if (status === 'loading') {
    return (
      <div className="fixed bottom-4 right-4 z-50 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79] shadow-[0_18px_45px_rgba(0,44,31,0.10)] backdrop-blur-xl">
        Sincronizando perfil
      </div>
    );
  }

  return null;
}
TSX

cat > src/app/iris/page.tsx <<'TSX'
'use client';

import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Home,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { AccessibilityRuntime } from '@/components/accessibility/AccessibilityRuntime';
import { IrisProfileHydrator } from '@/components/iris/IrisProfileHydrator';
import { OnboardingDataPanel } from '@/components/onboarding/finish/OnboardingDataPanel';
import { ProfileCompletionCard } from '@/components/iris/profile-completion/ProfileCompletionCard';
import { useOnboardingStore } from '@/lib/store/onboardingStore';

const LOGO_PATH = '/iris/brand/logotipo/svg/iris-logotipo-colorido.svg';

export default function IrisInitialPage() {
  const onboardingState = useOnboardingStore();

  const displayName =
    onboardingState.socialName ||
    onboardingState.firstName ||
    onboardingState.username ||
    'IRIS';

  return (
    <main
      data-iris-onboarding-root
      className="min-h-screen bg-[#FAF7F2] px-5 py-6 text-[#002c1f] sm:px-8 lg:px-10"
    >
      <AccessibilityRuntime />
      <IrisProfileHydrator />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" aria-label="Voltar para início">
            <img src={LOGO_PATH} alt="IRIS" className="h-auto w-[70px]" />
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/[0.28] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#747D79] backdrop-blur-sm">
            <Home size={14} strokeWidth={1.8} />
            Tela inicial
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <aside className="space-y-5 lg:sticky lg:top-8">
            <div className="rounded-[34px] border border-white/70 bg-white/[0.24] p-5 backdrop-blur-sm sm:p-7">
              {onboardingState.coverUrl && (
                <div className="mb-5 aspect-[16/7] overflow-hidden rounded-[24px] border border-white/70 bg-white/[0.28]">
                  <img
                    src={onboardingState.coverUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-emerald-800/[0.08] text-xl font-semibold text-[#002c1f]">
                  {onboardingState.avatarUrl ? (
                    <img
                      src={onboardingState.avatarUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    displayName.slice(0, 1).toUpperCase()
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
                    Bem-vindo
                  </p>

                  <h1 className="mt-1 font-display text-4xl leading-[1] tracking-[-0.055em] text-[#002c1f] sm:text-5xl">
                    {displayName}
                  </h1>

                  <p className="mt-2 font-mono text-sm text-[#476153]">
                    @{onboardingState.username || 'username'}
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] border border-white/70 bg-white/[0.28] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
                    Intenção
                  </p>

                  <p className="mt-2 font-display text-2xl text-[#002c1f]">
                    {onboardingState.intention || '—'}
                  </p>
                </div>

                <div className="rounded-[22px] border border-white/70 bg-white/[0.28] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
                    Plano
                  </p>

                  <p className="mt-2 font-display text-2xl text-[#002c1f]">
                    {onboardingState.plan || 'free'}
                  </p>
                </div>

                <div className="rounded-[22px] border border-white/70 bg-white/[0.28] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
                    Privacidade
                  </p>

                  <p className="mt-2 font-display text-2xl text-[#002c1f]">
                    {onboardingState.privacyLevel || 'private'}
                  </p>
                </div>

                <div className="rounded-[22px] border border-white/70 bg-white/[0.28] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
                    Status
                  </p>

                  <p className="mt-2 inline-flex items-center gap-2 font-display text-2xl text-[#002c1f]">
                    <CheckCircle2 size={18} strokeWidth={1.8} />
                    OK
                  </p>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/onboarding/basic-info?edit=1"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[18px] border border-emerald-800/18 px-5 text-sm font-semibold text-[#002c1f] transition-all hover:bg-emerald-800/10"
                >
                  <RotateCcw size={15} strokeWidth={1.8} />
                  Rever essencial
                </Link>

                <Link
                  href="/onboarding/avatar"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[18px] bg-emerald-800 px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(0,44,31,0.18)] transition-all hover:bg-emerald-900"
                >
                  Personalizar
                  <ArrowRight size={15} strokeWidth={1.8} />
                </Link>
              </div>
            </div>

            <ProfileCompletionCard state={onboardingState} />

            <div className="rounded-[26px] border border-white/70 bg-white/[0.24] p-5 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
                  <Sparkles size={17} strokeWidth={1.8} />
                </span>

                <div>
                  <h2 className="font-display text-2xl tracking-[-0.035em] text-[#002c1f]">
                    Tela inicial simplificada
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#476153]">
                    Esta página valida o fluxo e mostra todos os dados coletados.
                    Depois ela vira o dashboard real da IRIS.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <section>
            <div className="mb-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
                Todos os dados coletados
              </p>

              <h2 className="mt-2 font-display text-4xl tracking-[-0.055em] text-[#002c1f]">
                Snapshot do onboarding.
              </h2>
            </div>

            <OnboardingDataPanel state={onboardingState} />
          </section>
        </section>
      </div>
    </main>
  );
}
TSX

node <<'NODE'
const fs = require('fs');

function replaceInFile(path, replacements) {
  if (!fs.existsSync(path)) return;

  let file = fs.readFileSync(path, 'utf8');
  let changed = false;

  for (const [from, to] of replacements) {
    if (file.includes(from)) {
      file = file.split(from).join(to);
      changed = true;
    }
  }

  if (changed) fs.writeFileSync(path, file);
}

replaceInFile('src/app/onboarding/basic-info/page.tsx', [
  ["router.push('/onboarding/avatar')", "router.push('/onboarding/username')"],
  ['router.push("/onboarding/avatar")', 'router.push("/onboarding/username")'],
]);

replaceInFile('src/app/onboarding/username/page.tsx', [
  ["router.push('/onboarding/personality')", "router.push('/onboarding/finish')"],
  ['router.push("/onboarding/personality")', 'router.push("/onboarding/finish")'],
]);

replaceInFile('src/app/onboarding/avatar/page.tsx', [
  ["router.push('/onboarding/username')", "router.push('/onboarding/personality')"],
  ['router.push("/onboarding/username")', 'router.push("/onboarding/personality")'],
]);

const authFiles = [
  'src/app/auth/login/page.tsx',
  'src/app/auth/register/page.tsx',
];

for (const path of authFiles) {
  if (!fs.existsSync(path)) continue;

  let file = fs.readFileSync(path, 'utf8');

  const isClient = file.includes("'use client'") || file.includes('"use client"');

  if (isClient && !file.includes("@/lib/auth/clientRedirect")) {
    const useClientSingle = "'use client';";
    const useClientDouble = '"use client";';

    if (file.includes(useClientSingle)) {
      file = file.replace(
        useClientSingle,
        `${useClientSingle}\n\nimport { redirectAfterAuth } from '@/lib/auth/clientRedirect';`
      );
    } else if (file.includes(useClientDouble)) {
      file = file.replace(
        useClientDouble,
        `${useClientDouble}\n\nimport { redirectAfterAuth } from '@/lib/auth/clientRedirect';`
      );
    }
  }

  const routeTargets = [
    '/onboarding/welcome',
    '/onboarding/basic-info',
    '/onboarding/avatar',
    '/onboarding/personality',
    '/onboarding/finish',
    '/iris',
  ];

  for (const target of routeTargets) {
    file = file.replaceAll(`router.push('${target}')`, `void redirectAfterAuth(router)`);
    file = file.replaceAll(`router.push("${target}")`, `void redirectAfterAuth(router)`);
    file = file.replaceAll(`router.replace('${target}')`, `void redirectAfterAuth(router)`);
    file = file.replaceAll(`router.replace("${target}")`, `void redirectAfterAuth(router)`);
    file = file.replaceAll(`window.location.href = '${target}'`, `void redirectAfterAuth()`);
    file = file.replaceAll(`window.location.href = "${target}"`, `void redirectAfterAuth()`);
    file = file.replaceAll(`location.href = '${target}'`, `void redirectAfterAuth()`);
    file = file.replaceAll(`location.href = "${target}"`, `void redirectAfterAuth()`);
  }

  fs.writeFileSync(path, file);
}

console.log('✅ Rotas principais revisadas e auth pages corrigidas quando possível.');
NODE

echo "✅ FE-IRIS-049 aplicado: auth routing, middleware, callback, /iris hidratado e caminhos essenciais corrigidos."
