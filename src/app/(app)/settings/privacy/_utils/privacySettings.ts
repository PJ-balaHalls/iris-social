export type PrivacyLevel = 'private' | 'affinity' | 'public';

export type PrivacySectionKey =
  | 'visibility'
  | 'discovery'
  | 'interactions'
  | 'intelligence'
  | '';

export type PrivacyData = {
  visibility: {
    show_profile_in_search: boolean;
    show_online_status: boolean;
    show_uslife_badge: boolean;
    show_activity_presence: boolean;
  };
  discovery: {
    allow_username_search: boolean;
    allow_affinity_recommendations: boolean;
    allow_invites: boolean;
    allow_community_suggestions: boolean;
  };
  interactions: {
    allow_direct_messages: boolean;
    allow_unknown_invites: boolean;
    allow_comments: boolean;
    safety_filter: boolean;
  };
  intelligence: {
    allow_ai_memory: boolean;
    allow_personalization: boolean;
    allow_recommendations: boolean;
    allow_usage_analytics: boolean;
  };
};

export type PrivacyProfile = {
  privacy_level?: PrivacyLevel | string | null;
  privacy_data?: PrivacyData | Record<string, unknown> | null;
  privacy_completed_at?: string | null;
  updated_at?: string | null;
};

export const privacyLevelOptions = [
  {
    label: 'Privado',
    value: 'private',
    description: 'Menor exposição. Você controla descoberta, convites e visibilidade.',
  },
  {
    label: 'Por afinidade',
    value: 'affinity',
    description: 'A IRIS pode sugerir conexões com base em sinais compatíveis.',
  },
  {
    label: 'Público',
    value: 'public',
    description: 'Mais visível em busca, recomendações e espaços sociais.',
  },
];

export const privacyLevelLabels: Record<string, string> = {
  private: 'Privado',
  affinity: 'Por afinidade',
  public: 'Público',
};

export const defaultPrivacyData: PrivacyData = {
  visibility: {
    show_profile_in_search: false,
    show_online_status: false,
    show_uslife_badge: true,
    show_activity_presence: false,
  },
  discovery: {
    allow_username_search: true,
    allow_affinity_recommendations: false,
    allow_invites: true,
    allow_community_suggestions: false,
  },
  interactions: {
    allow_direct_messages: false,
    allow_unknown_invites: false,
    allow_comments: true,
    safety_filter: true,
  },
  intelligence: {
    allow_ai_memory: true,
    allow_personalization: true,
    allow_recommendations: true,
    allow_usage_analytics: false,
  },
};

