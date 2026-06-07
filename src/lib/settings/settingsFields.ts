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

const themeOptions: SettingsFieldOption[] = [
  { label: 'Seguir sistema', value: 'system' },
  { label: 'Claro', value: 'light' },
  { label: 'Escuro', value: 'dark' },
];

const privacyOptions: SettingsFieldOption[] = [
  { label: 'Privado', value: 'private' },
  { label: 'Visível por afinidade', value: 'affinity' },
  { label: 'Público', value: 'public' },
];

const languageOptions: SettingsFieldOption[] = [
  { label: 'Português do Brasil', value: 'pt-BR' },
  { label: 'English', value: 'en' },
  { label: 'Español', value: 'es' },
];

const planOptions: SettingsFieldOption[] = [
  { label: 'Free', value: 'free' },
  { label: 'Premium', value: 'premium' },
  { label: 'Duo', value: 'duo' },
];

export const settingsSectionFields: Record<string, SettingsField[]> = {
  account: [
    { name: 'full_name', label: 'Nome completo', type: 'text' },
    { name: 'first_name', label: 'Primeiro nome', type: 'text' },
    { name: 'social_name', label: 'Nome social', type: 'text' },
    { name: 'birth_date', label: 'Data de nascimento', type: 'date' },
    { name: 'country', label: 'País', type: 'text', placeholder: 'Brasil' },
    { name: 'language', label: 'Idioma', type: 'select', options: languageOptions },
  ],

  profile: [
    { name: 'full_name', label: 'Nome exibido', type: 'text' },
    { name: 'first_name', label: 'Primeiro nome', type: 'text' },
    { name: 'social_name', label: 'Nome social', type: 'text' },
    {
      name: 'username',
      label: '@username',
      type: 'text',
      helper: 'Identificador público único da conta.',
    },
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
    {
      name: 'accessibility_data',
      label: 'Configurações de acessibilidade',
      type: 'json',
      rows: 12,
      helper: 'Ex.: fontSize, reducedMotion, dyslexiaMode, highContrast.',
    },
  ],

  language: [
    { name: 'language', label: 'Idioma', type: 'select', options: languageOptions },
    { name: 'country', label: 'País', type: 'text' },
    { name: 'timezone', label: 'Fuso horário', type: 'text', placeholder: 'America/Sao_Paulo' },
  ],

  integrations: [
    { name: 'integration_preferences', label: 'Preferências de integração', type: 'json', rows: 12 },
    { name: 'integration_data', label: 'Dados de integração', type: 'json', rows: 12 },
  ],

  subscription: [
    { name: 'plan', label: 'Plano ativo', type: 'readonly' },
    { name: 'status', label: 'Status', type: 'readonly' },
    { name: 'trial_ends_at', label: 'Fim do trial', type: 'readonly' },
    { name: 'current_period_ends_at', label: 'Fim do ciclo atual', type: 'readonly' },
  ],

  personality: [
    { name: 'personality_data', label: 'Dados de personalidade', type: 'json', rows: 14 },
  ],

  culture: [
    {
      name: 'culture_tags',
      label: 'Tags culturais',
      type: 'array',
      helper: 'Uma tag por linha.',
    },
    { name: 'culture_data', label: 'Dados culturais avançados', type: 'json', rows: 12 },
  ],

  intention: [
    {
      name: 'intention',
      label: 'Intenção principal',
      type: 'select',
      options: [
        { label: 'Preservar memórias', value: 'memories' },
        { label: 'Escrever diários', value: 'journals' },
        { label: 'Conhecer pessoas profundas', value: 'connections' },
        { label: 'Criar um espaço usLIFE', value: 'uslife' },
        { label: 'Explorar IA e personagens', value: 'ai' },
      ],
    },
    { name: 'intention_data', label: 'Detalhes da intenção', type: 'json', rows: 10 },
  ],

  plan: [
    { name: 'plan_key', label: 'Plano preferido', type: 'select', options: planOptions },
    { name: 'plan_data', label: 'Preferências do plano', type: 'json', rows: 10 },
  ],

  uslife: [
    { name: 'uslife_invite_data', label: 'Preferências usLIFE', type: 'json', rows: 12 },
  ],

  notifications: [
    { name: 'notification_preferences', label: 'Preferências de notificação', type: 'json', rows: 12 },
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

  'data-export': [
    { name: 'id', label: 'ID da conta', type: 'readonly' },
    { name: 'created_at', label: 'Criada em', type: 'readonly' },
    { name: 'updated_at', label: 'Atualizada em', type: 'readonly' },
  ],

  completion: [
    { name: 'onboarding_status', label: 'Status do onboarding', type: 'readonly' },
    { name: 'onboarding_completed', label: 'Onboarding concluído', type: 'readonly' },
    { name: 'profile_completion_status', label: 'Status do perfil', type: 'readonly' },
    { name: 'profile_badges', label: 'Badges', type: 'readonly' },
    { name: 'unlocked_themes', label: 'Temas desbloqueados', type: 'readonly' },
  ],

  'delete-account': [
    { name: 'id', label: 'ID da conta', type: 'readonly' },
    { name: 'created_at', label: 'Criada em', type: 'readonly' },
  ],
};

export function getFieldsForSetting(key: string, columns: string[] = []) {
  const explicit = settingsSectionFields[key];

  if (explicit?.length) {
    return explicit;
  }

  return columns.map((column) => ({
    name: column,
    label: column.replaceAll('_', ' '),
    type: 'readonly' as const,
  }));
}