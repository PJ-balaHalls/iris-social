export type IntegrationKind = 'internal' | 'external' | 'developer';

export type IntegrationCategory =
  | 'all'
  | 'internal'
  | 'external'
  | 'developer'
  | 'music'
  | 'social'
  | 'media'
  | 'productivity'
  | 'memories'
  | 'automation';

export type IntegrationStatus = 'ready' | 'planned' | 'beta' | 'internal';

export type IntegrationPlugin = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  longDescription: string;
  kind: IntegrationKind;
  category: Exclude<IntegrationCategory, 'all'>;
  status: IntegrationStatus;
  accent: string;
  icon: string;
  scopes: string[];
  useCases: string[];
  notes: string;
};

export type IntegrationPreferences = {
  enabled: string[];
  pinned: string[];
  lastViewed?: string;
  autoMusic?: boolean;
  storyMode?: boolean;
  apiAccessRequested?: boolean;
  updated_at?: string;
};

export type IntegrationData = {
  plugins: Record<
    string,
    {
      status: 'prepared' | 'disabled';
      scopes: string[];
      updated_at: string;
    }
  >;
  updated_at?: string;
};

export const integrationCategories: Array<{
  key: IntegrationCategory;
  label: string;
  description: string;
}> = [
  {
    key: 'all',
    label: 'Todos',
    description: 'Tudo que pode se conectar à IRIS.',
  },
  {
    key: 'internal',
    label: 'IRIS',
    description: 'Integrações internas e sinais do onboarding.',
  },
  {
    key: 'external',
    label: 'Externos',
    description: 'Apps e serviços para conectar depois.',
  },
  {
    key: 'developer',
    label: 'API',
    description: 'Nossa API, webhooks e widgets.',
  },
  {
    key: 'music',
    label: 'Música',
    description: 'Player, trilhas e contexto emocional.',
  },
  {
    key: 'social',
    label: 'Social',
    description: 'Stories, posts e presença.',
  },
  {
    key: 'media',
    label: 'Mídia',
    description: 'Filmes, fotos, livros e repertório.',
  },
  {
    key: 'productivity',
    label: 'Produtividade',
    description: 'Notas, agenda e organização.',
  },
];

