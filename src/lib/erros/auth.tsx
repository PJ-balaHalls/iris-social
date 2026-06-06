export type IrisAuthErrorScope = 'login' | 'register';
export type IrisAuthErrorSeverity = 'info' | 'warning' | 'critical';

export type IrisAuthErrorCode =
  | 'IRIS_AUTH_LOGIN_001'
  | 'IRIS_AUTH_LOGIN_002'
  | 'IRIS_AUTH_LOGIN_003'
  | 'IRIS_AUTH_LOGIN_004'
  | 'IRIS_AUTH_LOGIN_005'
  | 'IRIS_AUTH_LOGIN_999'
  | 'IRIS_AUTH_REGISTER_001'
  | 'IRIS_AUTH_REGISTER_002'
  | 'IRIS_AUTH_REGISTER_003'
  | 'IRIS_AUTH_REGISTER_004'
  | 'IRIS_AUTH_REGISTER_005'
  | 'IRIS_AUTH_REGISTER_999';

export type IrisAuthError = {
  code: IrisAuthErrorCode;
  scope: IrisAuthErrorScope;
  severity: IrisAuthErrorSeverity;
  log: string;
  technicalMessage: string;
  userTitle: string;
  userMessage: string;
  userAction: string;
  meaning: string;
  howToFix: string;
};

export type AuthActionError = {
  ok: false;
  code: IrisAuthErrorCode;
  title: string;
  message: string;
  action: string;
};

export const AUTH_LOGIN_ERRORS = {
  EMPTY_CREDENTIALS: {
    code: 'IRIS_AUTH_LOGIN_001',
    scope: 'login',
    severity: 'warning',
    log: 'Tentativa de login sem e-mail ou senha.',
    technicalMessage: 'Missing email or password before Supabase signInWithPassword.',
    userTitle: 'Faltam algumas informações.',
    userMessage: 'Preencha seu e-mail e senha para entrar no IRIS.',
    userAction: 'Confira os campos e tente novamente.',
    meaning: 'O formulário foi enviado sem as credenciais obrigatórias.',
    howToFix: 'Informe o e-mail cadastrado e a senha da conta.',
  },
  INVALID_CREDENTIALS: {
    code: 'IRIS_AUTH_LOGIN_002',
    scope: 'login',
    severity: 'warning',
    log: 'Supabase recusou as credenciais informadas.',
    technicalMessage: 'Invalid login credentials returned by auth provider.',
    userTitle: 'Não conseguimos entrar.',
    userMessage: 'O e-mail ou a senha parecem estar incorretos.',
    userAction: 'Revise os dados ou use “Esqueceu a senha?”.',
    meaning: 'O e-mail não existe, a senha está incorreta ou as credenciais não batem.',
    howToFix: 'Revise o e-mail e a senha. Se necessário, use “Esqueceu a senha?”.',
  },
  EMAIL_NOT_CONFIRMED: {
    code: 'IRIS_AUTH_LOGIN_003',
    scope: 'login',
    severity: 'info',
    log: 'Usuário tentou entrar sem confirmar o e-mail.',
    technicalMessage: 'Email not confirmed by auth provider.',
    userTitle: 'Confirme seu e-mail primeiro.',
    userMessage: 'Sua conta já existe, mas ainda precisa da confirmação por e-mail.',
    userAction: 'Abra o e-mail enviado pelo IRIS e confirme sua conta.',
    meaning: 'A conta existe, mas a confirmação de e-mail ainda não foi concluída.',
    howToFix: 'Abrir o link de confirmação enviado para o e-mail cadastrado.',
  },
  RATE_LIMITED: {
    code: 'IRIS_AUTH_LOGIN_004',
    scope: 'login',
    severity: 'warning',
    log: 'Muitas tentativas de login em pouco tempo.',
    technicalMessage: 'Rate limit or too many requests returned by auth provider.',
    userTitle: 'Vamos tentar com calma.',
    userMessage: 'Houve muitas tentativas de entrada em pouco tempo.',
    userAction: 'Aguarde alguns minutos e tente novamente.',
    meaning: 'O provedor bloqueou temporariamente novas tentativas por segurança.',
    howToFix: 'Esperar alguns minutos antes de tentar novamente.',
  },
  PROFILE_LOOKUP_FAILED: {
    code: 'IRIS_AUTH_LOGIN_005',
    scope: 'login',
    severity: 'critical',
    log: 'Login realizado, mas não foi possível ler o perfil/onboarding.',
    technicalMessage: 'Authenticated user, but profile onboarding lookup failed.',
    userTitle: 'Entramos, mas algo não carregou.',
    userMessage: 'Sua conta foi acessada, mas não conseguimos carregar seu perfil agora.',
    userAction: 'Tente novamente em alguns instantes.',
    meaning: 'A autenticação funcionou, porém houve falha ao consultar os dados de perfil.',
    howToFix: 'Validar RLS, tabela profiles e sessão do usuário.',
  },
  UNEXPECTED: {
    code: 'IRIS_AUTH_LOGIN_999',
    scope: 'login',
    severity: 'critical',
    log: 'Erro inesperado no fluxo de login.',
    technicalMessage: 'Unexpected login error.',
    userTitle: 'Não conseguimos abrir seu espaço.',
    userMessage: 'Algo inesperado aconteceu durante o acesso.',
    userAction: 'Tente novamente em alguns instantes.',
    meaning: 'Ocorreu uma falha não mapeada no fluxo de autenticação.',
    howToFix: 'Verifique os logs do servidor e a resposta do Supabase.',
  },
} as const satisfies Record<string, IrisAuthError>;

