export type UsernameValidationResult = {
  valid: boolean;
  message: string;
};

export function normalizeUsername(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 24);
}

export function validateUsername(username: string): UsernameValidationResult {
  if (!username) {
    return {
      valid: false,
      message: 'Escolha um nome de usuário para continuar.',
    };
  }

  if (username.length < 3) {
    return {
      valid: false,
      message: 'Use pelo menos 3 caracteres.',
    };
  }

  if (username.length > 24) {
    return {
      valid: false,
      message: 'Use no máximo 24 caracteres.',
    };
  }

  if (!/^[a-z]/.test(username)) {
    return {
      valid: false,
      message: 'Comece com uma letra.',
    };
  }

  if (!/^[a-z0-9_]+$/.test(username)) {
    return {
      valid: false,
      message: 'Use apenas letras, números e underline.',
    };
  }

  if (username.includes('__')) {
    return {
      valid: false,
      message: 'Evite underlines repetidos.',
    };
  }

  const reserved = new Set([
    'admin',
    'administrator',
    'root',
    'support',
    'suporte',
    'iris',
    'iris_ai',
    'moderador',
    'mod',
    'api',
    'auth',
    'login',
    'register',
    'onboarding',
    'settings',
    'profile',
    'security',
    'privacy',
    'kids',
    'marketplace',
  ]);

  if (reserved.has(username)) {
    return {
      valid: false,
      message: 'Esse nome é reservado pela IRIS.',
    };
  }

  return {
    valid: true,
    message: 'Formato válido.',
  };
}

export function createUsernameSuggestions(params: {
  firstName?: string;
  socialName?: string;
  current?: string;
}) {
  const sourceName = params.socialName || params.firstName || params.current || 'memoria';
  const base = normalizeUsername(sourceName).split('_')[0] || 'memoria';

  const year = new Date().getFullYear().toString().slice(-2);

  const suggestions = [
    base,
    `${base}_iris`,
    `${base}_${year}`,
    `${base}_memorias`,
    `${base}_vida`,
    `${base}_jardim`,
    `${base}_cartas`,
    `eu_${base}`,
  ]
    .map(normalizeUsername)
    .filter((item) => validateUsername(item).valid);

  return Array.from(new Set(suggestions)).slice(0, 8);
}
