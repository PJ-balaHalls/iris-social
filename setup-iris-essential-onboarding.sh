#!/usr/bin/env bash
set -euo pipefail

mkdir -p src/lib/errors
mkdir -p src/lib/erros
mkdir -p src/lib/onboarding
mkdir -p src/components/iris/profile-completion
mkdir -p src/components/onboarding
mkdir -p src/app/onboarding/basic-info
mkdir -p src/app/onboarding/finish
mkdir -p src/app/iris

cat > src/lib/errors/onboarding.ts <<'TS'
export type OnboardingErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export type OnboardingErrorCode =
  | 'IRIS_ERR_ONBOARDING_001_SESSION_NOT_FOUND'
  | 'IRIS_ERR_ONBOARDING_002_PROFILE_SAVE_FAILED'
  | 'IRIS_ERR_ONBOARDING_003_USERNAME_UNAVAILABLE'
  | 'IRIS_ERR_ONBOARDING_004_REQUIRED_FIELD'
  | 'IRIS_ERR_ONBOARDING_005_INVALID_BIRTH_DATE'
  | 'IRIS_ERR_ONBOARDING_006_RLS_DENIED'
  | 'IRIS_ERR_ONBOARDING_007_STORAGE_UPLOAD_FAILED'
  | 'IRIS_ERR_ONBOARDING_008_REWARD_CLAIM_FAILED'
  | 'IRIS_ERR_ONBOARDING_009_PROFILE_COMPLETION_INVALID'
  | 'IRIS_ERR_ONBOARDING_010_UNKNOWN';

export type IrisOnboardingErrorDefinition = {
  code: OnboardingErrorCode;
  severity: OnboardingErrorSeverity;
  technicalMessage: string;
  userMessage: string;
  meaning: string;
  probableCause: string;
  howToFix: string;
};

export const ONBOARDING_ERROR_LIBRARY: Record<
  OnboardingErrorCode,
  IrisOnboardingErrorDefinition