export const AUTH_REGISTER_ERRORS = {
  EMPTY_CREDENTIALS: {
    code: 'IRIS_AUTH_REGISTER_001',
    scope: 'register',
    severity: 'warning',
    log: 'Tentativa de cadastro sem e-mail ou senha.',
    technicalMessage: 'Missing email or password before Supabase signUp.',
    userTitle: 'Faltam algumas informações.',
    userMessage: 'Preencha seu e-mail e crie uma senha para continuar.',
    userAction: 'Confira os campos e tente novamente.',
    meaning: 'O formulário de cadastro foi enviado sem campos obrigatórios.',
    howToFix: 'Informe um e-mail válido e uma senha segura.',
  },
  WEAK_PASSWORD: {
    code: 'IRIS_AUTH_REGISTER_002',
    scope: 'register',
    severity: 'warning',
    log: 'Senha fraca bloqueada antes do cadastro.',
    technicalMessage: 'Password does not meet local minimum length requirement.',
    userTitle: 'Sua senha precisa ser mais segura.',
    userMessage: 'Use pelo menos 8 caracteres para proteger seu espaço.',
    userAction: 'Misture letras, números e símbolos se possível.',
    meaning: 'A senha informada não atende ao mínimo de segurança do IRIS.',
    howToFix: 'Usar pelo menos 8 caracteres, misturando letras, números e símbolos.',
  },
  USER_ALREADY_EXISTS: {
    code: 'IRIS_AUTH_REGISTER_003',
    scope: 'register',
    severity: 'info',
    log: 'Tentativa de cadastro com e-mail já existente.',
    technicalMessage: 'User already registered or email already exists.',
    userTitle: 'Esse e-mail já tem um espaço.',
    userMessage: 'Parece que já existe uma conta IRIS com esse e-mail.',
    userAction: 'Entre na conta ou use “Esqueceu a senha?”.',
    meaning: 'O e-mail informado já foi usado em outra conta.',
    howToFix: 'Entrar com esse e-mail ou recuperar a senha.',
  },
  INVALID_EMAIL: {
    code: 'IRIS_AUTH_REGISTER_004',
    scope: 'register',
    severity: 'warning',
    log: 'E-mail inválido informado no cadastro.',
    technicalMessage: 'Invalid email format rejected by validation or auth provider.',
    userTitle: 'Revise o e-mail.',
    userMessage: 'O e-mail informado não parece estar em um formato válido.',
    userAction: 'Confira se há usuário, @ e domínio. Exemplo: nome@email.com.',
    meaning: 'O e-mail não está em um formato aceito.',
    howToFix: 'Corrigir o formato do e-mail.',
  },
  SIGNUP_DISABLED_OR_LIMITED: {
    code: 'IRIS_AUTH_REGISTER_005',
    scope: 'register',
    severity: 'critical',
    log: 'Cadastro indisponível, limitado ou recusado pelo provedor.',
    technicalMessage: 'Signup disabled, rate limited, or rejected by auth provider.',
    userTitle: 'Não conseguimos criar sua conta agora.',
    userMessage: 'O cadastro está temporariamente indisponível.',
    userAction: 'Tente novamente em alguns instantes.',
    meaning: 'O cadastro foi recusado por configuração, limite ou instabilidade do provedor.',
    howToFix: 'Validar se o cadastro está habilitado no Supabase e conferir limites de autenticação.',
  },
  UNEXPECTED: {
    code: 'IRIS_AUTH_REGISTER_999',
    scope: 'register',
    severity: 'critical',
    log: 'Erro inesperado no fluxo de cadastro.',
    technicalMessage: 'Unexpected register error.',
    userTitle: 'Não conseguimos preparar seu espaço.',
    userMessage: 'Algo inesperado aconteceu durante a criação da conta.',
    userAction: 'Tente novamente em alguns instantes.',
    meaning: 'Ocorreu uma falha não mapeada no fluxo de criação da conta.',
    howToFix: 'Verifique os logs do servidor e a resposta do Supabase.',
  },
} as const satisfies Record<string, IrisAuthError>;