export const privacyCopy = {
  visibility: {
    eyebrow: 'Visibilidade',
    title: 'Quem consegue perceber sua presença',
    description:
      'Controle como sua conta aparece em busca, presença, vínculos e atividade.',
    fields: {
      show_profile_in_search: {
        title: 'Aparecer em buscas',
        description: 'Permite que sua conta seja encontrada dentro da IRIS.',
      },
      show_online_status: {
        title: 'Mostrar status online',
        description: 'Exibe se você está ativo ou esteve presente recentemente.',
      },
      show_uslife_badge: {
        title: 'Mostrar selo usLIFE',
        description: 'Mostra que sua conta participa de um vínculo ou espaço usLIFE.',
      },
      show_activity_presence: {
        title: 'Mostrar presença de atividade',
        description: 'Permite sinais discretos de atividade em áreas sociais.',
      },
    },
  },
  discovery: {
    eyebrow: 'Descoberta',
    title: 'Como outras pessoas chegam até você',
    description:
      'Ajuste buscas por username, convites, recomendações e sugestões sociais.',
    fields: {
      allow_username_search: {
        title: 'Busca por username',
        description: 'Permite encontrar sua conta usando seu identificador.',
      },
      allow_affinity_recommendations: {
        title: 'Recomendações por afinidade',
        description: 'Permite que a IRIS sugira sua conta em conexões compatíveis.',
      },
      allow_invites: {
        title: 'Receber convites',
        description: 'Permite convites para vínculos, espaços ou experiências.',
      },
      allow_community_suggestions: {
        title: 'Sugestões em comunidades',
        description: 'Permite aparecer em sugestões de comunidades ou espaços internos.',
      },
    },
  },
  interactions: {
    eyebrow: 'Interações',
    title: 'Mensagens, comentários e proteção',
    description:
      'Controle quem pode iniciar contato e como os filtros de segurança atuam.',
    fields: {
      allow_direct_messages: {
        title: 'Mensagens diretas',
        description: 'Permite que pessoas elegíveis iniciem conversa com você.',
      },
      allow_unknown_invites: {
        title: 'Convites de desconhecidos',
        description: 'Permite convites de pessoas fora do seu círculo direto.',
      },
      allow_comments: {
        title: 'Comentários',
        description: 'Permite comentários em conteúdos ou espaços onde isso existir.',
      },
      safety_filter: {
        title: 'Filtro de proteção',
        description: 'Mantém filtros contra contato abusivo, spam e conteúdo inadequado.',
      },
    },
  },
  intelligence: {
    eyebrow: 'IRIS AI',
    title: 'Memória, personalização e recomendações',
    description:
      'Defina o quanto a inteligência da IRIS pode usar contexto para personalizar a experiência.',
    fields: {
      allow_ai_memory: {
        title: 'Memória da IA',
        description: 'Permite que a IRIS use contexto salvo para respostas mais coerentes.',
      },
      allow_personalization: {
        title: 'Personalização',
        description: 'Permite adaptar a interface e recomendações ao seu uso.',
      },
      allow_recommendations: {
        title: 'Recomendações',
        description: 'Permite sugestões de temas, espaços, memórias e ações.',
      },
      allow_usage_analytics: {
        title: 'Métricas de uso',
        description: 'Permite sinais técnicos agregados para melhorar a experiência.',
      },
    },
  },
};

export function normalizePrivacyLevel(value: unknown): PrivacyLevel {
  if (value === 'public' || value === 'affinity' || value === 'private') {
    return value;
  }

  return 'private';
}

function normalizeSection<T extends Record<string, boolean>>(
  defaults: T,
  input: unknown,
): T {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return defaults;
  }

  const result = { ...defaults };

  for (const key of Object.keys(defaults) as Array<keyof T>) {
    const value = (input as Record<string, unknown>)[String(key)];

    if (typeof value === 'boolean') {
      result[key] = value as T[keyof T];
    }
  }

  return result;
}

export function normalizePrivacyData(value: unknown): PrivacyData {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return defaultPrivacyData;
  }

  const source = value as Record<string, unknown>;

  return {
    visibility: normalizeSection(defaultPrivacyData.visibility, source.visibility),
    discovery: normalizeSection(defaultPrivacyData.discovery, source.discovery),
    interactions: normalizeSection(defaultPrivacyData.interactions, source.interactions),
    intelligence: normalizeSection(defaultPrivacyData.intelligence, source.intelligence),
  };
}

export function setPrivacyBoolean(
  data: PrivacyData,
  section: Exclude<PrivacySectionKey, ''>,
  key: string,
  value: boolean,
): PrivacyData {
  return {
    ...data,
    [section]: {
      ...data[section],
      [key]: value,
    },
  };
}

export function getEnabledCount(section: Record<string, boolean>) {
  return Object.values(section).filter(Boolean).length;
}

export function getPrivacyStats(data: PrivacyData) {
  const exposureKeys = [
    data.visibility.show_profile_in_search,
    data.visibility.show_online_status,
    data.visibility.show_activity_presence,
    data.discovery.allow_affinity_recommendations,
    data.discovery.allow_community_suggestions,
    data.interactions.allow_unknown_invites,
    data.interactions.allow_direct_messages,
  ];

  const intelligenceKeys = Object.values(data.intelligence);
  const protectionKeys = [
    !data.discovery.allow_affinity_recommendations,
    !data.interactions.allow_unknown_invites,
    data.interactions.safety_filter,
    !data.visibility.show_online_status,
  ];

  return {
    exposure: exposureKeys.filter(Boolean).length,
    intelligence: intelligenceKeys.filter(Boolean).length,
    protection: protectionKeys.filter(Boolean).length,
  };
}

export function downloadPrivacyJson(payload: unknown) {
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = 'iris-privacidade.json';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}
