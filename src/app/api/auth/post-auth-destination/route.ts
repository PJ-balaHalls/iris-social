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