> = {
  IRIS_ERR_ONBOARDING_001_SESSION_NOT_FOUND: {
    code: 'IRIS_ERR_ONBOARDING_001_SESSION_NOT_FOUND',
    severity: 'critical',
    technicalMessage: 'Sessão Supabase ausente durante o salvamento do onboarding.',
    userMessage: 'Sua sessão expirou. Entre novamente para continuar.',
    meaning: 'O usuário não está autenticado no momento do save.',
    probableCause: 'Token expirado, refresh de página, logout ou falha no auth.',
    howToFix: 'Redirecionar para login e repetir o salvamento após autenticação.',
  },
  IRIS_ERR_ONBOARDING_002_PROFILE_SAVE_FAILED: {
    code: 'IRIS_ERR_ONBOARDING_002_PROFILE_SAVE_FAILED',
    severity: 'error',
    technicalMessage: 'Falha genérica ao salvar dados na tabela profiles.',
    userMessage: 'Não conseguimos salvar seu perfil agora. Tente novamente.',
    meaning: 'O Supabase recusou ou falhou ao executar upsert em profiles.',
    probableCause: 'Coluna ausente, constraint, payload inválido ou conexão.',
    howToFix: 'Verificar SQL, payload enviado e logs do Supabase.',
  },
  IRIS_ERR_ONBOARDING_003_USERNAME_UNAVAILABLE: {
    code: 'IRIS_ERR_ONBOARDING_003_USERNAME_UNAVAILABLE',
    severity: 'warning',
    technicalMessage: 'Username já existe ou violou índice único.',
    userMessage: 'Esse @ já está em uso. Escolha outro nome de usuário.',
    meaning: 'Conflito de username no banco.',
    probableCause: 'Outro usuário salvou o mesmo username primeiro.',
    howToFix: 'Pedir novo username e validar novamente.',
  },
  IRIS_ERR_ONBOARDING_004_REQUIRED_FIELD: {
    code: 'IRIS_ERR_ONBOARDING_004_REQUIRED_FIELD',
    severity: 'warning',
    technicalMessage: 'Campo obrigatório ausente no onboarding essencial.',
    userMessage: 'Preencha os campos obrigatórios para continuar.',
    meaning: 'O perfil essencial não está completo.',
    probableCause: 'Nome, nascimento ou username ausente.',
    howToFix: 'Validar o formulário antes do save.',
  },
  IRIS_ERR_ONBOARDING_005_INVALID_BIRTH_DATE: {
    code: 'IRIS_ERR_ONBOARDING_005_INVALID_BIRTH_DATE',
    severity: 'warning',
    technicalMessage: 'Data de nascimento inválida.',
    userMessage: 'Selecione uma data de nascimento válida.',
    meaning: 'A data enviada não pode ser interpretada como nascimento válido.',
    probableCause: 'Formato incorreto, data futura ou valor vazio.',
    howToFix: 'Usar calendário e validação ISO yyyy-mm-dd.',
  },
  IRIS_ERR_ONBOARDING_006_RLS_DENIED: {
    code: 'IRIS_ERR_ONBOARDING_006_RLS_DENIED',
    severity: 'critical',
    technicalMessage: 'Row Level Security bloqueou insert/update em profiles.',
    userMessage: 'Seu perfil não pôde ser salvo por uma regra de segurança.',
    meaning: 'As policies do Supabase não permitem salvar a própria linha.',
    probableCause: 'Policy ausente, id diferente de auth.uid(), grant ausente.',
    howToFix: 'Executar SQL de RLS permitindo select/insert/update com id = auth.uid().',
  },
  IRIS_ERR_ONBOARDING_007_STORAGE_UPLOAD_FAILED: {
    code: 'IRIS_ERR_ONBOARDING_007_STORAGE_UPLOAD_FAILED',
    severity: 'error',
    technicalMessage: 'Falha no upload de imagem do onboarding.',
    userMessage: 'Não conseguimos salvar sua imagem agora.',
    meaning: 'Storage recusou o upload de avatar ou capa.',
    probableCause: 'Bucket ausente, policy ausente, arquivo inválido ou limite.',
    howToFix: 'Verificar bucket, policies e tamanho do arquivo.',
  },
  IRIS_ERR_ONBOARDING_008_REWARD_CLAIM_FAILED: {
    code: 'IRIS_ERR_ONBOARDING_008_REWARD_CLAIM_FAILED',
    severity: 'error',
    technicalMessage: 'Falha ao registrar recompensa de perfil completo.',
    userMessage: 'Seu perfil foi salvo, mas a recompensa ainda não foi liberada.',
    meaning: 'A recompensa não deve ser concedida apenas pelo client.',
    probableCause: 'Validação server-side ainda não implementada.',
    howToFix: 'Marcar reward como pending_validation até validar no servidor.',
  },
  IRIS_ERR_ONBOARDING_009_PROFILE_COMPLETION_INVALID: {
    code: 'IRIS_ERR_ONBOARDING_009_PROFILE_COMPLETION_INVALID',
    severity: 'warning',
    technicalMessage: 'Dados de conclusão do perfil inconsistentes.',
    userMessage: 'Algumas etapas ainda precisam ser revisadas.',
    meaning: 'O progresso calculado não corresponde aos dados disponíveis.',
    probableCause: 'Store local incompleto ou dados antigos.',
    howToFix: 'Recalcular completion_data e pedir etapas pendentes.',
  },
  IRIS_ERR_ONBOARDING_010_UNKNOWN: {
    code: 'IRIS_ERR_ONBOARDING_010_UNKNOWN',
    severity: 'error',
    technicalMessage: 'Erro desconhecido no onboarding.',
    userMessage: 'Algo inesperado aconteceu. Tente novamente.',
    meaning: 'Erro não classificado.',
    probableCause: 'Exceção não tratada.',
    howToFix: 'Registrar logs e classificar o erro depois.',
  },
};