export const integrationPlugins: IntegrationPlugin[] = [
  {
    id: 'iris-onboarding-personality',
    name: 'Personalidade IRIS',
    shortName: 'Personalidade',
    description: 'Usa respostas do onboarding para adaptar tom, ritmo e recomendações.',
    longDescription:
      'Centraliza preferências de personalidade, intenção e sinais do onboarding para deixar a experiência mais coerente em telas, IA e recomendações.',
    kind: 'internal',
    category: 'internal',
    status: 'internal',
    accent: 'bg-[#1B3A2E]',
    icon: 'Brain',
    scopes: ['onboarding.personality', 'profile.intentions', 'ai.tone'],
    useCases: ['Ajustar tom da IA', 'Sugerir temas', 'Adaptar experiência inicial'],
    notes: 'Interno. Não depende de API externa.',
  },
  {
    id: 'iris-culture',
    name: 'Cultura e repertório',
    shortName: 'Cultura',
    description: 'Livros, músicas, filmes, hobbies e gostos declarados no onboarding.',
    longDescription:
      'Organiza repertório cultural para recomendações de memórias, temas, cartas, trilhas e experiências afetivas.',
    kind: 'internal',
    category: 'memories',
    status: 'internal',
    accent: 'bg-[#9A7CA7]',
    icon: 'Sparkles',
    scopes: ['culture.tags', 'culture.data', 'recommendations'],
    useCases: ['Recomendar temas', 'Criar cartas', 'Montar bibliotecas afetivas'],
    notes: 'Pode ser combinado com Spotify, Letterboxd e Pinterest depois.',
  },
  {
    id: 'iris-uslife',
    name: 'usLIFE',
    shortName: 'usLIFE',
    description: 'Conecta preferências de vínculo, convites e experiências compartilhadas.',
    longDescription:
      'Prepara a camada de vínculo para casais, amigos próximos ou espaços compartilhados dentro da IRIS.',
    kind: 'internal',
    category: 'memories',
    status: 'internal',
    accent: 'bg-[#EAD8D6]',
    icon: 'HeartHandshake',
    scopes: ['uslife.invites', 'shared.spaces', 'relationship.context'],
    useCases: ['Convites afetivos', 'Memórias compartilhadas', 'Experiências a dois'],
    notes: 'Interno. Depende do fluxo usLIFE.',
  },
  {
    id: 'iris-memories',
    name: 'Memórias IRIS',
    shortName: 'Memórias',
    description: 'Base interna de álbuns, cartas, sonhos e linha do tempo.',
    longDescription:
      'Permite que módulos internos conversem entre si: álbuns, timeline, cartas, sonhos, biblioteca e IA.',
    kind: 'internal',
    category: 'memories',
    status: 'ready',
    accent: 'bg-[#006D4E]',
    icon: 'Images',
    scopes: ['memories.read', 'timeline.read', 'letters.read', 'dreams.read'],
    useCases: ['Linha do tempo', 'Álbuns inteligentes', 'Cartas com contexto'],
    notes: 'Base de integração interna principal.',
  },
  {
    id: 'iris-ai-plugins',
    name: 'Plugins da IA',
    shortName: 'IA Plugins',
    description: 'Camada para a IA usar ferramentas internas e futuras extensões.',
    longDescription:
      'Prepara a IRIS para executar ações com plugins: buscar memórias, sugerir trilhas, criar stories, resumir cartas e automatizar tarefas.',
    kind: 'internal',
    category: 'automation',
    status: 'beta',
    accent: 'bg-[#111111]',
    icon: 'Bot',
    scopes: ['ai.plugins', 'tools.execute', 'memory.context'],
    useCases: ['IA com ferramentas', 'Recomendações', 'Automação pessoal'],
    notes: 'Preparado para futuras permissões por plugin.',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    shortName: 'Spotify',
    description: 'Tocar músicas enquanto navega e sugerir trilhas por memória.',
    longDescription:
      'Pré-integração para player ambiental, playlists por humor, trilhas em álbuns e recomendações musicais ligadas a memórias.',
    kind: 'external',
    category: 'music',
    status: 'planned',
    accent: 'bg-[#1DB954]',
    icon: 'Music',
    scopes: ['spotify.playback', 'spotify.playlists', 'spotify.profile'],
    useCases: ['Player durante navegação', 'Trilhas por álbum', 'Memórias com música'],
    notes: 'OAuth e Web Playback SDK entram depois.',
  },
  {
    id: 'apple-music',
    name: 'Apple Music',
    shortName: 'Apple Music',
    description: 'Alternativa musical para trilhas, playlists e contexto sonoro.',
    longDescription:
      'Pré-camada para conectar biblioteca musical, playlists e reprodução contextual dentro da IRIS.',
    kind: 'external',
    category: 'music',
    status: 'planned',
    accent: 'bg-[#FA243C]',
    icon: 'Headphones',
    scopes: ['applemusic.library', 'applemusic.playlists'],
    useCases: ['Trilhas afetivas', 'Player ambiental', 'Repertório musical'],
    notes: 'Integração real depende da Apple Music API.',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    shortName: 'Instagram',
    description: 'Criar stories personalizados com memórias, capas e frases.',
    longDescription:
      'Pré-integração para gerar stories personalizados a partir de cartas, álbuns, frases e templates da IRIS.',
    kind: 'external',
    category: 'social',
    status: 'planned',
    accent: 'bg-[#E4405F]',
    icon: 'Camera',
    scopes: ['instagram.profile', 'instagram.media_publish'],
    useCases: ['Stories personalizados', 'Capas de memória', 'Compartilhamento social'],
    notes: 'Publicação real depende das permissões da Meta API.',
  },
  {
    id: 'letterboxd',
    name: 'Letterboxd',
    shortName: 'Letterboxd',
    description: 'Importar filmes favoritos e criar repertório cinematográfico.',
    longDescription:
      'Pré-integração para usar filmes assistidos, listas e favoritos como repertório emocional e cultural dentro da IRIS.',
    kind: 'external',
    category: 'media',
    status: 'planned',
    accent: 'bg-[#202830]',
    icon: 'Clapperboard',
    scopes: ['letterboxd.profile', 'letterboxd.watchlist', 'letterboxd.favorites'],
    useCases: ['Filmes favoritos', 'Recomendações de cartas', 'Temas cinematográficos'],
    notes: 'Pode começar manual e depois evoluir para API/importação.',
  },
  {
    id: 'google-photos',
    name: 'Google Photos',
    shortName: 'Photos',
    description: 'Importar fotos para álbuns e memórias com curadoria.',
    longDescription:
      'Pré-integração para selecionar fotos, criar álbuns e associar imagens a momentos importantes.',
    kind: 'external',
    category: 'media',
    status: 'planned',
    accent: 'bg-[#4285F4]',
    icon: 'Image',
    scopes: ['photos.readonly', 'albums.readonly'],
    useCases: ['Importar álbuns', 'Criar memórias', 'Selecionar capas'],
    notes: 'Usar escopos mínimos e consentimento claro.',
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    shortName: 'Pinterest',
    description: 'Importar referências visuais para temas, capas e moods.',
    longDescription:
      'Pré-integração para trazer referências de estética, moodboards, capas e universos visuais.',
    kind: 'external',
    category: 'media',
    status: 'planned',
    accent: 'bg-[#BD081C]',
    icon: 'PanelTop',
    scopes: ['pinterest.boards', 'pinterest.pins'],
    useCases: ['Moodboards', 'Capas de álbuns', 'Temas visuais'],
    notes: 'Boa para biblioteca de temas e design emocional.',
  },
  {
    id: 'notion',
    name: 'Notion',
    shortName: 'Notion',
    description: 'Enviar notas, cartas e registros para um workspace externo.',
    longDescription:
      'Pré-integração para exportar cartas, diários, sonhos e registros organizados para Notion.',
    kind: 'external',
    category: 'productivity',
    status: 'planned',
    accent: 'bg-[#111111]',
    icon: 'NotebookText',
    scopes: ['notion.pages.write', 'notion.databases.read'],
    useCases: ['Exportar cartas', 'Organizar diários', 'Arquivar sonhos'],
    notes: 'Pode virar exportação manual antes da API.',
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    shortName: 'Calendar',
    description: 'Criar lembretes afetivos, datas importantes e rituais.',
    longDescription:
      'Pré-integração para sincronizar datas importantes, sonhos, lembretes, aniversários e rituais pessoais.',
    kind: 'external',
    category: 'productivity',
    status: 'planned',
    accent: 'bg-[#34A853]',
    icon: 'CalendarDays',
    scopes: ['calendar.events', 'calendar.readonly'],
    useCases: ['Lembretes afetivos', 'Datas importantes', 'Rituais recorrentes'],
    notes: 'Depois pode usar OAuth Google.',
  },
  {
    id: 'discord',
    name: 'Discord',
    shortName: 'Discord',
    description: 'Webhooks e presença para comunidades internas ou bots.',
    longDescription:
      'Pré-integração para enviar eventos, notificações e presença da IRIS para servidores ou bots privados.',
    kind: 'external',
    category: 'social',
    status: 'planned',
    accent: 'bg-[#5865F2]',
    icon: 'MessagesSquare',
    scopes: ['discord.webhooks', 'discord.identity'],
    useCases: ['Bots', 'Comunidades', 'Notificações'],
    notes: 'Usar com cuidado para não expor dados sensíveis.',
  },
  {
    id: 'iris-api',
    name: 'IRIS API',
    shortName: 'API',
    description: 'Permitir que outros apps se conectem à IRIS.',
    longDescription:
      'Camada developer para apps externos lerem ou enviarem dados autorizados para a IRIS com escopos claros.',
    kind: 'developer',
    category: 'developer',
    status: 'beta',
    accent: 'bg-[#1B3A2E]',
    icon: 'Braces',
    scopes: ['iris.read', 'iris.write', 'iris.memories'],
    useCases: ['Apps parceiros', 'Integrações próprias', 'Automação externa'],
    notes: 'Preparar tokens, escopos e painel de apps depois.',
  },
  {
    id: 'iris-webhooks',
    name: 'IRIS Webhooks',
    shortName: 'Webhooks',
    description: 'Enviar eventos da IRIS para outros sistemas.',
    longDescription:
      'Pré-camada para disparar eventos quando memórias forem criadas, cartas forem publicadas ou ações importantes ocorrerem.',
    kind: 'developer',
    category: 'developer',
    status: 'planned',
    accent: 'bg-[#476153]',
    icon: 'Webhook',
    scopes: ['events.memories', 'events.profile', 'events.uslife'],
    useCases: ['Automação externa', 'Logs', 'Apps próprios'],
    notes: 'Precisa de assinatura de payload e secrets.',
  },
  {
    id: 'iris-oauth-apps',
    name: 'OAuth Apps',
    shortName: 'OAuth',
    description: 'Criar aplicativos que pedem acesso autorizado à IRIS.',
    longDescription:
      'Base para desenvolvedores criarem apps autorizados com consentimento do usuário, escopos e revogação.',
    kind: 'developer',
    category: 'developer',
    status: 'planned',
    accent: 'bg-[#9A7CA7]',
    icon: 'KeyRound',
    scopes: ['oauth.clients', 'oauth.consents', 'oauth.tokens'],
    useCases: ['Apps de terceiros', 'Autorização segura', 'Revogação'],
    notes: 'Precisa de painel developer e revisão de segurança.',
  },
  {
    id: 'iris-widgets',
    name: 'IRIS Widgets',
    shortName: 'Widgets',
    description: 'Incorporar memórias, cartas ou cards da IRIS em outros lugares.',
    longDescription:
      'Pré-camada para widgets embutíveis, cards compartilháveis e experiências leves fora do app principal.',
    kind: 'developer',
    category: 'developer',
    status: 'planned',
    accent: 'bg-[#EDE6DA]',
    icon: 'LayoutTemplate',
    scopes: ['widgets.embed', 'widgets.readonly'],
    useCases: ['Embeds', 'Cards públicos', 'Landing pages'],
    notes: 'Precisa respeitar privacidade e permissões.',
  },
];

