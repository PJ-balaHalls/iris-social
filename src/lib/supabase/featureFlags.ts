// src/lib/supabase/featureFlags.ts
import { createClient } from './server';
import { FeatureFlag, defaultFlags } from '@/feature-flags/flags.config';

export async function getUserFeatureFlags(userId?: string): Promise<Record<FeatureFlag, boolean>> {
  // Se não houver userId, retorna flags padrão
  if (!userId) {
    return defaultFlags;
  }

  const supabase = createClient();
  
  // Buscar flags globais e específicas do usuário
  const { data: globalFlags, error: globalError } = await supabase
    .from('feature_flags')
    .select('flag_name, enabled, percentage, user_id')
    .is('user_id', null);
    
  const { data: userFlags, error: userError } = await supabase
    .from('feature_flags')
    .select('flag_name, enabled, percentage, user_id')
    .eq('user_id', userId);
    
  if (globalError || userError) {
    console.error('Erro ao carregar feature flags:', globalError || userError);
    return defaultFlags;
  }
  
  const allFlags = [...(globalFlags || []), ...(userFlags || [])];
  const flagsResult: Partial<Record<FeatureFlag, boolean>> = {};
  
  for (const flag of allFlags) {
    const flagName = flag.flag_name as FeatureFlag;
    if (flag.percentage && flag.percentage < 100) {
      // Rollout percentual baseado no userId
      const hash = (userId + flagName).split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      flagsResult[flagName] = (hash % 100) < flag.percentage;
    } else {
      flagsResult[flagName] = flag.enabled;
    }
  }
  
  // Preenche com defaultFlags para flags não definidas
  for (const key of Object.keys(defaultFlags) as FeatureFlag[]) {
    if (flagsResult[key] === undefined) {
      flagsResult[key] = defaultFlags[key];
    }
  }
  
  return flagsResult as Record<FeatureFlag, boolean>;
}
