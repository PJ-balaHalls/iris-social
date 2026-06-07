#!/usr/bin/env bash
set -euo pipefail

echo "==> IRIS: criando Settings modular + corrigindo fluxo pós-login"

mkdir -p \
  "src/components/settings" \
  "src/lib/settings" \
  "src/lib/actions" \
  "src/app/(app)/settings" \
  "src/app/iris"

# ------------------------------------------------------------
# 1. Catálogo central de configurações
# ------------------------------------------------------------
cat > "src/lib/settings/settingsCatalog.ts" <<'TS'
export type SettingStatus = 'ready' | 'recommended' | 'planned' | 'sensitive';

export type SettingsSource =
  | 'profiles'
  | 'subscriptions'
  | 'uslife_invites'
  | 'plan_interest_requests'
  | 'none';

export type SettingsOption = {
  key: string;
  title: string;
  subtitle: string;
  description: string;
  group: string;
  icon: string;
  status: SettingStatus;
  href: string;
  columns?: string[];
  source?: SettingsSource;
};

export const settingsGroups = [
  'Conta',
  'Perfil',
  'Privacidade',
  'Experiência',
  'Personalização',
  'Dados',
  'Produto',
  'Sistema',
  'Risco',
];

export const settingsOptions: SettingsOption[] = [
  {
    key: 'account',
    title: 'Conta',
    subtitle: 'Identidade da conta.',
    description: 'Dados centrais da conta, e-mail, nascimento, país e idioma.',
    group: 'Conta',
    icon: 'UserRound',
    status: 'ready',
    href: '/settings/account',
    source: 'profiles',
    columns: ['id', 'full_name', 'first_name', 'social_name', 'username', 'birth_date', 'country', 'language'],
  },
  {
    key: 'profile',
    title: 'Perfil essencial',
    subtitle: 'Nome público e Identity Space.',
    description: 'Ajuste nome, username, nome social e informações públicas do perfil.',
    group: 'Perfil',
    icon: 'BadgeCheck',
    status: 'ready',
    href: '/settings/profile',
    source: 'profiles',
    columns: ['full_name', 'first_name', 'social_name', 'username', 'birth_date'],
  },
  {
    key: 'media',
    title: 'Avatar e capa',
    subtitle: 'Identidade visual.',
    description: 'Configure avatar, capa e cor simbólica da sua presença na IRIS.',
    group: 'Perfil',
    icon: 'Image',
    status: 'recommended',
    href: '/settings/media',
    source: 'profiles',
    columns: ['avatar_url', 'cover_url', 'color_symbol'],
  },
  {
    key: 'privacy',
    title: 'Privacidade',
    subtitle: 'Visibilidade e limites.',
    description: 'Controle descoberta, mensagens, convites e exposição do perfil.',
    group: 'Privacidade',
    icon: 'LockKeyhole',
    status: 'recommended',
    href: '/settings/privacy',
    source: 'profiles',
    columns: ['privacy_level', 'privacy_data', 'privacy_completed_at'],
  },
  {
    key: 'security',
    title: 'Segurança',
    subtitle: 'Sessão, senha e proteção.',
    description: 'Área sensível para sessão, login, alertas, dispositivos e proteção.',
    group: 'Privacidade',
    icon: 'ShieldCheck',
    status: 'sensitive',
    href: '/settings/security',
    source: 'profiles',
    columns: ['id', 'created_at', 'updated_at'],
  },
  {
    key: 'appearance',
    title: 'Aparência',
    subtitle: 'Tema visual.',
    description: 'Tema claro, escuro, sistema, destaque visual e densidade.',
    group: 'Experiência',
    icon: 'Palette',
    status: 'ready',
    href: '/settings/appearance',
    source: 'profiles',
    columns: ['theme_preference', 'accessibility_data'],
  },
  {
    key: 'accessibility',
    title: 'Acessibilidade',
    subtitle: 'Leitura, fonte e movimento.',
    description: 'Tamanho da fonte, dislexia, contraste, movimento reduzido e conforto.',
    group: 'Experiência',
    icon: 'Accessibility',
    status: 'ready',
    href: '/settings/accessibility',
    source: 'profiles',
    columns: ['accessibility_data', 'accessibility_completed_at', 'theme_preference'],
  },
  {
    key: 'language',
    title: 'Idioma e região',
    subtitle: 'Localização da experiência.',
    description: 'Idioma principal, país, região e preferências de localização.',
    group: 'Experiência',
    icon: 'Languages',
    status: 'ready',
    href: '/settings/language',
    source: 'profiles',
    columns: ['language', 'country', 'timezone'],
  },
  {
    key: 'personality',
    title: 'Personalidade',
    subtitle: 'Como a IRIS entende você.',
    description: 'Sinais de personalidade, energia, percepção, decisão e ritmo social.',
    group: 'Personalização',
    icon: 'Brain',
    status: 'recommended',
    href: '/settings/personality',
    source: 'profiles',
    columns: ['personality_data', 'personality_completed_at'],
  },
  {
    key: 'culture',
    title: 'Cultura',
    subtitle: 'Temas e repertório.',
    description: 'Livros, filmes, músicas, temas, hobbies e lugares afetivos.',
    group: 'Personalização',
    icon: 'Sparkles',
    status: 'recommended',
    href: '/settings/culture',
    source: 'profiles',
    columns: ['culture_tags', 'culture_data', 'culture_completed_at'],
  },
  {
    key: 'intention',
    title: 'Intenção',
    subtitle: 'Direção da experiência.',
    description: 'O que a IRIS deve priorizar: memória, diário, conexão, IA ou usLIFE.',
    group: 'Personalização',
    icon: 'Compass',
    status: 'recommended',
    href: '/settings/intention',
    source: 'profiles',
    columns: ['intention', 'intention_data', 'intention_completed_at'],
  },
  {
    key: 'flora',
    title: 'Flora',
    subtitle: 'Identidade viva.',
    description: 'Espécie, estágio e inclinação simbólica da conta.',
    group: 'Personalização',
    icon: 'Leaf',
    status: 'ready',
    href: '/settings/flora',
    source: 'profiles',
    columns: ['especie', 'estagio', 'inclinacao'],
  },
  {
    key: 'integrations',
    title: 'Integrações',
    subtitle: 'Conexões externas.',
    description: 'Preferências de fotos, música, calendário, contatos, e-mail e arquivos.',
    group: 'Dados',
    icon: 'Plug',
    status: 'planned',
    href: '/settings/integrations',
    source: 'profiles',
    columns: ['integration_preferences', 'integration_data', 'integrations_completed_at'],
  },
  {
    key: 'data-export',
    title: 'Dados e exportação',
    subtitle: 'Controle dos dados.',
    description: 'Exportar dados, revisar consentimentos e preparar portabilidade.',
    group: 'Dados',
    icon: 'Database',
    status: 'planned',
    href: '/settings/data-export',
    source: 'profiles',
    columns: ['id', 'created_at', 'updated_at'],
  },
  {
    key: 'subscription',
    title: 'Assinatura',
    subtitle: 'Plano ativo e ciclo.',
    description: 'Dados da assinatura: plano, status, trial e período atual.',
    group: 'Produto',
    icon: 'CreditCard',
    status: 'ready',
    href: '/settings/subscription',
    source: 'subscriptions',
    columns: ['plan', 'status', 'trial_ends_at', 'current_period_ends_at', 'created_at', 'updated_at'],
  },
  {
    key: 'plan',
    title: 'Plano escolhido',
    subtitle: 'Preferência do onboarding.',
    description: 'Preferência de plano, ciclo, código e interesse sob demanda.',
    group: 'Produto',
    icon: 'Crown',
    status: 'ready',
    href: '/settings/plan',
    source: 'profiles',
    columns: ['plan_key', 'plan_data', 'plan_completed_at'],
  },
  {
    key: 'uslife',
    title: 'usLIFE',
    subtitle: 'Convites e espaço compartilhado.',
    description: 'Preferências de vínculo, convite e permissões do usLIFE.',
    group: 'Produto',
    icon: 'HeartHandshake',
    status: 'recommended',
    href: '/settings/uslife',
    source: 'profiles',
    columns: ['uslife_invite_data', 'uslife_invite_completed_at'],
  },
  {
    key: 'kids',
    title: 'IRIS Kids',
    subtitle: 'Ambiente protegido.',
    description: 'Responsáveis, restrições, contatos aprovados e modo infantil.',
    group: 'Produto',
    icon: 'Baby',
    status: 'planned',
    href: '/settings/kids',
    source: 'profiles',
    columns: ['is_kids_account', 'guardian_data', 'kids_restrictions'],
  },
  {
    key: 'sensitive-content',
    title: 'Conteúdo sensível',
    subtitle: 'Filtros e proteção.',
    description: 'Controle conteúdo adulto, filtros de conforto e restrições.',
    group: 'Risco',
    icon: 'EyeOff',
    status: 'sensitive',
    href: '/settings/sensitive-content',
    source: 'profiles',
    columns: ['sensitive_content_enabled', 'sensitive_content_data'],
  },
  {
    key: 'devices',
    title: 'Dispositivos',
    subtitle: 'Acessos ativos.',
    description: 'Aparelhos conectados, sessões ativas e dispositivos confiáveis.',
    group: 'Privacidade',
    icon: 'MonitorSmartphone',
    status: 'planned',
    href: '/settings/devices',
    source: 'profiles',
    columns: ['trusted_devices', 'last_login_at'],
  },
  {
    key: 'notifications',
    title: 'Notificações',
    subtitle: 'Alertas e lembretes.',
    description: 'Push, e-mail, lembretes, mensagens e modo silencioso.',
    group: 'Sistema',
    icon: 'Bell',
    status: 'planned',
    href: '/settings/notifications',
    source: 'profiles',
    columns: ['notification_preferences'],
  },
  {
    key: 'completion',
    title: 'Conclusão do perfil',
    subtitle: 'Progresso e recompensas.',
    description: 'Status do onboarding, badges, tema gratuito e recompensas.',
    group: 'Sistema',
    icon: 'Gift',
    status: 'ready',
    href: '/settings/completion',
    source: 'profiles',
    columns: ['onboarding_status', 'onboarding_completed', 'profile_completion_status', 'profile_completion_reward_status', 'profile_badges', 'unlocked_themes'],
  },
  {
    key: 'diagnostics',
    title: 'Diagnóstico',
    subtitle: 'Debug e ambiente.',
    description: 'Sessão, cache, Supabase, integridade de perfil e checks técnicos.',
    group: 'Sistema',
    icon: 'Activity',
    status: 'planned',
    href: '/settings/diagnostics',
    source: 'profiles',
    columns: ['id', 'created_at', 'updated_at'],
  },
  {
    key: 'delete-account',
    title: 'Encerrar conta',
    subtitle: 'Pausa ou exclusão.',
    description: 'Desativar, pausar ou solicitar exclusão definitiva da conta.',
    group: 'Risco',
    icon: 'Trash2',
    status: 'sensitive',
    href: '/settings/delete-account',
    source: 'profiles',
    columns: ['id', 'created_at'],
  },
];