export const defaultIntegrationPreferences: IntegrationPreferences = {
  enabled: [],
  pinned: [],
  autoMusic: false,
  storyMode: true,
  apiAccessRequested: false,
};

export const defaultIntegrationData: IntegrationData = {
  plugins: {},
};

export function normalizeIntegrationPreferences(value: unknown): IntegrationPreferences {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return defaultIntegrationPreferences;
  }

  const source = value as Record<string, unknown>;

  return {
    enabled: Array.isArray(source.enabled)
      ? source.enabled.filter((item): item is string => typeof item === 'string')
      : [],
    pinned: Array.isArray(source.pinned)
      ? source.pinned.filter((item): item is string => typeof item === 'string')
      : [],
    lastViewed: typeof source.lastViewed === 'string' ? source.lastViewed : undefined,
    autoMusic: typeof source.autoMusic === 'boolean' ? source.autoMusic : false,
    storyMode: typeof source.storyMode === 'boolean' ? source.storyMode : true,
    apiAccessRequested:
      typeof source.apiAccessRequested === 'boolean'
        ? source.apiAccessRequested
        : false,
    updated_at: typeof source.updated_at === 'string' ? source.updated_at : undefined,
  };
}

export function normalizeIntegrationData(value: unknown): IntegrationData {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return defaultIntegrationData;
  }

  const source = value as Record<string, unknown>;
  const plugins = source.plugins;

  if (!plugins || typeof plugins !== 'object' || Array.isArray(plugins)) {
    return defaultIntegrationData;
  }

  return {
    plugins: plugins as IntegrationData['plugins'],
    updated_at: typeof source.updated_at === 'string' ? source.updated_at : undefined,
  };
}

