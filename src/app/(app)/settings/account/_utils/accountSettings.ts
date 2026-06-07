export type AccountProfile = Record<string, unknown>;

export type AccountKnowledgePayload = {
  account: {
    id?: string;
    email?: string | null;
    phone?: string | null;
    created_at?: string | null;
    last_sign_in_at?: string | null;
    email_confirmed_at?: string | null;
    user_metadata?: Record<string, unknown>;
    app_metadata?: Record<string, unknown>;
  };
  profile: AccountProfile;
  subscription: Record<string, unknown> | null;
  exported_at: string;
};

export const languageOptions = [
  {
    label: 'Português do Brasil',
    value: 'pt-BR',
    description: 'Interface, datas e mensagens em português.',
  },
  {
    label: 'English',
    value: 'en',
    description: 'Interface and system messages in English.',
  },
  {
    label: 'Español',
    value: 'es',
    description: 'Interfaz y mensajes en español.',
  },
];

export const languageLabels: Record<string, string> = {
  'pt-BR': 'Português do Brasil',
  en: 'English',
  es: 'Español',
};

export function stringValue(value: unknown, fallback = 'Não informado') {
  if (value === null || value === undefined || value === '') return fallback;
  return String(value);
}

export function rawString(value: unknown) {
  if (value === null || value === undefined) return '';
  return String(value);
}

export function formatDate(value?: unknown) {
  if (!value) return 'Não informado';

  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatDateInput(value?: unknown) {
  if (!value) return '';

  const stringDate = String(value);

  if (/^\d{4}-\d{2}-\d{2}$/.test(stringDate)) return stringDate;

  const date = new Date(stringDate);
  if (Number.isNaN(date.getTime())) return '';

  return date.toISOString().slice(0, 10);
}

export function getInitials(name?: unknown) {
  const safeName = stringValue(name, 'IRIS');

  return safeName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function getKnownProfileFields(profile: AccountProfile) {
  return Object.entries(profile).filter(([, value]) => {
    if (value === null || value === undefined || value === '') return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value as Record<string, unknown>).length > 0;
    return true;
  });
}

export function getObjectSize(value: unknown) {
  if (!value) return 0;
  if (Array.isArray(value)) return value.length;
  if (typeof value === 'object') return Object.keys(value as Record<string, unknown>).length;
  return 1;
}

export function isSensitiveKey(key: string) {
  const normalized = key.toLowerCase();

  return [
    'id',
    'email',
    'phone',
    'cpf',
    'birth',
    'birth_date',
    'address',
    'token',
    'metadata',
    'session',
    'avatar',
    'cover',
  ].some((term) => normalized.includes(term));
}

export function maskValue(key: string, value: unknown) {
  if (value === null || value === undefined || value === '') return '—';

  if (Array.isArray(value)) return `${value.length} itens`;
  if (typeof value === 'object') return `${Object.keys(value as Record<string, unknown>).length} campos`;

  const text = String(value);

  if (!isSensitiveKey(key)) {
    return text;
  }

  if (text.includes('@')) {
    const [name, domain] = text.split('@');
    return `${name.slice(0, 2)}••••@${domain}`;
  }

  if (text.length <= 4) return '••••';

  return `${text.slice(0, 2)}••••${text.slice(-2)}`;
}

export function downloadJson(filename: string, payload: unknown) {
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}