export function getOnboardingErrorDefinition(code: OnboardingErrorCode) {
  return ONBOARDING_ERROR_LIBRARY[code];
}

export function resolveOnboardingErrorCode(error: any): OnboardingErrorCode {
  const message = String(error?.message || '').toLowerCase();
  const code = String(error?.code || '').toLowerCase();

  if (code === '42501' || message.includes('row-level security') || message.includes('rls')) {
    return 'IRIS_ERR_ONBOARDING_006_RLS_DENIED';
  }

  if (code === '23505' || message.includes('duplicate key') || message.includes('unique')) {
    return 'IRIS_ERR_ONBOARDING_003_USERNAME_UNAVAILABLE';
  }

  if (message.includes('session') || message.includes('auth')) {
    return 'IRIS_ERR_ONBOARDING_001_SESSION_NOT_FOUND';
  }

  return 'IRIS_ERR_ONBOARDING_002_PROFILE_SAVE_FAILED';
}

export function logOnboardingError(error: any, context: Record<string, unknown> = {}) {
  const code = resolveOnboardingErrorCode(error);
  const definition = getOnboardingErrorDefinition(code);

  console.warn('[IRIS_ONBOARDING_ERROR]', {
    code,
    severity: definition.severity,
    technicalMessage: definition.technicalMessage,
    userMessage: definition.userMessage,
    probableCause: definition.probableCause,
    howToFix: definition.howToFix,
    originalError: {
      code: error?.code,
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
    },
    context,
  });

  return definition;
}
TS

cat > src/lib/erros/onboarding.tsx <<'TSX'
export * from '../errors/onboarding';
TSX

cat > src/lib/onboarding/completion.ts <<'TS'
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
TS

cat > src/lib/onboarding/onboardingSnapshot.ts <<'TS'
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
TS

cat > src/lib/onboarding/saveOnboardingProfile.ts <<'TS'
import { createClient } from '@/lib/supabase/client';
import { logOnboardingError } from '@/lib/errors/onboarding';
import { buildProfilePayload } from './onboardingSnapshot';

type SaveOnboardingResult = {
  ok: boolean;
  message: string;
};

export async function saveOnboardingProfile(state: any): Promise<SaveOnboardingResult> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    const definition = logOnboardingError(userError || new Error('Session not found'), {
      area: 'saveOnboardingProfile',
      step: 'getUser',
    });

    return {
      ok: false,
      message: definition.userMessage,
    };
  }

  const payload = buildProfilePayload(state, user.id);

  const { error } = await supabase
    .from('profiles')
    .upsert(payload, {
      onConflict: 'id',
    });

  if (error) {
    const definition = logOnboardingError(error, {
      area: 'saveOnboardingProfile',
      step: 'profiles.upsert',
      profileId: user.id,
    });

    return {
      ok: false,
      message: definition.userMessage,
    };
  }

  return {
    ok: true,
    message: 'Perfil salvo com sucesso.',
  };
}
TS

cat > src/components/onboarding/EmotionalProgressBar.tsx <<'TSX'
'use client';

import { usePathname } from 'next/navigation';

const essentialSteps = [
  { path: '/onboarding/basic-info', label: 'Dados' },
  { path: '/onboarding/username', label: 'Usuário' },
  { path: '/onboarding/finish', label: 'Final' },
];

const profileSteps = [
  { path: '/onboarding/avatar', label: 'Imagem' },
  { path: '/onboarding/personality', label: 'Perfil' },
  { path: '/onboarding/culture', label: 'Cultura' },
  { path: '/onboarding/integrations', label: 'Integrações' },
  { path: '/onboarding/intention', label: 'Intenção' },
  { path: '/onboarding/privacy', label: 'Privacidade' },
  { path: '/onboarding/accessibility', label: 'Acessibilidade' },
  { path: '/onboarding/uslife-invite', label: 'usLIFE' },
  { path: '/onboarding/plan', label: 'Plano' },
  { path: '/onboarding/finish', label: 'Final' },
];

