'use server'

import { createServer } from '@/lib/supabase/server';
import { FloraEspecie, FloraEstagio, FloraInclinacao, SubscriptionPlan } from '@/types/flora';

interface OnboardingPayload {
  firstName: string;
  birthDate: string;
  username: string;
  avatarUrl?: string;
  colorSymbol?: string;
  intention: FloraInclinacao;
  plan: SubscriptionPlan;
  privacyLevel: string;
  personalityData: any;
  cultureTags: string[];
}

export async function completeOnboardingAction(data: OnboardingPayload) {
  const supabase = createServer();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('IRIS_AUTH_002: Usuário não autenticado. A sessão pode ter expirado.');
  }

  // 1. ZERO-TRUST: Validação e Construção da Taxonomia Flora
  let especie: FloraEspecie = 'DENTEDELEAO';
  let estagio: FloraEstagio = 'BROTO';

  const birthYear = new Date(data.birthDate).getFullYear();
  const currentYear = new Date().getFullYear();
  if ((currentYear - birthYear) < 18) {
    throw new Error('IRIS_SEC_001: Menores de idade devem usar o ambiente IRIS Kids.');
  }

  if (data.plan === 'premium' || data.plan === 'duo') {
    especie = 'LOTUS';
    estagio = 'FLORESCENCIA';
  }

  // 2. Transação no Banco de Dados (Atualização do Perfil)
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      full_name: data.firstName,
      username: data.username,
      birth_date: data.birthDate,
      avatar_url: data.avatarUrl || null,
      color_symbol: data.colorSymbol || '#1B3A2E',
      personality_data: data.personalityData || {},
      especie,
      estagio,
      inclinacao: data.intention,
      onboarding_completed: true,
    })
    .eq('id', user.id);

  if (profileError) {
    // Tratar erro de username duplicado (Unique Constraint)
    if (profileError.code === '23505') {
      throw new Error('IRIS_DB_001: Este identificador único (@username) já encontrou um dono. Escolha outro.');
    }
    throw new Error('IRIS_DB_002: Falha ao semear o seu perfil. Tente novamente.');
  }

  // 3. Atualização da Assinatura
  const { error: subError } = await supabase
    .from('subscriptions')
    .update({ plan: data.plan })
    .eq('user_id', user.id);

  if (subError) console.error('Erro ao atualizar assinatura:', subError);

  // 4. Atualização das Claims do Auth (Crucial para o Middleware e Segurança Edge)
  await supabase.auth.updateUser({
    data: { 
      flora_claim: `${especie}-${estagio}-${data.intention}`,
      onboarding_completed: true 
    }
  });

  return { success: true, redirect: '/app/home' };
}