export const quickSettingsKeys = [
  'account',
  'profile',
  'privacy',
  'security',
  'appearance',
  'accessibility',
  'language',
  'integrations',
  'subscription',
  'data-export',
  'sensitive-content',
  'kids',
  'devices',
  'personality',
  'culture',
  'intention',
];

export const onboardingSettingKeys = [
  'profile',
  'media',
  'personality',
  'culture',
  'integrations',
  'intention',
  'privacy',
  'accessibility',
  'uslife',
  'plan',
  'flora',
  'completion',
];

export function getSettingByKey(key: string) {
  return settingsOptions.find((option) => option.key === key) || settingsOptions[0];
}

export function getQuickSettings() {
  return quickSettingsKeys.map((key) => getSettingByKey(key)).filter(Boolean);
}

export function getSettingsByGroup(group: string) {
  return settingsOptions.filter((option) => option.group === group);
}

export function getAllSettingsGroups() {
  return settingsGroups
    .map((group) => ({
      group,
      options: getSettingsByGroup(group),
    }))
    .filter((section) => section.options.length > 0);
}
TS

# ------------------------------------------------------------
# 2. Metadados dos campos editáveis por seção
# ------------------------------------------------------------
cat > "src/lib/settings/settingsFields.ts" <<'TS'
export type SettingsFieldType =
  | 'text'
  | 'email'
  | 'date'
  | 'color'
  | 'textarea'
  | 'json'
  | 'select'
  | 'array'
  | 'readonly';

export type SettingsFieldOption = {
  label: string;
  value: string;
};

export type SettingsField = {
  name: string;
  label: string;
  type: SettingsFieldType;
  helper?: string;
  placeholder?: string;
  rows?: number;
  readonly?: boolean;
  options?: SettingsFieldOption[];
};

const themeOptions = [
  { label: 'Seguir sistema', value: 'system' },
  { label: 'Claro', value: 'light' },
  { label: 'Escuro', value: 'dark' },
];

const privacyOptions = [
  { label: 'Privado', value: 'private' },
  { label: 'Visível por afinidade', value: 'affinity' },
  { label: 'Público', value: 'public' },
];

const planOptions = [
  { label: 'Free', value: 'free' },
  { label: 'Premium', value: 'premium' },
  { label: 'Duo', value: 'duo' },
];