export function EmotionalProgressBar() {
  const pathname = usePathname();

  const isProfileCompletion = profileSteps.some((step) => pathname.startsWith(step.path));
  const steps = isProfileCompletion ? profileSteps : essentialSteps;

  const foundIndex = steps.findIndex((step) => pathname.startsWith(step.path));
  const currentIndex = Math.max(0, foundIndex);
  const percentage = ((currentIndex + 1) / steps.length) * 100;
  const currentStep = steps[currentIndex] || steps[0];

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mb-2 flex items-center justify-center gap-3 text-center">
        <span className="text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
          {String(currentIndex + 1).padStart(2, '0')}
        </span>

        <span className="h-px w-8 bg-[#C7CFCC]" />

        <span className="text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-[#002c1f]">
          {currentStep.label}
        </span>

        <span className="h-px w-8 bg-[#C7CFCC]" />

        <span className="text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
          {steps.length}
        </span>
      </div>

      <div className="relative h-[6px] overflow-hidden rounded-full border border-white/60 bg-white/52 shadow-[inset_0_1px_2px_rgba(17,17,17,0.04)] backdrop-blur-xl">
        <div
          className="h-full rounded-full bg-[#002c1f] transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
TSX

cat > src/app/onboarding/basic-info/page.tsx <<'TSX'
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { IrisCalendarField } from '@/components/ui/IrisCalendarField';
import { MinimalOptionalField } from '@/components/onboarding/MinimalOptionalField';
import { OnboardingBottomActions } from '@/components/onboarding/OnboardingBottomActions';
import { OnboardingFieldLine } from '@/components/onboarding/OnboardingFieldLine';
import { OnboardingMinimalStep } from '@/components/onboarding/OnboardingMinimalStep';
import { useOnboardingStore } from '@/lib/store/onboardingStore';

type BasicInfoErrors = {
  firstName?: string;
  birthDate?: string;
};

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function formatDateToISO(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function calculateAgeFromISODate(value: string) {
  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) return null;

  const birthDate = new Date(year, month - 1, day);

  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  const hasNotHadBirthdayThisYear =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());

  if (hasNotHadBirthdayThisYear) age -= 1;

  return age;
}

const today = new Date();
const maxBirthDate = formatDateToISO(today);
const minBirthDate = `${today.getFullYear() - 120}-01-01`;

