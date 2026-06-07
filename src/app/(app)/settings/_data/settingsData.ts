export type SettingsShortcut = {
  title: string;
  description: string;
  href: string;
  icon: string;
  tone: 'forest' | 'emerald' | 'lilac' | 'sand' | 'mist' | 'rose';
};

export type SettingsOption = {
  title: string;
  description: string;
  href: string;
  icon: string;
  status?: 'Disponível' | 'Em revisão' | 'Em breve';
};

export type SettingsGroup = {
  title: string;
  eyebrow: string;
  description: string;
  options: SettingsOption[];
};

export type OnboardingStep = {
  title: string;
  description: string;
  href: string;
  requiredKeys: string[];
};

export const settingsShortcuts: SettingsShortcut[] = [
  {
    title: 'Conta',
    description: 'Nome, e-mail, telefone e dados básicos.',
    href: '/settings/account',
    icon: 'user',
    tone: 'forest',
  },
  {
    title: 'Perfil',
    description: 'Identity Space, nome público e presença.',
    href: '/profile/edit',
    icon: 'users',
    tone: 'emerald',
  },
  {
    title: 'Privacidade',
    description: 'Visibilidade, convites, descoberta e dados.',
    href: '/settings/privacy',
    icon: 'lock',
    tone: 'lilac',
  },
  {
    title: 'Segurança',
    description: 'Senha, 2FA, sessões e dispositivos.',
    href: '/settings/security',
    icon: 'shield',
    tone: 'forest',
  },
  {
    title: 'Notificações',
    description: 'Alertas, e-mails e lembretes da IRIS.',
    href: '/notifications',
    icon: 'bell',
    tone: 'mist',
  },
  {
    title: 'Aparência',
    description: 'Tema, destaque visual e densidade.',
    href: '/settings/appearance',
    icon: 'palette',
    tone: 'sand',
  },
  {
    title: 'Acessibilidade',
    description: 'Fonte, movimento, contraste e leitura.',
    href: '/settings/accessibility',
    icon: 'settings',
    tone: 'lilac',
  },
  {
    title: 'Idioma',
    description: 'Localização, região e preferências.',
    href: '/settings/language',
    icon: 'globe',
    tone: 'emerald',
  },
  {
    title: 'Integrações',
    description: 'Spotify, fotos, biblioteca e importações.',
    href: '/settings/integrations',
    icon: 'cloud',
    tone: 'mist',
  },
  {
    title: 'Assinatura',
    description: 'Plano atual, billing e recursos.',
    href: '/settings/subscription',
    icon: 'credit',
    tone: 'forest',
  },
  {
    title: 'Dados',
    description: 'Exportar, baixar e revisar histórico.',
    href: '/settings/data-export',
    icon: 'download',
    tone: 'sand',
  },
  {
    title: 'Sensível',
    description: 'Conteúdos adultos e filtros de proteção.',
    href: '/settings/sensitive-content',
    icon: 'eye',
    tone: 'rose',
  },
  {
    title: 'IRIS Kids',
    description: 'Responsáveis, restrições e proteção.',
    href: '/settings/kids',
    icon: 'heart',
    tone: 'lilac',
  },
  {
    title: 'Dispositivos',
    description: 'Acessos ativos e aparelhos confiáveis.',
    href: '/settings/devices',
    icon: 'laptop',
    tone: 'mist',
  },
  {
    title: 'IRIS AI',
    description: 'Memória, contexto e permissões da IA.',
    href: '/ai',
    icon: 'sparkles',
    tone: 'emerald',
  },
  {
    title: 'Encerrar',
    description: 'Desativar, pausar ou excluir conta.',
    href: '/settings/delete-account',
    icon: 'trash',
    tone: 'rose',
  },
];

export const onboardingSteps: OnboardingStep[] = [
  {
    title: 'Dados essenciais',
    description: 'Nome, CPF e data de nascimento.',
    href: '/onboarding/basic-info?edit=1',
    requiredKeys: ['firstName', 'birthDate'],
  },
  {
    title: 'Identidade visual',
    description: 'Avatar, capa e cor simbólica.',
    href: '/onboarding/avatar',
    requiredKeys: ['avatarUrl', 'colorSymbol'],
  },
  {
    title: 'Nome público',
    description: 'Username e nome social.',
    href: '/onboarding/username',
    requiredKeys: ['username'],
  },
  {
    title: 'Personalidade',
    description: 'Traços, preferências e leitura pessoal.',
    href: '/onboarding/personality',
    requiredKeys: ['personalityData'],
  },
  {
    title: 'Cultura',
    description: 'Livros, filmes, músicas e temas.',
    href: '/onboarding/culture',
    requiredKeys: ['cultureTags', 'cultureData'],
  },
  {
    title: 'Integrações',
    description: 'Bibliotecas externas e importações.',
    href: '/onboarding/integrations',
    requiredKeys: ['integrationPreferences'],
  },
  {
    title: 'Intenção',
    description: 'Como você quer usar a IRIS.',
    href: '/onboarding/intention',
    requiredKeys: ['intention'],
  },
  {
    title: 'Privacidade',
    description: 'Nível de exposição e descoberta.',
    href: '/onboarding/privacy',
    requiredKeys: ['privacyLevel'],
  },
  {
    title: 'Acessibilidade',
    description: 'Conforto visual e cognitivo.',
    href: '/onboarding/accessibility',
    requiredKeys: ['accessibilityData'],
  },
  {
    title: 'usLIFE',
    description: 'Convites e vínculos significativos.',
    href: '/onboarding/uslife-invite',
    requiredKeys: ['usLifeInviteData'],
  },
  {
    title: 'Plano',
    description: 'Free, Premium ou Duo.',
    href: '/onboarding/plan',
    requiredKeys: ['plan'],
  },
];

