export type OnboardingErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export type OnboardingErrorCode =
  | 'IRIS_ERR_ONBOARDING_001_SESSION_NOT_FOUND'
  | 'IRIS_ERR_ONBOARDING_002_PROFILE_SAVE_FAILED'
  | 'IRIS_ERR_ONBOARDING_003_USERNAME_UNAVAILABLE'
  | 'IRIS_ERR_ONBOARDING_004_REQUIRED_FIELD'
  | 'IRIS_ERR_ONBOARDING_005_INVALID_BIRTH_DATE'
  | 'IRIS_ERR_ONBOARDING_006_RLS_DENIED'
  | 'IRIS_ERR_ONBOARDING_007_STORAGE_UPLOAD_FAILED'
  | 'IRIS_ERR_ONBOARDING_008_REWARD_CLAIM_FAILED'
  | 'IRIS_ERR_ONBOARDING_009_PROFILE_COMPLETION_INVALID'
  | 'IRIS_ERR_ONBOARDING_010_UNKNOWN';

export type IrisOnboardingErrorDefinition = {
  code: OnboardingErrorCode;
  severity: OnboardingErrorSeverity;
  technicalMessage: string;
  userMessage: string;
  meaning: string;
  probableCause: string;
  howToFix: string;
};

export const ONBOARDING_ERROR_LIBRARY: Record<
  OnboardingErrorCode,
  IrisOnboardingErrorDefinition
> = {
  IRIS_ERR_ONBOARDING_001_SESSION_NOT_FOUND: {
    code: 'IRIS_ERR_ONBOARDING_001_SESSION_NOT_FOUND',
    severity: 'critical',
    technicalMessage: 'Sessão Supabase ausente durante o salvamento do onboarding.',
    userMessage: 'Sua sessão expirou. Entre novamente para continuar.',
    meaning: 'O usuário não está autenticado no momento do save.',
    probableCause: 'Token expirado, refresh de página, logout ou falha no auth.',
    howToFix: 'Redirecionar para login e repetir o salvamento após autenticação.',
  },
  IRIS_ERR_ONBOARDING_002_PROFILE_SAVE_FAILED: {
    code: 'IRIS_ERR_ONBOARDING_002_PROFILE_SAVE_FAILED',
    severity: 'error',
    technicalMessage: 'Falha genérica ao salvar dados na tabela profiles.',
    userMessage: 'Não conseguimos salvar seu perfil agora. Tente novamente.',
    meaning: 'O Supabase recusou ou falhou ao executar upsert em profiles.',
    probableCause: 'Coluna ausente, constraint, payload inválido ou conexão.',
    howToFix: 'Verificar SQL, payload enviado e logs do Supabase.',
  },
  IRIS_ERR_ONBOARDING_003_USERNAME_UNAVAILABLE: {
    code: 'IRIS_ERR_ONBOARDING_003_USERNAME_UNAVAILABLE',
    severity: 'warning',
    technicalMessage: 'Username já existe ou violou índice único.',
    userMessage: 'Esse @ já está em uso. Escolha outro nome de usuário.',
    meaning: 'Conflito de username no banco.',
    probableCause: 'Outro usuário salvou o mesmo username primeiro.',
    howToFix: 'Pedir novo username e validar novamente.',
  },
  IRIS_ERR_ONBOARDING_004_REQUIRED_FIELD: {
    code: 'IRIS_ERR_ONBOARDING_004_REQUIRED_FIELD',
    severity: 'warning',
    technicalMessage: 'Campo obrigatório ausente no onboarding essencial.',
    userMessage: 'Preencha os campos obrigatórios para continuar.',
    meaning: 'O perfil essencial não está completo.',
    probableCause: 'Nome, nascimento ou username ausente.',
    howToFix: 'Validar o formulário antes do save.',
  },
  IRIS_ERR_ONBOARDING_005_INVALID_BIRTH_DATE: {
    code: 'IRIS_ERR_ONBOARDING_005_INVALID_BIRTH_DATE',
    severity: 'warning',
    technicalMessage: 'Data de nascimento inválida.',
    userMessage: 'Selecione uma data de nascimento válida.',
    meaning: 'A data enviada não pode ser interpretada como nascimento válido.',
    probableCause: 'Formato incorreto, data futura ou valor vazio.',
    howToFix: 'Usar calendário e validação ISO yyyy-mm-dd.',
  },
  IRIS_ERR_ONBOARDING_006_RLS_DENIED: {
    code: 'IRIS_ERR_ONBOARDING_006_RLS_DENIED',
    severity: 'critical',
    technicalMessage: 'Row Level Security bloqueou insert/update em profiles.',
    userMessage: 'Seu perfil não pôde ser salvo por uma regra de segurança.',
    meaning: 'As policies do Supabase não permitem salvar a própria linha.',
    probableCause: 'Policy ausente, id diferente de auth.uid(), grant ausente.',
    howToFix: 'Executar SQL de RLS permitindo select/insert/update com id = auth.uid().',
  },
  IRIS_ERR_ONBOARDING_007_STORAGE_UPLOAD_FAILED: {
    code: 'IRIS_ERR_ONBOARDING_007_STORAGE_UPLOAD_FAILED',
    severity: 'error',
    technicalMessage: 'Falha no upload de imagem do onboarding.',
    userMessage: 'Não conseguimos salvar sua imagem agora.',
    meaning: 'Storage recusou o upload de avatar ou capa.',
    probableCause: 'Bucket ausente, policy ausente, arquivo inválido ou limite.',
    howToFix: 'Verificar bucket, policies e tamanho do arquivo.',
  },
  IRIS_ERR_ONBOARDING_008_REWARD_CLAIM_FAILED: {
    code: 'IRIS_ERR_ONBOARDING_008_REWARD_CLAIM_FAILED',
    severity: 'error',
    technicalMessage: 'Falha ao registrar recompensa de perfil completo.',
    userMessage: 'Seu perfil foi salvo, mas a recompensa ainda não foi liberada.',
    meaning: 'A recompensa não deve ser concedida apenas pelo client.',
    probableCause: 'Validação server-side ainda não implementada.',
    howToFix: 'Marcar reward como pending_validation até validar no servidor.',
  },
  IRIS_ERR_ONBOARDING_009_PROFILE_COMPLETION_INVALID: {
    code: 'IRIS_ERR_ONBOARDING_009_PROFILE_COMPLETION_INVALID',
    severity: 'warning',
    technicalMessage: 'Dados de conclusão do perfil inconsistentes.',
    userMessage: 'Algumas etapas ainda precisam ser revisadas.',
    meaning: 'O progresso calculado não corresponde aos dados disponíveis.',
    probableCause: 'Store local incompleto ou dados antigos.',
    howToFix: 'Recalcular completion_data e pedir etapas pendentes.',
  },
  IRIS_ERR_ONBOARDING_010_UNKNOWN: {
    code: 'IRIS_ERR_ONBOARDING_010_UNKNOWN',
    severity: 'error',
    technicalMessage: 'Erro desconhecido no onboarding.',
    userMessage: 'Algo inesperado aconteceu. Tente novamente.',
    meaning: 'Erro não classificado.',
    probableCause: 'Exceção não tratada.',
    howToFix: 'Registrar logs e classificar o erro depois.',
  },
};