export default function BasicInfoPage() {
  const router = useRouter();
  const { firstName, socialName, birthDate, updateField } = useOnboardingStore();

  const [name, setName] = useState(firstName);
  const [optionalSocialName, setOptionalSocialName] = useState(socialName);
  const [date, setDate] = useState(birthDate);
  const [errors, setErrors] = useState<BasicInfoErrors>({});

  function validate() {
    const nextErrors: BasicInfoErrors = {};

    if (!name.trim()) nextErrors.firstName = 'Digite como devemos chamar você.';
    if (!date) nextErrors.birthDate = 'Selecione sua data de nascimento.';

    const age = date ? calculateAgeFromISODate(date) : null;

    if (date && age === null) nextErrors.birthDate = 'Selecione uma data válida.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) return;

    const age = calculateAgeFromISODate(date);

    updateField('firstName', name.trim());
    updateField('socialName', optionalSocialName.trim());
    updateField('cpf', '');
    updateField('birthDate', date);

    if (age !== null && age < 13) {
      router.push('/onboarding/kids');
      return;
    }

    router.push('/onboarding/username');
  }

  return (
    <OnboardingMinimalStep
      eyebrow="Dados básicos"
      title="Como devemos chamar você?"
    >
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl">
        <div data-iris-onboarding-surface className="rounded-[26px] bg-white/[0.22] px-4 py-2 backdrop-blur-sm">
          <OnboardingFieldLine>
            <Input
              id="firstName"
              name="firstName"
              label="Nome principal"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setErrors((current) => ({ ...current, firstName: undefined }));
              }}
              placeholder="Seu nome"
              autoComplete="given-name"
              error={errors.firstName}
            />
          </OnboardingFieldLine>

          <OnboardingFieldLine>
            <IrisCalendarField
              id="birthDate"
              label="Data de nascimento"
              value={date}
              onChange={(value) => {
                setDate(value);
                setErrors((current) => ({ ...current, birthDate: undefined }));
              }}
              placeholder="Selecionar nascimento"
              helper="Necessário para proteção de idade."
              error={errors.birthDate}
              minDate={minBirthDate}
              maxDate={maxBirthDate}
            />
          </OnboardingFieldLine>

          <OnboardingFieldLine>
            <MinimalOptionalField
              title="Nome social"
              description="Use este campo se quiser que a IRIS respeite outro nome dentro da experiência."
              defaultOpen={Boolean(optionalSocialName)}
            >
              <Input
                id="socialName"
                name="socialName"
                label="Nome social"
                value={optionalSocialName}
                onChange={(event) => setOptionalSocialName(event.target.value)}
                placeholder="Como você prefere ser chamado(a)"
                autoComplete="name"
                helper="Campo opcional."
              />
            </MinimalOptionalField>
          </OnboardingFieldLine>
        </div>

        <OnboardingBottomActions
          helpTitle="O que essa etapa faz"
          help={
            <>
              <p>Esta etapa cria apenas a base mínima do seu perfil.</p>
              <p>Nome e nascimento ajudam a IRIS a montar uma experiência segura. Nome social é opcional.</p>
              <p>CPF e dados sensíveis não fazem parte do cadastro essencial.</p>
            </>
          }
          left={
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="min-h-12 rounded-[18px] px-6 text-[#747D79] hover:text-[#002c1f]"
              onClick={() => router.back()}
            >
              Voltar
            </Button>
          }
          right={
            <Button
              type="submit"
              variant="auth"
              size="lg"
              disabled={!name.trim() || !date}
              className="min-h-12 rounded-[18px] px-8"
            >
              Continuar
            </Button>
          }
        />
      </form>
    </OnboardingMinimalStep>
  );
}
TSX

cat > src/components/iris/profile-completion/ProfileCompletionDrawer.tsx <<'TSX'
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Gift, LockKeyhole, Sparkles } from 'lucide-react';
import { getProfileCompletion } from '@/lib/onboarding/completion';

type ProfileCompletionDrawerProps = {
  state: any;
  open: boolean;
  onClose: () => void;
};

