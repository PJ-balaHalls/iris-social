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
  full_name?: string | null;
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

  const hasBasicInfo = Boolean((profile.first_name || profile.full_name) && profile.birth_date);
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