function normalizeAuthMessage(message?: string) {
  return String(message || '').toLowerCase();
}

export function resolveLoginAuthError(error?: { message?: string; status?: number; code?: string }) {
  const message = normalizeAuthMessage(error?.message);

  if (message.includes('email not confirmed') || message.includes('not confirmed')) {
    return AUTH_LOGIN_ERRORS.EMAIL_NOT_CONFIRMED;
  }

  if (
    message.includes('invalid login credentials') ||
    message.includes('invalid credentials') ||
    message.includes('invalid email or password')
  ) {
    return AUTH_LOGIN_ERRORS.INVALID_CREDENTIALS;
  }

  if (message.includes('rate limit') || message.includes('too many') || error?.status === 429) {
    return AUTH_LOGIN_ERRORS.RATE_LIMITED;
  }

  return AUTH_LOGIN_ERRORS.UNEXPECTED;
}

export function resolveRegisterAuthError(error?: { message?: string; status?: number; code?: string }) {
  const message = normalizeAuthMessage(error?.message);

  if (
    message.includes('already registered') ||
    message.includes('already exists') ||
    message.includes('user already')
  ) {
    return AUTH_REGISTER_ERRORS.USER_ALREADY_EXISTS;
  }

  if (message.includes('invalid email') || message.includes('email address is invalid')) {
    return AUTH_REGISTER_ERRORS.INVALID_EMAIL;
  }

  if (
    message.includes('password') &&
    (message.includes('weak') || message.includes('short') || message.includes('least'))
  ) {
    return AUTH_REGISTER_ERRORS.WEAK_PASSWORD;
  }

  if (
    message.includes('signup') ||
    message.includes('signups not allowed') ||
    message.includes('rate limit') ||
    message.includes('too many') ||
    error?.status === 429
  ) {
    return AUTH_REGISTER_ERRORS.SIGNUP_DISABLED_OR_LIMITED;
  }

  return AUTH_REGISTER_ERRORS.UNEXPECTED;
}

export function logAuthError(error: IrisAuthError, details?: Record<string, unknown>) {
  const payload = {
    code: error.code,
    scope: error.scope,
    severity: error.severity,
    log: error.log,
    technicalMessage: error.technicalMessage,
    meaning: error.meaning,
    howToFix: error.howToFix,
    details,
  };

  if (error.severity === 'critical') {
    console.error(`[${error.code}] ${error.log}`, payload);
    return;
  }

  console.warn(`[${error.code}] ${error.log}`, payload);
}

export function toAuthActionError(error: IrisAuthError): AuthActionError {
  return {
    ok: false,
    code: error.code,
    title: error.userTitle,
    message: error.userMessage,
    action: error.userAction,
  };
}