export function getPluginById(id: string) {
  return integrationPlugins.find((plugin) => plugin.id === id) ?? integrationPlugins[0];
}

export function filterPlugins(category: IntegrationCategory, query: string) {
  const cleanQuery = query.trim().toLowerCase();

  return integrationPlugins.filter((plugin) => {
    const categoryMatch =
      category === 'all' ||
      plugin.kind === category ||
      plugin.category === category;

    const queryMatch =
      !cleanQuery ||
      plugin.name.toLowerCase().includes(cleanQuery) ||
      plugin.shortName.toLowerCase().includes(cleanQuery) ||
      plugin.description.toLowerCase().includes(cleanQuery) ||
      plugin.scopes.join(' ').toLowerCase().includes(cleanQuery);

    return categoryMatch && queryMatch;
  });
}

export function getPreparedCount(preferences: IntegrationPreferences) {
  return preferences.enabled.length;
}

export function getKindLabel(kind: IntegrationKind) {
  if (kind === 'internal') return 'IRIS';
  if (kind === 'developer') return 'Developer';
  return 'Externo';
}

export function getStatusLabel(status: IntegrationStatus) {
  if (status === 'ready') return 'Pronto';
  if (status === 'beta') return 'Beta';
  if (status === 'internal') return 'Interno';
  return 'Planejado';
}