export function getOnboardingErrorDefinition(code: OnboardingErrorCode) {
  return ONBOARDING_ERROR_LIBRARY[code];
}

export function resolveOnboardingErrorCode(error: any): OnboardingErrorCode {
  const message = String(error?.message || '').toLowerCase();
  const code = String(error?.code || '').toLowerCase();

  if (code === '42501' || message.includes('row-level security') || message.includes('rls')) {
    return 'IRIS_ERR_ONBOARDING_006_RLS_DENIED';
  }

  if (code === '23505' || message.includes('duplicate key') || message.includes('unique')) {
    return 'IRIS_ERR_ONBOARDING_003_USERNAME_UNAVAILABLE';
  }

  if (message.includes('session') || message.includes('auth')) {
    return 'IRIS_ERR_ONBOARDING_001_SESSION_NOT_FOUND';
  }

  return 'IRIS_ERR_ONBOARDING_002_PROFILE_SAVE_FAILED';
}

export function logOnboardingError(error: any, context: Record<string, unknown> = {}) {
  const code = resolveOnboardingErrorCode(error);
  const definition = getOnboardingErrorDefinition(code);

  console.warn('[IRIS_ONBOARDING_ERROR]', {
    code,
    severity: definition.severity,
    technicalMessage: definition.technicalMessage,
    userMessage: definition.userMessage,
    probableCause: definition.probableCause,
    howToFix: definition.howToFix,
    originalError: {
      code: error?.code,
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
    },
    context,
  });

  return definition;
}