export function ProfileCompletionDrawer({
  state,
  open,
  onClose,
}: ProfileCompletionDrawerProps) {
  const completion = getProfileCompletion(state);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const nextHref = completion.nextRequiredTask?.href || completion.nextTask?.href || '/onboarding/avatar';

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Fechar conclusão de cadastro"
        onClick={onClose}
        className="absolute inset-0 bg-[#0f1512]/24 backdrop-blur-[2px]"
      />

      <aside className="absolute bottom-0 right-0 top-0 flex h-full w-[92vw] max-w-[460px] flex-col border-l border-[#DDE6DA] bg-[#FAF7F2] p-6 shadow-[-24px_0_80px_rgba(0,44,31,0.18)] md:w-full md:p-7">
        <div className="mb-6 flex items-start justify-between gap-5 border-b border-[#DDE6DA] pb-5">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
              IRIS
            </p>

            <h2 className="mt-2 font-display text-3xl leading-tight tracking-[-0.035em] text-[#002c1f]">
              Finalize seu cadastro
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#DDE6DA] bg-white text-[#002c1f] transition-all hover:bg-emerald-800/10"
            aria-label="Fechar drawer"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto pr-1">
          <div className="rounded-[24px] border border-[#DDE6DA] bg-white/60 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-800/[0.08] text-[#002c1f]">
                <Gift size={18} strokeWidth={1.8} />
              </span>

              <div>
                <h3 className="font-display text-2xl tracking-[-0.035em] text-[#002c1f]">
                  Recompensa de perfil completo
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#476153]">
                  Ao finalizar as etapas principais, você poderá ganhar um selo oficial e um tema gratuito.
                </p>

                <p className="mt-2 text-xs leading-5 text-[#747D79]">
                  A liberação real ficará como validação pendente até criarmos a regra server-side.
                </p>
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#DDE6DA]">
              <div
                className="h-full rounded-full bg-[#002c1f] transition-all duration-500"
                style={{ width: `${completion.rewardPercent}%` }}
              />
            </div>

            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
              {completion.requiredCompletedCount}/{completion.requiredTotalCount} etapas obrigatórias
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {completion.tasks.map((task) => (
              <Link
                key={task.key}
                href={task.href}
                className="flex items-start justify-between gap-4 rounded-[22px] border border-[#DDE6DA] bg-white/54 p-4 transition-all hover:bg-emerald-800/[0.055]"
              >
                <div className="flex min-w-0 gap-3">
                  <span
                    className={[
                      'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
                      task.completed
                        ? 'border-emerald-800/18 bg-emerald-800/[0.08] text-[#002c1f]'
                        : 'border-[#DDE6DA] bg-white text-[#747D79]',
                    ].join(' ')}
                  >
                    {task.completed ? (
                      <CheckCircle2 size={16} strokeWidth={1.8} />
                    ) : task.requiredForReward ? (
                      <Sparkles size={15} strokeWidth={1.8} />
                    ) : (
                      <LockKeyhole size={15} strokeWidth={1.8} />
                    )}
                  </span>

                  <span>
                    <span className="block text-sm font-semibold text-[#002c1f]">
                      {task.label}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-[#747D79]">
                      {task.description}
                    </span>
                  </span>
                </div>

                <ArrowRight size={15} strokeWidth={1.8} className="mt-2 shrink-0 text-[#747D79]" />
              </Link>
            ))}
          </div>

          <Link
            href={nextHref}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[18px] bg-emerald-800 px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(0,44,31,0.18)] transition-all hover:bg-emerald-900"
          >
            Continuar personalização
            <ArrowRight size={15} strokeWidth={1.8} />
          </Link>
        </div>
      </aside>
    </div>
  );
}
TSX

cat > src/components/iris/profile-completion/ProfileCompletionCard.tsx <<'TSX'
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Gift, Sparkles } from 'lucide-react';
import { getProfileCompletion } from '@/lib/onboarding/completion';
import { ProfileCompletionDrawer } from './ProfileCompletionDrawer';

type ProfileCompletionCardProps = {
  state: any;
};

