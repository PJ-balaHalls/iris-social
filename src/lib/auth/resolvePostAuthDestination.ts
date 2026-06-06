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