export const settingsGroups: SettingsGroup[] = [
  {
    title: 'Conta e identidade',
    eyebrow: 'Base da Account',
    description: 'Dados que identificam a conta, o perfil público e a experiência inicial.',
    options: [
      {
        title: 'Minha conta',
        description: 'Nome, e-mail, telefone, nascimento, país e senha.',
        href: '/settings/account',
        icon: 'user',
        status: 'Disponível',
      },
      {
        title: 'Perfil e Identity Space',
        description: 'Editar nome público, bio, avatar, capa e blocos visíveis.',
        href: '/profile/edit',
        icon: 'users',
        status: 'Disponível',
      },
      {
        title: 'Idioma e região',
        description: 'Idioma principal, país, fuso e formato de data.',
        href: '/settings/language',
        icon: 'globe',
        status: 'Disponível',
      },
    ],
  },
  {
    title: 'Privacidade e segurança',
    eyebrow: 'Zero Trust',
    description: 'Controles de exposição, proteção, sessões e dados sensíveis.',
    options: [
      {
        title: 'Privacidade',
        description: 'Quem pode encontrar, convidar, ver blocos e enviar mensagens.',
        href: '/settings/privacy',
        icon: 'lock',
        status: 'Disponível',
      },
      {
        title: 'Segurança',
        description: 'Alterar senha, 2FA, sessões, alertas e chaves criptográficas.',
        href: '/settings/security',
        icon: 'shield',
        status: 'Disponível',
      },
      {
        title: 'Dispositivos',
        description: 'Aparelhos conectados, sessões ativas e histórico de acesso.',
        href: '/settings/devices',
        icon: 'laptop',
        status: 'Disponível',
      },
      {
        title: 'Conteúdo sensível',
        description: 'Filtros, bloqueios, idade e preferências explícitas.',
        href: '/settings/sensitive-content',
        icon: 'eye',
        status: 'Em revisão',
      },
      {
        title: 'Encerrar conta',
        description: 'Pausar, desativar, solicitar exclusão ou baixar dados antes.',
        href: '/settings/delete-account',
        icon: 'trash',
        status: 'Disponível',
      },
    ],
  },
  {
    title: 'Experiência',
    eyebrow: 'Design System IRIS',
    description: 'Ajustes visuais, acessibilidade, notificações e conforto de uso.',
    options: [
      {
        title: 'Aparência',
        description: 'Tema claro, escuro, sistema, cor de destaque e densidade.',
        href: '/settings/appearance',
        icon: 'palette',
        status: 'Disponível',
      },
      {
        title: 'Acessibilidade',
        description: 'Tamanho de fonte, dislexia, movimento reduzido e contraste.',
        href: '/settings/accessibility',
        icon: 'settings',
        status: 'Disponível',
      },
      {
        title: 'Notificações',
        description: 'Mensagens, segurança, usLIFE, marketplace e lembretes.',
        href: '/notifications',
        icon: 'bell',
        status: 'Disponível',
      },
    ],
  },
  {
    title: 'Ecossistema e dados',
    eyebrow: 'Módulos conectados',
    description: 'Integrações, plano, exportação e recursos protegidos para crianças.',
    options: [
      {
        title: 'Integrações',
        description: 'Spotify, Apple Music, Google Fotos, iCloud e bibliotecas externas.',
        href: '/settings/integrations',
        icon: 'cloud',
        status: 'Disponível',
      },
      {
        title: 'Assinatura',
        description: 'Plano atual, benefícios, cobrança e histórico.',
        href: '/settings/subscription',
        icon: 'credit',
        status: 'Disponível',
      },
      {
        title: 'Dados e exportação',
        description: 'Baixar dados, revisar consentimentos e preparar portabilidade.',
        href: '/settings/data-export',
        icon: 'download',
        status: 'Disponível',
      },
      {
        title: 'IRIS Kids',
        description: 'Responsáveis, contatos aprovados, restrições e ambiente protegido.',
        href: '/settings/kids',
        icon: 'heart',
        status: 'Em breve',
      },
    ],
  },
];