export const settingsSectionFields: Record<string, SettingsField[]> = {
  account: [
    { name: 'full_name', label: 'Nome completo', type: 'text', placeholder: 'Seu nome completo' },
    { name: 'first_name', label: 'Primeiro nome', type: 'text', placeholder: 'Como a IRIS deve te chamar' },
    { name: 'social_name', label: 'Nome social', type: 'text', placeholder: 'Opcional' },
    { name: 'birth_date', label: 'Data de nascimento', type: 'date' },
    { name: 'country', label: 'País', type: 'text', placeholder: 'Brasil' },
    { name: 'language', label: 'Idioma principal', type: 'select', options: [
      { label: 'Português', value: 'pt-BR' },
      { label: 'English', value: 'en' },
      { label: 'Español', value: 'es' },
    ] },
  ],
  profile: [
    { name: 'full_name', label: 'Nome exibido', type: 'text' },
    { name: 'first_name', label: 'Primeiro nome', type: 'text' },
    { name: 'social_name', label: 'Nome social', type: 'text' },
    { name: 'username', label: '@username', type: 'text', helper: 'Identificador público único da conta.' },
    { name: 'birth_date', label: 'Nascimento', type: 'date' },
  ],
  media: [
    { name: 'avatar_url', label: 'URL do avatar', type: 'text' },
    { name: 'cover_url', label: 'URL da capa', type: 'text' },
    { name: 'color_symbol', label: 'Cor simbólica', type: 'color' },
  ],
  privacy: [
    { name: 'privacy_level', label: 'Nível de privacidade', type: 'select', options: privacyOptions },
    { name: 'privacy_data', label: 'Preferências avançadas', type: 'json', rows: 10 },
  ],
  security: [
    { name: 'id', label: 'ID da conta', type: 'readonly' },
    { name: 'created_at', label: 'Criada em', type: 'readonly' },
    { name: 'updated_at', label: 'Atualizada em', type: 'readonly' },
  ],
  appearance: [
    { name: 'theme_preference', label: 'Tema', type: 'select', options: themeOptions },
    { name: 'accessibility_data', label: 'Preferências visuais avançadas', type: 'json', rows: 10 },
  ],
  accessibility: [
    { name: 'theme_preference', label: 'Tema preferido', type: 'select', options: themeOptions },
    { name: 'accessibility_data', label: 'Configurações de acessibilidade', type: 'json', rows: 12, helper: 'Ex.: fontSize, reducedMotion, dyslexiaMode, highContrast.' },
  ],
  language: [
    { name: 'language', label: 'Idioma', type: 'select', options: [
      { label: 'Português do Brasil', value: 'pt-BR' },
      { label: 'English', value: 'en' },
      { label: 'Español', value: 'es' },
    ] },
    { name: 'country', label: 'País', type: 'text' },
    { name: 'timezone', label: 'Fuso horário', type: 'text', placeholder: 'America/Sao_Paulo' },
  ],
  personality: [
    { name: 'personality_data', label: 'Dados de personalidade', type: 'json', rows: 14 },
  ],
  culture: [
    { name: 'culture_tags', label: 'Tags culturais', type: 'array', helper: 'Uma tag por linha.' },
    { name: 'culture_data', label: 'Dados culturais avançados', type: 'json', rows: 12 },
  ],
  intention: [
    { name: 'intention', label: 'Intenção principal', type: 'select', options: [
      { label: 'Preservar memórias', value: 'memories' },
      { label: 'Escrever diários', value: 'journals' },
      { label: 'Conhecer pessoas profundas', value: 'connections' },
      { label: 'Criar um espaço usLIFE', value: 'uslife' },
      { label: 'Explorar IA e personagens', value: 'ai' },
    ] },
    { name: 'intention_data', label: 'Detalhes da intenção', type: 'json', rows: 10 },
  ],
  flora: [
    { name: 'especie', label: 'Espécie', type: 'text' },
    { name: 'estagio', label: 'Estágio', type: 'text' },
    { name: 'inclinacao', label: 'Inclinação', type: 'text' },
  ],
  integrations: [
    { name: 'integration_preferences', label: 'Preferências de integração', type: 'json', rows: 12 },
    { name: 'integration_data', label: 'Dados de integração', type: 'json', rows: 12 },
  ],
  'data-export': [
    { name: 'id', label: 'ID da conta', type: 'readonly' },
    { name: 'created_at', label: 'Criada em', type: 'readonly' },
    { name: 'updated_at', label: 'Atualizada em', type: 'readonly' },
  ],
  subscription: [
    { name: 'plan', label: 'Plano ativo', type: 'readonly' },
    { name: 'status', label: 'Status', type: 'readonly' },
    { name: 'trial_ends_at', label: 'Fim do trial', type: 'readonly' },
    { name: 'current_period_ends_at', label: 'Fim do ciclo atual', type: 'readonly' },
  ],
  plan: [
    { name: 'plan_key', label: 'Plano preferido', type: 'select', options: planOptions },
    { name: 'plan_data', label: 'Preferências do plano', type: 'json', rows: 10 },
  ],
  uslife: [
    { name: 'uslife_invite_data', label: 'Preferências usLIFE', type: 'json', rows: 12 },
  ],
  kids: [
    { name: 'guardian_data', label: 'Responsável', type: 'json', rows: 10 },
    { name: 'kids_restrictions', label: 'Restrições', type: 'json', rows: 10 },
  ],
  'sensitive-content': [
    { name: 'sensitive_content_data', label: 'Preferências de conteúdo sensível', type: 'json', rows: 10 },
  ],
  devices: [
    { name: 'trusted_devices', label: 'Dispositivos confiáveis', type: 'json', rows: 10 },
    { name: 'last_login_at', label: 'Último login', type: 'readonly' },
  ],
  notifications: [
    { name: 'notification_preferences', label: 'Preferências de notificação', type: 'json', rows: 12 },
  ],
  completion: [
    { name: 'onboarding_status', label: 'Status do onboarding', type: 'readonly' },
    { name: 'onboarding_completed', label: 'Onboarding concluído', type: 'readonly' },
    { name: 'profile_completion_status', label: 'Status do perfil', type: 'readonly' },
    { name: 'profile_badges', label: 'Badges', type: 'readonly' },
    { name: 'unlocked_themes', label: 'Temas desbloqueados', type: 'readonly' },
  ],
  diagnostics: [
    { name: 'id', label: 'ID', type: 'readonly' },
    { name: 'created_at', label: 'Criado em', type: 'readonly' },
    { name: 'updated_at', label: 'Atualizado em', type: 'readonly' },
  ],
  'delete-account': [
    { name: 'id', label: 'ID da conta', type: 'readonly' },
    { name: 'created_at', label: 'Criada em', type: 'readonly' },
  ],
};

export function getFieldsForSetting(key: string, columns: string[] = []) {
  const explicit = settingsSectionFields[key];

  if (explicit?.length) return explicit;

  return columns.map((column) => ({
    name: column,
    label: column.replaceAll('_', ' '),
    type: 'readonly' as const,
  }));
}
TS

# ------------------------------------------------------------
# 3. Ícones de settings
# ------------------------------------------------------------
cat > "src/components/settings/SettingsIcon.tsx" <<'TSX'
import {
  Accessibility,
  Activity,
  Baby,
  BadgeCheck,
  Bell,
  Brain,
  Compass,
  CreditCard,
  Crown,
  Database,
  EyeOff,
  Gift,
  HeartHandshake,
  Image as ImageIcon,
  Languages,
  Leaf,
  LockKeyhole,
  MonitorSmartphone,
  Palette,
  Plug,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
} from 'lucide-react';

type SettingsIconProps = {
  name: string;
  size?: number;
  className?: string;
};

const iconMap: Record<string, typeof Settings> = {
  Accessibility,
  Activity,
  Baby,
  BadgeCheck,
  Bell,
  Brain,
  Compass,
  CreditCard,
  Crown,
  Database,
  EyeOff,
  Gift,
  HeartHandshake,
  Image: ImageIcon,
  Languages,
  Leaf,
  LockKeyhole,
  MonitorSmartphone,
  Palette,
  Plug,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
};

