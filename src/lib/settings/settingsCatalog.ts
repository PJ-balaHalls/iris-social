export type SettingStatus = 'ready' | 'recommended' | 'planned' | 'sensitive';

export type SettingsSource =
  | 'profiles'
  | 'subscriptions'
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
  source: SettingsSource;
  columns: string[];
};

export const settingsOptions: SettingsOption[] = [
  {
    key: 'account',
    title: 'Conta',
    subtitle: 'Dados centrais da conta',
    description: 'Nome, e-mail, nascimento, país, idioma e informações principais.',
    group: 'Conta',
    icon: 'UserRound',
    status: 'ready',
    href: '/settings/account',
    source: 'profiles',
    columns: ['full_name', 'first_name', 'social_name', 'birth_date', 'country', 'language'],
  },
  {
    key: 'profile',
    title: 'Perfil',
    subtitle: 'Identity Space',
    description: 'Nome público, username, bio, avatar, capa e presença social.',
    group: 'Perfil',
    icon: 'BadgeCheck',
    status: 'ready',
    href: '/settings/profile',
    source: 'profiles',
    columns: ['full_name', 'first_name', 'social_name', 'username'],
  },
  {
    key: 'media',
    title: 'Avatar e capa',
    subtitle: 'Identidade visual',
    description: 'Avatar, capa e cor simbólica usada na experiência.',
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
    subtitle: 'Visibilidade e limites',
    description: 'Controle quem pode ver, encontrar, chamar e convidar você.',
    group: 'Privacidade',
    icon: 'LockKeyhole',
    status: 'recommended',
    href: '/settings/privacy',
    source: 'profiles',
    columns: ['privacy_level', 'privacy_data'],
  },
  {
    key: 'security',
    title: 'Segurança',
    subtitle: 'Senha e sessões',
    description: 'Sessões, dispositivos, alertas, senha e proteção da conta.',
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
    subtitle: 'Tema e interface',
    description: 'Tema claro, escuro, seguir sistema, destaque visual e densidade.',
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
    subtitle: 'Leitura confortável',
    description: 'Fonte, dislexia, contraste, movimento reduzido e navegação.',
    group: 'Experiência',
    icon: 'Accessibility',
    status: 'ready',
    href: '/settings/accessibility',
    source: 'profiles',
    columns: ['accessibility_data', 'theme_preference'],
  },
  {
    key: 'language',
    title: 'Idioma',
    subtitle: 'Região e localização',
    description: 'Idioma principal, país, região e fuso horário.',
    group: 'Experiência',
    icon: 'Languages',
    status: 'ready',
    href: '/settings/language',
    source: 'profiles',
    columns: ['language', 'country', 'timezone'],
  },
  {
    key: 'integrations',
    title: 'Integrações',
    subtitle: 'Serviços conectados',
    description: 'Spotify, fotos, iCloud, Google Fotos, bibliotecas e importações.',
    group: 'Dados',
    icon: 'Plug',
    status: 'planned',
    href: '/settings/integrations',
    source: 'profiles',
    columns: ['integration_preferences', 'integration_data'],
  },
  {
    key: 'subscription',
    title: 'Assinatura',
    subtitle: 'Plano e cobrança',
    description: 'Plano atual, recursos, histórico e preferências de assinatura.',
    group: 'Produto',
    icon: 'CreditCard',
    status: 'ready',
    href: '/settings/subscription',
    source: 'subscriptions',
    columns: ['plan', 'status', 'trial_ends_at', 'current_period_ends_at'],
  },
  {
    key: 'data-export',
    title: 'Dados',
    subtitle: 'Exportação e portabilidade',
    description: 'Exportar dados, revisar consentimentos e baixar informações.',
    group: 'Dados',
    icon: 'Database',
    status: 'planned',
    href: '/settings/data-export',
    source: 'profiles',
    columns: ['id', 'created_at', 'updated_at'],
  },
  {
    key: 'sensitive-content',
    title: 'Conteúdo sensível',
    subtitle: 'Filtros e proteção',
    description: 'Controle de conteúdos adultos, filtros e restrições.',
    group: 'Risco',
    icon: 'EyeOff',
    status: 'sensitive',
    href: '/settings/sensitive-content',
    source: 'profiles',
    columns: ['sensitive_content_enabled', 'sensitive_content_data'],
  },
  {
    key: 'kids',
    title: 'IRIS Kids',
    subtitle: 'Ambiente protegido',
    description: 'Responsáveis, restrições, contatos aprovados e proteção.',
    group: 'Produto',
    icon: 'Baby',
    status: 'planned',
    href: '/settings/kids',
    source: 'profiles',
    columns: ['is_kids_account', 'guardian_data', 'kids_restrictions'],
  },
  {
    key: 'devices',
    title: 'Dispositivos',
    subtitle: 'Acessos ativos',
    description: 'Sessões, aparelhos conectados e dispositivos confiáveis.',
    group: 'Privacidade',
    icon: 'MonitorSmartphone',
    status: 'planned',
    href: '/settings/devices',
    source: 'profiles',
    columns: ['trusted_devices', 'last_login_at'],
  },
  {
    key: 'personality',
    title: 'Personalidade',
    subtitle: 'Preferências do onboarding',
    description: 'Traços, escolhas e sinais usados para personalização.',
    group: 'Onboarding',
    icon: 'Brain',
    status: 'recommended',
    href: '/settings/personality',
    source: 'profiles',
    columns: ['personality_data'],
  },
  {
    key: 'culture',
    title: 'Cultura',
    subtitle: 'Gostos e repertório',
    description: 'Livros, filmes, músicas, temas, hobbies e lugares afetivos.',
    group: 'Onboarding',
    icon: 'Sparkles',
    status: 'recommended',
    href: '/settings/culture',
    source: 'profiles',
    columns: ['culture_tags', 'culture_data'],
  },
  {
    key: 'intention',
    title: 'Intenção',
    subtitle: 'Objetivo de uso',
    description: 'Memórias, diário, conexões, usLIFE, IA e comunidades.',
    group: 'Onboarding',
    icon: 'Compass',
    status: 'recommended',
    href: '/settings/intention',
    source: 'profiles',
    columns: ['intention', 'intention_data'],
  },
  {
    key: 'plan',
    title: 'Plano escolhido',
    subtitle: 'Preferência do onboarding',
    description: 'Preferência de plano, ciclo e interesse sob demanda.',
    group: 'Produto',
    icon: 'Crown',
    status: 'ready',
    href: '/settings/plan',
    source: 'profiles',
    columns: ['plan_key', 'plan_data'],
  },
  {
    key: 'uslife',
    title: 'usLIFE',
    subtitle: 'Convites e vínculo',
    description: 'Preferências de convite, vínculo e espaço compartilhado.',
    group: 'Produto',
    icon: 'HeartHandshake',
    status: 'recommended',
    href: '/settings/uslife',
    source: 'profiles',
    columns: ['uslife_invite_data'],
  },
  {
    key: 'notifications',
    title: 'Notificações',
    subtitle: 'Alertas e lembretes',
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
    subtitle: 'Progresso e recompensas',
    description: 'Status do onboarding, badges, temas e recompensas.',
    group: 'Sistema',
    icon: 'Gift',
    status: 'ready',
    href: '/settings/completion',
    source: 'profiles',
    columns: [
      'onboarding_status',
      'onboarding_completed',
      'profile_completion_status',
      'profile_badges',
      'unlocked_themes',
    ],
  },
  {
    key: 'delete-account',
    title: 'Encerrar conta',
    subtitle: 'Pausa ou exclusão',
    description: 'Desativar, pausar ou solicitar exclusão definitiva da conta.',
    group: 'Risco',
    icon: 'Trash2',
    status: 'sensitive',
    href: '/settings/delete-account',
    source: 'profiles',
    columns: ['id', 'created_at'],
  },
];

export const settingsGroups = Array.from(
  new Set(settingsOptions.map((option) => option.group)),
);

export const quickSettings = settingsOptions.slice(0, 16);

export const onboardingSettings = settingsOptions.filter((option) =>
  [
    'profile',
    'media',
    'personality',
    'culture',
    'intention',
    'privacy',
    'accessibility',
    'integrations',
    'plan',
    'uslife',
  ].includes(option.key),
);

export function getSettingByKey(key: string) {
  return settingsOptions.find((option) => option.key === key) ?? settingsOptions[0];
}

export function getSettingsByGroup(group: string) {
  return settingsOptions.filter((option) => option.group === group);
}

export function getAllSettingsGroups() {
  return settingsGroups.map((group) => ({
    group,
    options: getSettingsByGroup(group),
  }));
}