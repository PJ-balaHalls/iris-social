export type SecuritySectionKey =
  | 'access'
  | 'memories'
  | 'devices'
  | 'sessions'
  | 'two-factor'
  | '';

export type SecurityPreferences = {
  memory_access_enabled: boolean;
  memory_access_max_attempts: number;
  require_2fa: boolean;
  login_alerts_enabled: boolean;
  trusted_devices_enabled: boolean;
  session_review_required: boolean;
  account_switch_requires_confirmation: boolean;
};

export type MemoryQuestion = {
  id?: string;
  sort_order: number;
  question_text: string;
  is_enabled?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
  last_used_at?: string | null;
};

export type SecurityDevice = {
  id: string;
  label: string;
  user_agent?: string | null;
  ip_address?: string | null;
  location_label?: string | null;
  trust_level: 'current' | 'trusted' | 'unknown' | 'blocked' | string;
  last_seen_at?: string | null;
  created_at?: string | null;
  revoked_at?: string | null;
};

export type SecuritySession = {
  id: string;
  session_label: string;
  user_agent?: string | null;
  ip_address?: string | null;
  started_at?: string | null;
  last_seen_at?: string | null;
  expires_at?: string | null;
  revoked_at?: string | null;
};

export const defaultSecurityPreferences: SecurityPreferences = {
  memory_access_enabled: false,
  memory_access_max_attempts: 5,
  require_2fa: false,
  login_alerts_enabled: true,
  trusted_devices_enabled: true,
  session_review_required: false,
  account_switch_requires_confirmation: true,
};

export const suggestedMemoryQuestions = [
  'Qual foi uma memória que só você reconheceria?',
  'Qual lugar marcou uma fase importante da sua vida?',
  'Qual detalhe de uma relação importante você nunca esquece?',
  'Qual frase te lembra uma pessoa especial?',
  'Qual música representa um momento importante?',
  'Qual foi um pequeno gesto que ficou guardado?',
];

export function normalizeSecurityPreferences(value: unknown): SecurityPreferences {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return defaultSecurityPreferences;
  }

  const source = value as Record<string, unknown>;

  return {
    memory_access_enabled:
      typeof source.memory_access_enabled === 'boolean'
        ? source.memory_access_enabled
        : defaultSecurityPreferences.memory_access_enabled,

    memory_access_max_attempts:
      typeof source.memory_access_max_attempts === 'number'
        ? source.memory_access_max_attempts
        : defaultSecurityPreferences.memory_access_max_attempts,

    require_2fa:
      typeof source.require_2fa === 'boolean'
        ? source.require_2fa
        : defaultSecurityPreferences.require_2fa,

    login_alerts_enabled:
      typeof source.login_alerts_enabled === 'boolean'
        ? source.login_alerts_enabled
        : defaultSecurityPreferences.login_alerts_enabled,

    trusted_devices_enabled:
      typeof source.trusted_devices_enabled === 'boolean'
        ? source.trusted_devices_enabled
        : defaultSecurityPreferences.trusted_devices_enabled,

    session_review_required:
      typeof source.session_review_required === 'boolean'
        ? source.session_review_required
        : defaultSecurityPreferences.session_review_required,

    account_switch_requires_confirmation:
      typeof source.account_switch_requires_confirmation === 'boolean'
        ? source.account_switch_requires_confirmation
        : defaultSecurityPreferences.account_switch_requires_confirmation,
  };
}

export function stringValue(value: unknown, fallback = 'Não informado') {
  if (value === null || value === undefined || value === '') return fallback;
  return String(value);
}

export function boolLabel(value: boolean) {
  return value ? 'Ativo' : 'Desativado';
}

export function formatDateTime(value?: string | null) {
  if (!value) return 'Não registrado';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getSecurityScore(
  preferences: SecurityPreferences,
  questionsCount: number,
) {
  const checks = [
    preferences.login_alerts_enabled,
    preferences.trusted_devices_enabled,
    preferences.session_review_required,
    preferences.require_2fa,
    preferences.memory_access_enabled && questionsCount > 0,
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function getDeviceLabel(userAgent?: string | null) {
  if (!userAgent) return 'Dispositivo desconhecido';

  const lower = userAgent.toLowerCase();

  if (lower.includes('windows')) return 'Windows';
  if (lower.includes('iphone')) return 'iPhone';
  if (lower.includes('android')) return 'Android';
  if (lower.includes('mac')) return 'Mac';
  if (lower.includes('linux')) return 'Linux';

  return 'Navegador';
}