export function SettingsIcon({
  name,
  size = 18,
  className,
}: SettingsIconProps) {
  const Icon = iconMap[name] || Settings;
  return <Icon size={size} strokeWidth={1.8} className={className} />;
}
TSX

# ------------------------------------------------------------
# 4. Server Action para salvar Settings
# ------------------------------------------------------------
cat > "src/lib/actions/settings.actions.ts" <<'TS'
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServer } from '@/lib/supabase/server';
import { getSettingByKey } from '@/lib/settings/settingsCatalog';
import { getFieldsForSetting, type SettingsField } from '@/lib/settings/settingsFields';

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

function parseJson(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return {};
  return JSON.parse(trimmed);
}

function parseArray(raw: string) {
  return raw
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseValue(field: SettingsField, raw: string) {
  if (field.readonly || field.type === 'readonly') return undefined;

  if (field.type === 'json') return parseJson(raw);
  if (field.type === 'array') return parseArray(raw);

  const trimmed = raw.trim();

  if (!trimmed) return null;

  return trimmed;
}

function isMissingColumnError(error: any) {
  const message = String(error?.message || '').toLowerCase();
  return error?.code === 'PGRST204' || message.includes('could not find') || message.includes('schema cache');
}

function buildRedirectPath(sectionKey: string, params: Record<string, string>) {
  const search = new URLSearchParams(params);
  return `/settings/${sectionKey}?${search.toString()}`;
}

export async function updateSettingsSectionAction(formData: FormData) {
  const sectionKey = getString(formData, 'sectionKey');
  const option = getSettingByKey(sectionKey);

  if (!sectionKey || !option) {
    redirect('/settings?error=unknown-section');
  }

  if (option.source !== 'profiles') {
    redirect(buildRedirectPath(sectionKey, { readonly: '1' }));
  }

  const supabase = createServer();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/auth/login');
  }

  const fields = getFieldsForSetting(option.key, option.columns);
  const payload: Record<string, unknown> = {};

  try {
    for (const field of fields) {
      const value = parseValue(field, getString(formData, field.name));
      if (value !== undefined) payload[field.name] = value;
    }
  } catch {
    redirect(buildRedirectPath(sectionKey, { error: 'invalid-json' }));
  }

  if (!Object.keys(payload).length) {
    redirect(buildRedirectPath(sectionKey, { readonly: '1' }));
  }

  const { error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', user.id);

  if (!error) {
    revalidatePath('/settings');
    revalidatePath(`/settings/${sectionKey}`);
    redirect(buildRedirectPath(sectionKey, { saved: '1' }));
  }

  if (error.code === '23505') {
    redirect(buildRedirectPath(sectionKey, { error: 'duplicate' }));
  }

  if (!isMissingColumnError(error)) {
    console.error('[IRIS_SETTINGS_UPDATE_FAILED]', {
      sectionKey,
      code: error.code,
      message: error.message,
      details: error.details,
    });

    redirect(buildRedirectPath(sectionKey, { error: 'database' }));
  }

  const accepted: string[] = [];

  for (const [column, value] of Object.entries(payload)) {
    const { error: singleError } = await supabase
      .from('profiles')
      .update({ [column]: value })
      .eq('id', user.id);

    if (!singleError) {
      accepted.push(column);
      continue;
    }

    if (singleError.code === '23505') {
      redirect(buildRedirectPath(sectionKey, { error: 'duplicate' }));
    }

    console.warn('[IRIS_SETTINGS_COLUMN_SKIPPED]', {
      sectionKey,
      column,
      code: singleError.code,
      message: singleError.message,
    });
  }

  revalidatePath('/settings');
  revalidatePath(`/settings/${sectionKey}`);

  if (accepted.length) {
    redirect(buildRedirectPath(sectionKey, { saved: 'partial', fields: String(accepted.length) }));
  }

  redirect(buildRedirectPath(sectionKey, { error: 'missing-columns' }));
}
TS

# ------------------------------------------------------------
# 5. Renderer de campos
# ------------------------------------------------------------
cat > "src/components/settings/SettingsFieldRenderer.tsx" <<'TSX'
import type { SettingsField } from '@/lib/settings/settingsFields';

type SettingsFieldRendererProps = {
  field: SettingsField;
  value: unknown;
};

function stringifyValue(value: unknown) {
  if (value === null || value === undefined) return '';

  if (Array.isArray(value)) {
    return value.join('\n');
  }

  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

const fieldClassName =
  'mt-2 w-full rounded-[18px] border border-emerald-950/10 bg-white/70 px-4 py-3 text-sm text-[#1B3A2E] shadow-sm outline-none transition focus:border-[#9A7CA7] focus:ring-4 focus:ring-[#9A7CA7]/15';

export function SettingsFieldRenderer({ field, value }: SettingsFieldRendererProps) {
  const currentValue = stringifyValue(value);
  const isReadonly = field.readonly || field.type === 'readonly';

  return (
    <label className="block rounded-[24px] border border-white/70 bg-white/35 p-4">
      <span className="text-sm font-semibold text-[#1B3A2E]">{field.label}</span>

      {field.helper ? (
        <span className="mt-1 block text-xs leading-5 text-[#747D79]">{field.helper}</span>
      ) : null}

      {isReadonly ? (
        <pre className="mt-3 max-h-44 overflow-auto rounded-[18px] border border-emerald-950/10 bg-[#F2F4F3]/80 p-4 text-xs leading-5 text-[#476153]">
          {currentValue || '—'}
        </pre>
      ) : field.type === 'select' ? (
        <select name={field.name} defaultValue={currentValue} className={fieldClassName}>
          <option value="">Selecionar</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : field.type === 'textarea' || field.type === 'json' || field.type === 'array' ? (
        <textarea
          name={field.name}
          defaultValue={currentValue}
          rows={field.rows || (field.type === 'array' ? 7 : 8)}
          placeholder={field.placeholder}
          spellCheck={field.type !== 'json'}
          className={`${fieldClassName} font-mono text-xs leading-5`}
        />
      ) : (
        <input
          name={field.name}
          type={field.type === 'date' || field.type === 'color' || field.type === 'email' ? field.type : 'text'}
          defaultValue={currentValue}
          placeholder={field.placeholder}
          className={field.type === 'color' ? `${fieldClassName} h-14 p-2` : fieldClassName}
        />
      )}
    </label>
  );
}
TSX

# ------------------------------------------------------------
# 6. Página de detalhe reutilizável, mas renderizada em rotas separadas
# ------------------------------------------------------------
cat > "src/components/settings/SettingsSectionPage.tsx" <<'TSX'
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, Database, Save, ShieldCheck } from 'lucide-react';
import { updateSettingsSectionAction } from '@/lib/actions/settings.actions';
import { getSettingByKey } from '@/lib/settings/settingsCatalog';
import { getFieldsForSetting } from '@/lib/settings/settingsFields';
import { createServer } from '@/lib/supabase/server';
import { SettingsFieldRenderer } from './SettingsFieldRenderer';
import { SettingsIcon } from './SettingsIcon';

type SettingsSectionPageProps = {
  sectionKey: string;
};

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
}

function isEditableField(type: string, readonly?: boolean) {
  return !readonly && type !== 'readonly';
}

async function getSettingsData() {
  const supabase = createServer();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  return {
    user,
    profile: profile || {},
    subscription: subscription || {},
  };
}

export async function SettingsSectionPage({ sectionKey }: SettingsSectionPageProps) {
  const option = getSettingByKey(sectionKey);
  const fields = getFieldsForSetting(option.key, option.columns);
  const { profile, subscription } = await getSettingsData();

  const sourceData = option.source === 'subscriptions' ? subscription : profile;
  const canEdit = option.source === 'profiles' && fields.some((field) => isEditableField(field.type, field.readonly));

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-4 py-5 text-[#1B3A2E] sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-[1440px] gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
        <section className="rounded-[34px] border border-white/75 bg-white/45 p-5 shadow-[0_24px_80px_rgba(27,58,46,0.08)] backdrop-blur-xl sm:p-7 lg:p-8">
          <div className="flex flex-col justify-between gap-5 border-b border-emerald-950/10 pb-6 lg:flex-row lg:items-start">
            <div>
              <Link
                href="/settings"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-950/10 bg-white/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#476153] transition hover:bg-white"
              >
                <ArrowLeft size={14} strokeWidth={1.8} />
                Configurações
              </Link>

              <div className="mt-6 flex items-start gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] border border-emerald-950/10 bg-[#F2F4F3] text-[#1B3A2E]">
                  <SettingsIcon name={option.icon} size={23} />
                </span>

                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
                    {option.group}
                  </p>

                  <h1 className="mt-2 font-display text-5xl leading-[0.95] tracking-[-0.07em] text-[#1B3A2E] sm:text-6xl">
                    {option.title}
                  </h1>

                  <p className="mt-4 max-w-2xl text-base leading-7 text-[#476153]">
                    {option.description}
                  </p>
                </div>
              </div>
            </div>

            <span className="inline-flex w-fit rounded-full border border-emerald-950/10 bg-white/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#476153]">
              {option.status}
            </span>
          </div>

          <form action={updateSettingsSectionAction} className="mt-6">
            <input type="hidden" name="sectionKey" value={option.key} />

            {fields.length ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {fields.map((field) => (
                  <SettingsFieldRenderer
                    key={field.name}
                    field={field}
                    value={(sourceData as Record<string, unknown>)?.[field.name]}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-[26px] border border-white/70 bg-white/35 p-5 text-sm leading-7 text-[#476153]">
                Esta seção ainda não possui campos editáveis. Ela foi criada para manter a navegação e a arquitetura pronta para a próxima etapa.
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {canEdit ? (
                <button
                  type="submit"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[18px] bg-[#1B3A2E] px-5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(27,58,46,0.18)] transition hover:-translate-y-0.5 hover:bg-[#0F1512]"
                >
                  <Save size={16} strokeWidth={1.8} />
                  Salvar ajustes
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex min-h-12 items-center justify-center rounded-[18px] border border-emerald-950/10 bg-white/45 px-5 text-sm font-semibold text-[#747D79]"
                >
                  Área somente leitura
                </button>
              )}

              {option.key !== 'account' ? (
                <Link
                  href="/settings/account"
                  className="inline-flex min-h-12 items-center justify-center rounded-[18px] border border-emerald-950/10 bg-white/55 px-5 text-sm font-semibold text-[#1B3A2E] transition hover:bg-white"
                >
                  Ir para conta
                </Link>
              ) : null}
            </div>
          </form>
        </section>

        <aside className="space-y-4 xl:sticky xl:top-5 xl:self-start">
          <div className="rounded-[30px] border border-white/75 bg-[#1B3A2E] p-5 text-white shadow-[0_24px_70px_rgba(27,58,46,0.16)]">
            <div className="flex items-start gap-3">
              <ShieldCheck size={19} strokeWidth={1.8} className="mt-0.5 text-white/75" />
              <div>
                <h2 className="font-display text-3xl leading-none tracking-[-0.045em]">
                  Ajuste seguro
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/72">
                  Cada área tem sua própria rota e salva somente campos permitidos.
                  Se alguma coluna ainda não existir no banco, o setup tenta salvar os campos compatíveis sem quebrar a tela.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/75 bg-white/45 p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2">
              <Database size={17} strokeWidth={1.8} className="text-[#1B3A2E]" />
              <h2 className="text-sm font-semibold text-[#1B3A2E]">
                Dados relacionados
              </h2>
            </div>

            <div className="space-y-3">
              {option.columns?.map((column) => (
                <div
                  key={column}
                  className="rounded-[18px] border border-white/70 bg-white/45 p-3"
                >
                  <p className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[#747D79]">
                    {option.source || 'profiles'} · {column}
                  </p>

                  <pre className="mt-2 max-h-36 overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-[#1B3A2E]">
                    {formatValue((sourceData as Record<string, unknown>)?.[column])}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
TSX

# ------------------------------------------------------------
# 7. Hub SPA de Settings
# ------------------------------------------------------------
cat > "src/components/settings/SettingsHubPage.tsx" <<'TSX'
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, CheckCircle2, ChevronRight, Circle, Settings } from 'lucide-react';
import {
  getAllSettingsGroups,
  getQuickSettings,
  getSettingByKey,
  onboardingSettingKeys,
} from '@/lib/settings/settingsCatalog';
import { createServer } from '@/lib/supabase/server';
import { SettingsIcon } from './SettingsIcon';

function hasValue(value: unknown) {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === 'object') return Object.keys(value).length > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  return Boolean(value);
}

async function getProfileSnapshot() {
  const supabase = createServer();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) redirect('/auth/login');

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  return data || {};
}

export async function SettingsHubPage() {
  const profile = await getProfileSnapshot();
  const profileRecord = profile as Record<string, unknown>;
  const quickSettings = getQuickSettings();
  const groupedSettings = getAllSettingsGroups();

  const completedSteps = onboardingSettingKeys.filter((key) => {
    const option = getSettingByKey(key);
    return option.columns?.some((column) => hasValue(profileRecord[column]));
  });

  const completion = Math.round((completedSteps.length / onboardingSettingKeys.length) * 100);

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-4 py-5 text-[#1B3A2E] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-5">
        <section className="relative overflow-hidden rounded-[34px] border border-white/80 bg-white/45 shadow-[0_28px_90px_rgba(27,58,46,0.10)] backdrop-blur-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(154,124,167,0.18),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(0,109,78,0.16),transparent_30%)]" />

          <div className="relative grid min-h-[320px] gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
            <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/55 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#476153]">
                  <Settings size={14} strokeWidth={1.8} />
                  Central de configuração
                </div>

                <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[0.95] tracking-[-0.07em] text-[#1B3A2E] sm:text-6xl lg:text-7xl">
                  Ajuste cada parte da IRIS no seu próprio lugar.
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-[#476153] sm:text-lg">
                  A página principal funciona como hub SPA. Conta, privacidade,
                  segurança, acessibilidade, idioma, onboarding e dados ficam em rotas separadas.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/settings/account"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[18px] bg-[#1B3A2E] px-5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(27,58,46,0.18)] transition hover:-translate-y-0.5 hover:bg-[#0F1512]"
                >
                  Abrir conta
                  <ArrowRight size={16} strokeWidth={1.8} />
                </Link>

                <Link
                  href="/settings/privacy"
                  className="inline-flex min-h-12 items-center justify-center rounded-[18px] border border-emerald-900/10 bg-white/55 px-5 text-sm font-semibold text-[#1B3A2E] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  Privacidade
                </Link>
              </div>
            </div>

            <div className="relative min-h-[240px] overflow-hidden rounded-b-[34px] border-t border-white/80 bg-[#F2F4F3] sm:min-h-[320px] lg:m-4 lg:rounded-[28px] lg:border">
              <img
                src="/iris/brand/cards/settings.png"
                alt="Card visual de configurações da IRIS"
                className="h-full min-h-[240px] w-full object-cover object-center sm:min-h-[320px]"
              />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickSettings.map((option) => (
            <Link
              key={option.key}
              href={option.href}
              className="group min-h-[158px] rounded-[26px] border border-white/75 bg-white/45 p-5 shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/70 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-[16px] border border-emerald-950/10 bg-white/60 text-[#1B3A2E]">
                <SettingsIcon name={option.icon} size={19} />
              </div>

              <div className="mt-5 flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl leading-none tracking-[-0.045em] text-[#1B3A2E]">
                    {option.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[#476153]">
                    {option.subtitle}
                  </p>
                </div>

                <ChevronRight
                  className="mt-1 shrink-0 text-[#9AA4A1] transition-transform group-hover:translate-x-1 group-hover:text-[#1B3A2E]"
                  size={18}
                  strokeWidth={1.8}
                />
              </div>
            </Link>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="rounded-[30px] border border-white/75 bg-[#1B3A2E] p-6 text-white shadow-[0_24px_80px_rgba(27,58,46,0.18)]">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/60">
              Onboarding
            </p>

            <h2 className="mt-3 font-display text-4xl leading-[0.95] tracking-[-0.055em]">
              {completion}% da base preenchida.
            </h2>

            <p className="mt-4 text-sm leading-6 text-white/72">
              Cada etapa do onboarding também tem uma área de ajuste dentro de Settings.
            </p>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/14">
              <div className="h-full rounded-full bg-white" style={{ width: `${completion}%` }} />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {onboardingSettingKeys.map((key, index) => {
              const option = getSettingByKey(key);
              const done = option.columns?.some((column) => hasValue(profileRecord[column]));

              return (
                <Link
                  key={option.key}
                  href={option.href}
                  className="rounded-[24px] border border-white/75 bg-white/45 p-4 backdrop-blur-md transition hover:bg-white/70"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-900/10 bg-white/60 text-sm font-semibold text-[#1B3A2E]">
                      {done ? (
                        <CheckCircle2 className="text-[#006D4E]" size={17} strokeWidth={1.9} />
                      ) : (
                        String(index + 1).padStart(2, '0')
                      )}
                    </span>

                    <div>
                      <h3 className="text-sm font-semibold text-[#1B3A2E]">
                        {option.title}
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-[#747D79]">
                        {option.subtitle}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
              Todas as opções
            </p>
            <h2 className="mt-2 font-display text-4xl leading-none tracking-[-0.055em] text-[#1B3A2E]">
              Configurações completas.
            </h2>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {groupedSettings.map((section) => (
              <article
                key={section.group}
                className="rounded-[30px] border border-white/75 bg-white/42 p-5 shadow-sm backdrop-blur-md sm:p-6"
              >
                <div className="border-b border-emerald-900/10 pb-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-950/10 bg-white/50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#747D79]">
                    <Circle size={7} fill="currentColor" strokeWidth={0} />
                    {section.group}
                  </div>
                </div>

                <div className="mt-4 divide-y divide-emerald-900/10">
                  {section.options.map((option) => (
                    <Link
                      key={option.key}
                      href={option.href}
                      className="group flex items-center gap-4 py-4"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] border border-white/80 bg-white/55 text-[#1B3A2E] shadow-sm">
                        <SettingsIcon name={option.icon} size={18} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-[#1B3A2E]">
                            {option.title}
                          </span>

                          <span className="rounded-full border border-emerald-900/10 bg-[#F2F4F3] px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#747D79]">
                            {option.status}
                          </span>
                        </span>

                        <span className="mt-1 block text-sm leading-6 text-[#747D79]">
                          {option.description}
                        </span>
                      </span>

                      <ChevronRight
                        className="shrink-0 text-[#9AA4A1] transition-transform group-hover:translate-x-1 group-hover:text-[#1B3A2E]"
                        size={18}
                        strokeWidth={1.8}
                      />
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
TSX

cat > "src/app/(app)/settings/page.tsx" <<'TSX'
import { SettingsHubPage } from '@/components/settings/SettingsHubPage';

export default function SettingsPage() {
  return <SettingsHubPage />;
}
TSX

# ------------------------------------------------------------
# 8. Criar cada rota/pasta de settings separada
# ------------------------------------------------------------
create_settings_page() {
  local route="$1"
  local key="$2"
  mkdir -p "src/app/(app)/settings/${route}"

  cat > "src/app/(app)/settings/${route}/page.tsx" <<TSX
import { SettingsSectionPage } from '@/components/settings/SettingsSectionPage';

export default function SettingsRoutePage() {
  return <SettingsSectionPage sectionKey="${key}" />;
}
TSX
}

create_settings_page "account" "account"
create_settings_page "profile" "profile"
create_settings_page "media" "media"
create_settings_page "privacy" "privacy"
create_settings_page "security" "security"
create_settings_page "appearance" "appearance"
create_settings_page "accessibility" "accessibility"
create_settings_page "language" "language"
create_settings_page "personality" "personality"
create_settings_page "culture" "culture"
create_settings_page "intention" "intention"
create_settings_page "flora" "flora"
create_settings_page "integrations" "integrations"
create_settings_page "subscription" "subscription"
create_settings_page "plan" "plan"
create_settings_page "uslife" "uslife"
create_settings_page "kids" "kids"
create_settings_page "sensitive-content" "sensitive-content"
create_settings_page "devices" "devices"
create_settings_page "notifications" "notifications"
create_settings_page "data-export" "data-export"
create_settings_page "completion" "completion"
create_settings_page "diagnostics" "diagnostics"
create_settings_page "delete-account" "delete-account"

# ------------------------------------------------------------
# 9. Corrigir rotas auth/protected
# ------------------------------------------------------------
cat > "src/lib/auth/routes.ts" <<'TS'
export const IRIS_ROUTES = {
  home: '/',
  app: '/iris',

  authLogin: '/auth/login',
  authRegister: '/auth/register',
  authCallback: '/auth/callback',

  onboardingWelcome: '/onboarding/welcome',
  onboardingBasicInfo: '/onboarding/basic-info',
  onboardingUsername: '/onboarding/username',
  onboardingFinish: '/onboarding/finish',
  onboardingAvatar: '/onboarding/avatar',
} as const;

export type IrisProfileRouteState = {
  first_name?: string | null;
  full_name?: string | null;
  birth_date?: string | null;
  username?: string | null;
  onboarding_status?: string | null;
  onboarding_completed?: boolean | null;
};

const protectedPrefixes = [
  '/iris',
  '/onboarding',
  '/settings',
  '/ilife',
  '/uslife',
  '/ai',
  '/notifications',
  '/search',
  '/profile',
  '/feed',
  '/communities',
  '/messages',
  '/videos',
  '/marketplace',
  '/creator',
  '/billing',
  '/safety',
  '/me',
  '/app',
];

export function isAuthRoute(pathname: string) {
  return (
    pathname === IRIS_ROUTES.authLogin ||
    pathname === IRIS_ROUTES.authRegister ||
    pathname.startsWith('/auth/')
  );
}

export function isProtectedRoute(pathname: string) {
  return protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function isEssentialOnboardingRoute(pathname: string) {
  return (
    pathname === IRIS_ROUTES.onboardingWelcome ||
    pathname === IRIS_ROUTES.onboardingBasicInfo ||
    pathname === IRIS_ROUTES.onboardingUsername
  );
}

export function getPostAuthDestinationFromProfile(profile?: IrisProfileRouteState | null) {
  if (!profile) return IRIS_ROUTES.onboardingBasicInfo;

  const completed =
    profile.onboarding_completed === true ||
    String(profile.onboarding_status || '').toLowerCase() === 'completed';

  if (completed) return IRIS_ROUTES.app;

  const hasBasicInfo = Boolean((profile.first_name || profile.full_name) && profile.birth_date);
  const hasUsername = Boolean(profile.username);

  if (!hasBasicInfo) return IRIS_ROUTES.onboardingBasicInfo;
  if (!hasUsername) return IRIS_ROUTES.onboardingUsername;

  return IRIS_ROUTES.app;
}

export function isSafeInternalPath(value: string | null | undefined) {
  if (!value) return false;
  if (!value.startsWith('/')) return false;
  if (value.startsWith('//')) return false;
  if (value.startsWith('/auth')) return false;
  return true;
}
TS

cat > "src/lib/auth/resolvePostAuthDestination.ts" <<'TS'
import { getPostAuthDestinationFromProfile, IRIS_ROUTES } from './routes';

type SupabaseLike = {
  from: (table: string) => any;
};

export async function resolvePostAuthDestination(
  supabase: SupabaseLike,
  userId: string
) {
  if (!userId) return IRIS_ROUTES.authLogin;

  const { data, error } = await supabase
    .from('profiles')
    .select('first_name,full_name,birth_date,username,onboarding_status,onboarding_completed')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.warn('[IRIS_AUTH_ROUTE_PROFILE_LOOKUP]', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });

    return IRIS_ROUTES.onboardingBasicInfo;
  }

  return getPostAuthDestinationFromProfile(data);
}
TS

cat > "src/lib/actions/auth.actions.ts" <<'TS'
'use server';

import { redirect } from 'next/navigation';
import { resolvePostAuthDestination } from '@/lib/auth/resolvePostAuthDestination';
import { IRIS_ROUTES, isSafeInternalPath } from '@/lib/auth/routes';
import { createServer } from '@/lib/supabase/server';
import {
  AUTH_LOGIN_ERRORS,
  AUTH_REGISTER_ERRORS,
  logAuthError,
  resolveLoginAuthError,
  resolveRegisterAuthError,
  toAuthActionError,
} from '@/lib/erros/auth';

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

export async function loginAction(formData: FormData) {
  const email = getRequiredString(formData, 'email');
  const password = getRequiredString(formData, 'password');
  const next = getRequiredString(formData, 'next');

  if (!email || !password) {
    const irisError = AUTH_LOGIN_ERRORS.EMPTY_CREDENTIALS;
    logAuthError(irisError, { hasEmail: Boolean(email), hasPassword: Boolean(password) });
    return toAuthActionError(irisError);
  }

  const supabase = createServer();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const irisError = resolveLoginAuthError(error);
    logAuthError(irisError, {
      providerMessage: error.message,
      providerStatus: error.status,
      providerCode: error.code,
      email,
    });

    return toAuthActionError(irisError);
  }

  const destination = await resolvePostAuthDestination(supabase, data.user.id);

  if (destination === IRIS_ROUTES.app && isSafeInternalPath(next)) {
    redirect(next);
  }

  redirect(destination);
}

export async function registerAction(formData: FormData) {
  const email = getRequiredString(formData, 'email');
  const password = getRequiredString(formData, 'password');

  if (!email || !password) {
    const irisError = AUTH_REGISTER_ERRORS.EMPTY_CREDENTIALS;
    logAuthError(irisError, { hasEmail: Boolean(email), hasPassword: Boolean(password) });
    return toAuthActionError(irisError);
  }

  if (password.length < 8) {
    const irisError = AUTH_REGISTER_ERRORS.WEAK_PASSWORD;
    logAuthError(irisError, { email, passwordLength: password.length });
    return toAuthActionError(irisError);
  }

  const supabase = createServer();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    const irisError = resolveRegisterAuthError(error);
    logAuthError(irisError, {
      providerMessage: error.message,
      providerStatus: error.status,
      providerCode: error.code,
      email,
    });

    return toAuthActionError(irisError);
  }

  redirect(IRIS_ROUTES.onboardingWelcome);
}
TS

cat > "middleware.ts" <<'TS'
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import {
  getPostAuthDestinationFromProfile,
  IRIS_ROUTES,
  isAuthRoute,
  isEssentialOnboardingRoute,
  isProtectedRoute,
} from '@/lib/auth/routes';

async function getDestinationForUser(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('first_name,full_name,birth_date,username,onboarding_status,onboarding_completed')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.warn('[IRIS_MIDDLEWARE_PROFILE_LOOKUP]', {
      code: error.code,
      message: error.message,
    });

    return IRIS_ROUTES.onboardingBasicInfo;
  }

  return getPostAuthDestinationFromProfile(data);
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isRoot = pathname === IRIS_ROUTES.home;
  const authenticated = Boolean(user);

  if (!authenticated && isProtectedRoute(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = IRIS_ROUTES.authLogin;
    loginUrl.searchParams.set('next', pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (authenticated && user && (isAuthRoute(pathname) || isRoot)) {
    const destination = await getDestinationForUser(supabase, user.id);

    if (destination !== pathname) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = destination;
      redirectUrl.search = '';

      return NextResponse.redirect(redirectUrl);
    }
  }

  if (
    authenticated &&
    user &&
    isEssentialOnboardingRoute(pathname) &&
    !request.nextUrl.searchParams.has('edit')
  ) {
    const destination = await getDestinationForUser(supabase, user.id);

    if (destination === IRIS_ROUTES.app) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = IRIS_ROUTES.app;
      redirectUrl.search = '';

      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)).*)',
  ],
};
TS

# ------------------------------------------------------------
# 10. Corrigir completeOnboardingAction para voltar para /iris
# ------------------------------------------------------------
python3 - <<'PY'
from pathlib import Path

path = Path("src/lib/actions/onboarding.actions.ts")
if path.exists():
    text = path.read_text(encoding="utf-8")
    text = text.replace("return { success: true, redirect: '/app/home' };", "return { success: true, redirect: '/iris' };")
    path.write_text(text, encoding="utf-8")
PY

# ------------------------------------------------------------
# 11. /iris limpo, full page, sem perfil
# ------------------------------------------------------------
cat > "src/app/iris/page.tsx" <<'TSX'
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Heart,
  Lock,
  Palette,
  Search,
  Settings,
  Sparkles,
} from 'lucide-react';

const LOGO_PATH = '/iris/brand/logotipo/svg/iris-logotipo-colorido.svg';

const modules = [
  {
    title: 'iLIFE',
    description: 'Memórias, diários, álbuns, cartas, sonhos e biblioteca pessoal.',
    href: '/ilife',
    icon: BookOpen,
  },
  {
    title: 'usLIFE',
    description: 'Espaços compartilhados para vínculos, cartas e registros afetivos.',
    href: '/uslife',
    icon: Heart,
  },
  {
    title: 'IRIS AI',
    description: 'Organização, reflexão, agentes e recomendações com privacidade.',
    href: '/ai',
    icon: Sparkles,
  },
  {
    title: 'Configurações',
    description: 'Conta, privacidade, segurança, aparência e acessibilidade.',
    href: '/settings',
    icon: Settings,
  },
];

const principles = [
  'Memória antes de métrica',
  'Privacidade por padrão',
  'Interface silenciosa',
  'Controle consciente',
];

export default function IrisPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#FAF7F2] text-[#1B3A2E]">
      <section className="relative flex min-h-screen flex-col px-5 py-6 sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(154,124,167,0.18),transparent_26%),radial-gradient(circle_at_88%_18%,rgba(0,109,78,0.14),transparent_28%),linear-gradient(180deg,#FAF7F2_0%,#FFFFFF_100%)]" />

        <header className="relative z-10 flex items-center justify-between gap-4">
          <Link href="/" aria-label="Voltar para início">
            <img src={LOGO_PATH} alt="IRIS" className="h-auto w-[76px]" />
          </Link>

          <nav className="hidden items-center gap-2 rounded-full border border-white/75 bg-white/45 px-2 py-2 text-sm font-semibold text-[#476153] shadow-sm backdrop-blur-md md:flex">
            <Link className="rounded-full px-4 py-2 transition hover:bg-white/70 hover:text-[#1B3A2E]" href="/ilife">
              iLIFE
            </Link>
            <Link className="rounded-full px-4 py-2 transition hover:bg-white/70 hover:text-[#1B3A2E]" href="/uslife">
              usLIFE
            </Link>
            <Link className="rounded-full px-4 py-2 transition hover:bg-white/70 hover:text-[#1B3A2E]" href="/ai">
              IRIS AI
            </Link>
            <Link className="rounded-full px-4 py-2 transition hover:bg-white/70 hover:text-[#1B3A2E]" href="/settings">
              Configurações
            </Link>
          </nav>

          <Link
            href="/settings"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-emerald-900/10 bg-white/55 px-4 text-sm font-semibold text-[#1B3A2E] shadow-sm backdrop-blur-md transition hover:bg-white"
          >
            Abrir app
          </Link>
        </header>

        <div className="relative z-10 grid flex-1 items-center gap-8 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/55 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#476153] shadow-sm backdrop-blur-md">
              <Sparkles size={14} strokeWidth={1.8} />
              Plataforma IRIS
            </div>

            <h1 className="mt-7 font-display text-[4.2rem] leading-[0.86] tracking-[-0.085em] text-[#1B3A2E] sm:text-[6.4rem] lg:text-[8.2rem]">
              Um espaço para lembrar com calma.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#476153] sm:text-xl">
              A IRIS organiza memórias, vínculos, cartas, sonhos e identidade em
              uma experiência limpa, privada e emocionalmente silenciosa.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/settings"
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-[20px] bg-[#1B3A2E] px-6 text-sm font-semibold text-white shadow-[0_18px_42px_rgba(27,58,46,0.20)] transition hover:-translate-y-0.5 hover:bg-[#0F1512]"
              >
                Entrar na IRIS
                <ArrowRight size={16} strokeWidth={1.8} />
              </Link>

              <Link
                href="/search"
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-[20px] border border-emerald-900/10 bg-white/55 px-6 text-sm font-semibold text-[#1B3A2E] shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white"
              >
                Explorar
                <Search size={16} strokeWidth={1.8} />
              </Link>
            </div>
          </div>

          <aside className="grid gap-4">
            <div className="rounded-[34px] border border-white/75 bg-white/45 p-5 shadow-[0_28px_90px_rgba(27,58,46,0.10)] backdrop-blur-xl sm:p-6">
              <div className="rounded-[28px] border border-emerald-900/10 bg-[#1B3A2E] p-6 text-white">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/55">
                      Manifesto
                    </p>
                    <h2 className="mt-3 font-display text-4xl leading-none tracking-[-0.055em]">
                      O tempo passa, mas o que sentimos permanece.
                    </h2>
                  </div>

                  <Lock className="shrink-0 text-white/70" size={28} strokeWidth={1.6} />
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {principles.map((item) => (
                    <div
                      key={item}
                      className="rounded-[20px] border border-white/10 bg-white/[0.08] p-4 text-sm font-semibold text-white/84"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {modules.map((module) => {
                const Icon = module.icon;

                return (
                  <Link
                    key={module.title}
                    href={module.href}
                    className="group rounded-[28px] border border-white/75 bg-white/45 p-5 shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/70 hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-[16px] border border-emerald-900/10 bg-white/60 text-[#1B3A2E]">
                      <Icon size={19} strokeWidth={1.8} />
                    </div>

                    <h3 className="mt-5 font-display text-3xl leading-none tracking-[-0.055em] text-[#1B3A2E]">
                      {module.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-[#476153]">
                      {module.description}
                    </p>

                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#006D4E]">
                      Abrir
                      <ArrowRight
                        className="transition-transform group-hover:translate-x-1"
                        size={15}
                        strokeWidth={1.8}
                      />
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="rounded-[28px] border border-white/75 bg-white/42 p-5 shadow-sm backdrop-blur-md">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[15px] bg-[#E9DDEE] text-[#1B3A2E]">
                  <Palette size={18} strokeWidth={1.8} />
                </span>

                <div>
                  <h2 className="font-display text-2xl leading-none tracking-[-0.045em]">
                    Entrada limpa, sem dados pessoais.
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#747D79]">
                    Esta tela não mostra perfil, username, plano, privacidade ou snapshot do onboarding.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
TSX

echo "==> Setup finalizado."
echo ""
echo "Arquivos principais criados/atualizados:"
echo "- src/app/(app)/settings/page.tsx"
echo "- src/app/(app)/settings/*/page.tsx"
echo "- src/components/settings/SettingsHubPage.tsx"
echo "- src/components/settings/SettingsSectionPage.tsx"
echo "- src/lib/settings/settingsCatalog.ts"
echo "- src/lib/settings/settingsFields.ts"
echo "- src/lib/actions/settings.actions.ts"
echo "- src/lib/auth/routes.ts"
echo "- src/lib/auth/resolvePostAuthDestination.ts"
echo "- src/lib/actions/auth.actions.ts"
echo "- middleware.ts"
echo "- src/app/iris/page.tsx"
echo ""
echo "Agora rode:"
echo "npm run build"
