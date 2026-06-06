import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          supabaseResponse = NextResponse.next({
            request: { headers: request.headers },
          })
          supabaseResponse.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          supabaseResponse = NextResponse.next({
            request: { headers: request.headers },
          })
          supabaseResponse.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Atualiza a sessão e garante que o token refresh funcione
  const { data: { user } } = await supabase.auth.getUser()

  // Roteamento seguro: Zero Trust
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')
  const isOnboardingRoute = request.nextUrl.pathname.startsWith('/onboarding')
  
  // Exemplo de proteção: Se não tem usuário e tenta acessar /app, envia para login
  if (!user && !isAuthRoute && !request.nextUrl.pathname.startsWith('/public') && request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Se já está logado e acessa página de auth, envia para app ou onboarding
  if (user && isAuthRoute) {
    // Aqui leríamos o perfil para saber se onboarding_completed é false.
    // Para performance no Edge, idealmente lemos dos metadados do user auth ou deixamos o Client checar.
    return NextResponse.redirect(new URL('/app/home', request.url))
  }

  return supabaseResponse
}