import { getProfileCompletion } from './completion';

type OnboardingStateLike = {
  firstName?: string;
  socialName?: string;
  cpf?: string;
  birthDate?: string;
  avatarUrl?: string;
  coverUrl?: string;
  colorSymbol?: string;
  username?: string;
  personalityData?: any;
  cultureTags?: string[];
  cultureData?: any;
  integrationPreferences?: string[];
  integrationData?: any;
  intention?: string;
  intentionData?: any;
  privacyLevel?: string;
  privacyData?: any;
  accessibilityData?: any;
  usLifeInviteData?: any;
  plan?: string;
  planData?: any;
};

export function buildOnboardingSnapshot(state: OnboardingStateLike) {
  return {
    basicInfo: {
      firstName: state.firstName || '',
      socialName: state.socialName || '',
      birthDate: state.birthDate || '',
    },
    identity: {
      avatarUrl: state.avatarUrl || '',
      coverUrl: state.coverUrl || '',
      colorSymbol: state.colorSymbol || '',
      username: state.username || '',
    },
    personality: state.personalityData || {},
    culture: {
      cultureTags: state.cultureTags || [],
      cultureData: state.cultureData || {},
    },
    integrations: {
      integrationPreferences: state.integrationPreferences || [],
      integrationData: state.integrationData || {},
    },
    intention: {
      intention: state.intention || '',
      intentionData: state.intentionData || {},
    },
    privacy: {
      privacyLevel: state.privacyLevel || '',
      privacyData: state.privacyData || {},
    },
    accessibility: state.accessibilityData || {},
    usLifeInvite: state.usLifeInviteData || {},
    plan: {
      plan: state.plan || '',
      planData: state.planData || {},
    },
    completion: getProfileCompletion(state),
  };
}

export function buildOnboardingSections(snapshot: ReturnType<typeof buildOnboardingSnapshot>) {
  return [
    { title: 'Dados básicos', data: snapshot.basicInfo },
    { title: 'Identidade', data: snapshot.identity },
    { title: 'Personalidade', data: snapshot.personality },
    { title: 'Cultura', data: snapshot.culture },
    { title: 'Integrações', data: snapshot.integrations },
    { title: 'Intenção', data: snapshot.intention },
    { title: 'Privacidade', data: snapshot.privacy },
    { title: 'Acessibilidade', data: snapshot.accessibility },
    { title: 'usLIFE', data: snapshot.usLifeInvite },
    { title: 'Plano', data: snapshot.plan },
    { title: 'Progresso', data: snapshot.completion },
  ];
}

export function buildProfilePayload(state: OnboardingStateLike, profileId: string) {
  const now = new Date().toISOString();
  const completion = getProfileCompletion(state);

  const essentialCompleted = Boolean(state.firstName && state.birthDate && state.username);
  const onboardingStatus = completion.rewardEligible
    ? 'completed'
    : essentialCompleted
      ? 'essential_completed'
      : 'draft';

  return {
    id: profileId,

    first_name: state.firstName || null,
    social_name: state.socialName || null,

    // Segurança: CPF não faz parte do cadastro essencial.
    // Quando houver necessidade legal, salvar via fluxo dedicado e protegido.
    cpf: null,

    birth_date: state.birthDate || null,
    avatar_url: state.avatarUrl || null,
    cover_url: state.coverUrl || null,
    color_symbol: state.colorSymbol || null,
    username: state.username || null,

    personality_data: state.personalityData || {},
    personality_completed_at: state.personalityData?.completedAt || null,

    culture_tags: state.cultureTags || [],
    culture_data: state.cultureData || {},
    culture_completed_at: state.cultureData?.completedAt || null,

    integration_preferences: state.integrationPreferences || [],
    integration_data: state.integrationData || {},
    integrations_completed_at: state.integrationData?.completedAt || null,

    intention: state.intention || null,
    intention_data: state.intentionData || {},
    intention_completed_at: state.intentionData?.completedAt || null,

    privacy_level: state.privacyLevel || 'private',
    privacy_data: state.privacyData || {},
    privacy_completed_at: state.privacyData?.completedAt || null,

    accessibility_data: state.accessibilityData || {},
    accessibility_completed_at: state.accessibilityData?.completedAt || null,
    theme_preference:
      state.accessibilityData?.preferences?.theme ||
      state.accessibilityData?.theme ||
      'system',

    uslife_invite_data: state.usLifeInviteData || {},
    uslife_invite_completed_at: state.usLifeInviteData?.completedAt || null,

    plan_key: state.plan || 'free',
    plan_data: state.planData || {},
    plan_completed_at: state.planData?.completedAt || null,

    onboarding_status: onboardingStatus,
    onboarding_completed_at: essentialCompleted ? now : null,

    profile_completion_status: completion.status,
    profile_completion_data: completion,
    profile_completion_reward_status: completion.rewardStatus,

    // Recompensas reais devem ser validadas no servidor.
    profile_badges: [],
    unlocked_themes: [],

    updated_at: now,
  };
}
