'use server'

import { createServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = createServer();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Tratamento de Erro IRIS
    console.error('IRIS_AUTH_001:', error.message);
    return { error: 'E-mail ou senha incorretos. Suas memórias estão protegidas.' };
  }

  // Verifica se o usuário já completou o onboarding lendo o banco de dados
  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', data.user.id)
    .single();

  if (profile?.onboarding_completed) {
    redirect('/app/home');
  } else {
    redirect('/onboarding/welcome');
  }
}

export async function registerAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = createServer();

  const { error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      // Evita o redirecionamento automático se a confirmação de email estiver ativa no Supabase
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    }
  });

  if (error) {
    console.error('IRIS_AUTH_003:', error.message);
    return { error: 'Não foi possível preparar o seu espaço. Tente novamente ou use outro e-mail.' };
  }

  // Se o Supabase estiver configurado para exigir confirmação de e-mail,
  // aqui deveríamos mandar para uma tela de "Verifique seu e-mail".
  // Supondo login direto após registro para o escopo atual:
  redirect('/onboarding/welcome');
}