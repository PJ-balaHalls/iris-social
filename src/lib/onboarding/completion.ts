export type ProfileCompletionTaskKey =
  | 'essential'
  | 'avatar'
  | 'personality'
  | 'culture'
  | 'integrations'
  | 'intention'
  | 'privacy'
  | 'accessibility'
  | 'uslife'
  | 'plan';

export type ProfileCompletionTask = {
  key: ProfileCompletionTaskKey;
  label: string;
  description: string;
  href: string;
  requiredForReward: boolean;
  completed: boolean;
};

function hasValue(value: unknown) {
  if (value === null || value === undefined || value === '') return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value as object).length > 0;
  return true;
}

function hasCompletedAt(value: any) {
  return Boolean(value?.completedAt || value?.preferences || Object.keys(value || {}).length > 0);
}

export function getProfileCompletion(state: any) {
  const tasks: ProfileCompletionTask[] = [
    {
      key: 'essential',
      label: 'Perfil essencial',
      description: 'Nome, nascimento e username para criar o perfil.',
      href: '/onboarding/basic-info',
      requiredForReward: true,
      completed: Boolean(state.firstName && state.birthDate && state.username),
    },
    {
      key: 'avatar',
      label: 'Avatar e capa',
      description: 'Imagem de perfil e identidade visual inicial.',
      href: '/onboarding/avatar',
      requiredForReward: true,
      completed: Boolean(state.avatarUrl || state.coverUrl),
    },
    {
      key: 'personality',
      label: 'Personalidade',
      description: 'Sinais iniciais para personalização da experiência.',
      href: '/onboarding/personality',
      requiredForReward: true,
      completed: hasCompletedAt(state.personalityData),
    },
    {
      key: 'culture',
      label: 'Cultura',
      description: 'Temas, formatos e tom do seu repertório.',
      href: '/onboarding/culture',
      requiredForReward: true,
      completed: hasCompletedAt(state.cultureData),
    },
    {
      key: 'integrations',
      label: 'Integrações',
      description: 'Fontes que a IRIS pode preparar para conectar depois.',
      href: '/onboarding/integrations',
      requiredForReward: false,
      completed: hasCompletedAt(state.integrationData),
    },
    {
      key: 'intention',
      label: 'Intenção',
      description: 'Direção principal da sua experiência.',
      href: '/onboarding/intention',
      requiredForReward: true,
      completed: hasCompletedAt(state.intentionData),
    },
    {
      key: 'privacy',
      label: 'Privacidade',
      description: 'Limites, visibilidade e uso de contexto pela IA.',
      href: '/onboarding/privacy',
      requiredForReward: true,
      completed: hasCompletedAt(state.privacyData),
    },
    {
      key: 'accessibility',
      label: 'Acessibilidade',
      description: 'Tema, fonte, espaçamento, contraste e movimento.',
      href: '/onboarding/accessibility',
      requiredForReward: true,
      completed: hasCompletedAt(state.accessibilityData),
    },
    {
      key: 'uslife',
      label: 'usLIFE',
      description: 'Convite ou preparação de espaço compartilhado.',
      href: '/onboarding/uslife-invite',
      requiredForReward: false,
      completed: hasCompletedAt(state.usLifeInviteData),
    },
    {
      key: 'plan',
      label: 'Plano',
      description: 'Preferência gratuita, plano, código ou sob demanda.',
      href: '/onboarding/plan',
      requiredForReward: false,
      completed: hasValue(state.planData) || Boolean(state.plan),
    },
  ];

  const completedTasks = tasks.filter((task) => task.completed);
  const requiredTasks = tasks.filter((task) => task.requiredForReward);
  const completedRequiredTasks = requiredTasks.filter((task) => task.completed);
  const nextRequiredTask = requiredTasks.find((task) => !task.completed);
  const nextTask = tasks.find((task) => !task.completed);

  const percent = Math.round((completedTasks.length / tasks.length) * 100);
  const rewardPercent = Math.round((completedRequiredTasks.length / requiredTasks.length) * 100);
  const rewardEligible = completedRequiredTasks.length === requiredTasks.length;

  return {
    tasks,
    completedCount: completedTasks.length,
    totalCount: tasks.length,
    percent,
    requiredCompletedCount: completedRequiredTasks.length,
    requiredTotalCount: requiredTasks.length,
    rewardPercent,
    rewardEligible,
    nextTask,
    nextRequiredTask,
    status: rewardEligible ? 'completed' : 'pending',
    rewardStatus: rewardEligible ? 'pending_validation' : 'not_eligible',
  };
}