export function ProfileCompletionCard({ state }: ProfileCompletionCardProps) {
  const [open, setOpen] = useState(false);
  const completion = getProfileCompletion(state);
  const nextHref = completion.nextRequiredTask?.href || completion.nextTask?.href || '/onboarding/avatar';

  return (
    <>
      <section className="rounded-[28px] border border-white/70 bg-white/[0.24] p-5 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
            {completion.rewardEligible ? (
              <Gift size={19} strokeWidth={1.8} />
            ) : (
              <Sparkles size={19} strokeWidth={1.8} />
            )}
          </span>

          <div className="min-w-0">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
              {completion.rewardEligible ? 'Recompensa disponível' : 'Finalize seu cadastro'}
            </p>

            <h2 className="mt-2 font-display text-3xl leading-[1] tracking-[-0.045em] text-[#002c1f]">
              {completion.rewardEligible
                ? 'Perfil completo em validação.'
                : 'Ganhe selo oficial e tema gratuito.'}
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#476153]">
              {completion.rewardEligible
                ? 'Suas etapas principais foram concluídas. A recompensa fica pendente de validação segura.'
                : 'Complete as etapas principais de personalização para deixar a IRIS mais precisa.'}
            </p>
          </div>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/60">
          <div
            className="h-full rounded-full bg-[#002c1f] transition-all duration-500"
            style={{ width: `${completion.rewardPercent}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            {completion.requiredCompletedCount}/{completion.requiredTotalCount} principais
          </p>

          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            {completion.rewardPercent}%
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Link
            href={nextHref}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[16px] bg-emerald-800 px-4 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(0,44,31,0.16)] transition-all hover:bg-emerald-900"
          >
            Continuar
            <ArrowRight size={15} strokeWidth={1.8} />
          </Link>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex min-h-11 items-center justify-center rounded-[16px] border border-emerald-800/18 px-4 text-sm font-semibold text-[#002c1f] transition-all hover:bg-emerald-800/10"
          >
            Ver progresso
          </button>
        </div>
      </section>

      <ProfileCompletionDrawer
        state={state}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
TSX

cat > src/app/iris/page.tsx <<'TSX'
'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Home, RotateCcw, Sparkles } from 'lucide-react';
import { AccessibilityRuntime } from '@/components/accessibility/AccessibilityRuntime';
import { OnboardingDataPanel } from '@/components/onboarding/finish/OnboardingDataPanel';
import { ProfileCompletionCard } from '@/components/iris/profile-completion/ProfileCompletionCard';
import { useOnboardingStore } from '@/lib/store/onboardingStore';

const LOGO_PATH = '/iris/brand/logotipo/svg/iris-logotipo-colorido.svg';

export default function IrisInitialPage() {
  const onboardingState = useOnboardingStore();

  const displayName =
    onboardingState.socialName ||
    onboardingState.firstName ||
    onboardingState.username ||
    'IRIS';

  return (
    <main
      data-iris-onboarding-root
      className="min-h-screen bg-[#FAF7F2] px-5 py-6 text-[#002c1f] sm:px-8 lg:px-10"
    >
      <AccessibilityRuntime />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" aria-label="Voltar para início">
            <img src={LOGO_PATH} alt="IRIS" className="h-auto w-[70px]" />
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/[0.28] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#747D79] backdrop-blur-sm">
            <Home size={14} strokeWidth={1.8} />
            Tela inicial
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <aside className="space-y-5 lg:sticky lg:top-8">
            <div className="rounded-[34px] border border-white/70 bg-white/[0.24] p-5 backdrop-blur-sm sm:p-7">
              {onboardingState.coverUrl && (
                <div className="mb-5 aspect-[16/7] overflow-hidden rounded-[24px] border border-white/70 bg-white/[0.28]">
                  <img
                    src={onboardingState.coverUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-emerald-800/[0.08] text-xl font-semibold text-[#002c1f]">
                  {onboardingState.avatarUrl ? (
                    <img
                      src={onboardingState.avatarUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    displayName.slice(0, 1).toUpperCase()
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
                    Bem-vindo
                  </p>

                  <h1 className="mt-1 font-display text-4xl leading-[1] tracking-[-0.055em] text-[#002c1f] sm:text-5xl">
                    {displayName}
                  </h1>

                  <p className="mt-2 font-mono text-sm text-[#476153]">
                    @{onboardingState.username || 'username'}
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] border border-white/70 bg-white/[0.28] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
                    Intenção
                  </p>
                  <p className="mt-2 font-display text-2xl text-[#002c1f]">
                    {onboardingState.intention || '—'}
                  </p>
                </div>

                <div className="rounded-[22px] border border-white/70 bg-white/[0.28] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
                    Plano
                  </p>
                  <p className="mt-2 font-display text-2xl text-[#002c1f]">
                    {onboardingState.plan || 'free'}
                  </p>
                </div>

                <div className="rounded-[22px] border border-white/70 bg-white/[0.28] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
                    Privacidade
                  </p>
                  <p className="mt-2 font-display text-2xl text-[#002c1f]">
                    {onboardingState.privacyLevel || 'private'}
                  </p>
                </div>

                <div className="rounded-[22px] border border-white/70 bg-white/[0.28] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
                    Status
                  </p>
                  <p className="mt-2 inline-flex items-center gap-2 font-display text-2xl text-[#002c1f]">
                    <CheckCircle2 size={18} strokeWidth={1.8} />
                    OK
                  </p>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/onboarding/basic-info"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[18px] border border-emerald-800/18 px-5 text-sm font-semibold text-[#002c1f] transition-all hover:bg-emerald-800/10"
                >
                  <RotateCcw size={15} strokeWidth={1.8} />
                  Rever essencial
                </Link>

                <Link
                  href="/onboarding/avatar"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[18px] bg-emerald-800 px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(0,44,31,0.18)] transition-all hover:bg-emerald-900"
                >
                  Personalizar
                  <ArrowRight size={15} strokeWidth={1.8} />
                </Link>
              </div>
            </div>

            <ProfileCompletionCard state={onboardingState} />

            <div className="rounded-[26px] border border-white/70 bg-white/[0.24] p-5 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
                  <Sparkles size={17} strokeWidth={1.8} />
                </span>

                <div>
                  <h2 className="font-display text-2xl tracking-[-0.035em] text-[#002c1f]">
                    Tela inicial simplificada
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#476153]">
                    Esta página valida o fluxo e mostra todos os dados coletados. Depois ela vira o dashboard real.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <section>
            <div className="mb-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
                Todos os dados coletados
              </p>

              <h2 className="mt-2 font-display text-4xl tracking-[-0.055em] text-[#002c1f]">
                Snapshot do onboarding.
              </h2>
            </div>

            <OnboardingDataPanel state={onboardingState} />
          </section>
        </section>
      </div>
    </main>
  );
}
TSX

node <<'NODE'
const fs = require('fs');

function replaceInFile(path, replacements) {
  if (!fs.existsSync(path)) return;

  let file = fs.readFileSync(path, 'utf8');
  let changed = false;

  for (const [from, to] of replacements) {
    if (file.includes(from)) {
      file = file.split(from).join(to);
      changed = true;
    }
  }

  if (changed) fs.writeFileSync(path, file);
}

replaceInFile('src/app/onboarding/username/page.tsx', [
  ["router.push('/onboarding/personality')", "router.push('/onboarding/finish')"],
  ['router.push("/onboarding/personality")', 'router.push("/onboarding/finish")'],
]);

replaceInFile('src/app/onboarding/avatar/page.tsx', [
  ["router.push('/onboarding/username')", "router.push('/onboarding/personality')"],
  ['router.push("/onboarding/username")', 'router.push("/onboarding/personality")'],
]);

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;

  for (const item of fs.readdirSync(dir)) {
    const full = `${dir}/${item}`;
    const stat = fs.statSync(full);

    if (stat.isDirectory()) walk(full, files);
    else if (/\.(tsx|ts|jsx|js)$/.test(full)) files.push(full);
  }

  return files;
}

const appFiles = walk('src/app');

for (const path of appFiles) {
  if (!path.includes('register')) continue;

  replaceInFile(path, [
    ["/onboarding/welcome", "/onboarding/basic-info"],
    ["/onboarding/avatar", "/onboarding/basic-info"],
    ["/onboarding/personality", "/onboarding/basic-info"],
  ]);
}

console.log('✅ Rotas atualizadas: register -> basic-info, basic-info -> username, username -> finish, avatar -> personality.');
NODE

echo "✅ FE-IRIS-048 aplicado: onboarding essencial + completar perfil dentro do app + lib de erros + revisão de segurança."
