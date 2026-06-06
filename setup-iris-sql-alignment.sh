#!/usr/bin/env bash
set -euo pipefail

mkdir -p src/lib/onboarding
mkdir -p src/components/iris
mkdir -p src/components/settings
mkdir -p src/lib/settings

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

  const cleanName = state.firstName?.trim() || null;
  const essentialCompleted = Boolean(cleanName && state.birthDate && state.username);

  const onboardingStatus = completion.rewardEligible
    ? 'completed'
    : essentialCompleted
      ? 'essential_completed'
      : 'draft';

  return {
    id: profileId,

    // Compatibilidade com seu SQL atual:
    // full_name existe na base antiga e first_name existe na base nova.
    full_name: cleanName,
    first_name: cleanName,

    social_name: state.socialName || null,
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

    // Compatibilidade com campo boolean antigo:
    onboarding_completed: essentialCompleted,

    onboarding_status: onboardingStatus,
    onboarding_completed_at: essentialCompleted ? now : null,

    profile_completion_status: completion.status,
    profile_completion_data: completion,
    profile_completion_reward_status: completion.rewardStatus,

    profile_badges: [],
    unlocked_themes: [],

    updated_at: now,
  };
}
TS

python - <<'PY'
from pathlib import Path

path = Path("src/components/iris/IrisProfileProvider.tsx")
if path.exists():
    text = path.read_text()

    text = text.replace(
        "const hasBasicInfo = Boolean(data.first_name && data.birth_date);",
        "const profileName = data.first_name || data.full_name;\n        const hasBasicInfo = Boolean(profileName && data.birth_date);"
    )

    text = text.replace(
        "['firstName', data.first_name || ''],",
        "['firstName', data.first_name || data.full_name || ''],"
    )

    path.write_text(text)
    print("✅ IrisProfileProvider atualizado com fallback full_name.")

path = Path("src/lib/auth/routes.ts")
if path.exists():
    text = path.read_text()

    text = text.replace(
        "first_name?: string | null;",
        "first_name?: string | null;\n  full_name?: string | null;"
    )

    text = text.replace(
        "const hasBasicInfo = Boolean(profile.first_name && profile.birth_date);",
        "const hasBasicInfo = Boolean((profile.first_name || profile.full_name) && profile.birth_date);"
    )

    path.write_text(text)
    print("✅ routes.ts atualizado com fallback full_name.")

for p in [
    Path("src/lib/auth/resolvePostAuthDestination.ts"),
    Path("middleware.ts"),
    Path("src/app/api/auth/post-auth-destination/route.ts"),
]:
    if p.exists():
        text = p.read_text()
        text = text.replace(
            "select('first_name,birth_date,username,onboarding_status')",
            "select('first_name,full_name,birth_date,username,onboarding_status')"
        )
        p.write_text(text)
        print(f"✅ {p} atualizado para buscar full_name.")
PY

cat > src/lib/settings/settingsCatalog.ts <<'TS'
export type SettingStatus = 'ready' | 'recommended' | 'planned' | 'sensitive';

export type SettingsOption = {
  key: string;
  title: string;
  subtitle: string;
  description: string;
  group: string;
  icon: string;
  status: SettingStatus;
  href?: string;
  columns?: string[];
  source?: 'profiles' | 'subscriptions' | 'uslife_invites' | 'plan_interest_requests';
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
];

export const settingsOptions: SettingsOption[] = [
  {
    key: 'account',
    title: 'Conta',
    subtitle: 'Identidade da conta.',
    description: 'Dados centrais da conta e campos estruturais do perfil.',
    group: 'Conta',
    icon: 'UserRound',
    status: 'ready',
    source: 'profiles',
    columns: ['id', 'full_name', 'first_name', 'social_name', 'username', 'birth_date', 'country', 'language'],
  },
  {
    key: 'security',
    title: 'Segurança',
    subtitle: 'Sessão e proteção.',
    description: 'Área sensível para sessão, login, senha e proteção da conta.',
    group: 'Conta',
    icon: 'ShieldCheck',
    status: 'sensitive',
    source: 'profiles',
    columns: ['id', 'created_at', 'updated_at'],
  },
  {
    key: 'profile',
    title: 'Perfil essencial',
    subtitle: 'Nome, nascimento e username.',
    description: 'Edite os dados essenciais usados para identificar seu espaço.',
    group: 'Perfil',
    icon: 'BadgeCheck',
    status: 'ready',
    href: '/onboarding/basic-info?edit=1',
    source: 'profiles',
    columns: ['full_name', 'first_name', 'social_name', 'birth_date', 'username'],
  },
  {
    key: 'media',
    title: 'Avatar e capa',
    subtitle: 'Imagem e identidade visual.',
    description: 'Configure imagem de perfil, capa e símbolo visual.',
    group: 'Perfil',
    icon: 'Image',
    status: 'recommended',
    href: '/onboarding/avatar',
    source: 'profiles',
    columns: ['avatar_url', 'cover_url', 'color_symbol'],
  },
  {
    key: 'flora',
    title: 'Flora',
    subtitle: 'Espécie, estágio e inclinação.',
    description: 'Campos originais da identidade viva da IRIS.',
    group: 'Personalização',
    icon: 'Leaf',
    status: 'ready',
    source: 'profiles',
    columns: ['especie', 'estagio', 'inclinacao'],
  },
  {
    key: 'personality',
    title: 'Personalidade',
    subtitle: 'Como a IRIS entende você.',
    description: 'Sinais de personalidade, energia, percepção, decisão e ritmo social.',
    group: 'Personalização',
    icon: 'Brain',
    status: 'recommended',
    href: '/onboarding/personality',
    source: 'profiles',
    columns: ['personality_data', 'personality_completed_at'],
  },
  {
    key: 'culture',
    title: 'Cultura',
    subtitle: 'Temas e repertório.',
    description: 'Temas culturais, formatos preferidos, tom e ritmo da experiência.',
    group: 'Personalização',
    icon: 'Sparkles',
    status: 'recommended',
    href: '/onboarding/culture',
    source: 'profiles',
    columns: ['culture_tags', 'culture_data', 'culture_completed_at'],
  },
  {
    key: 'intention',
    title: 'Intenção',
    subtitle: 'Direção da experiência.',
    description: 'O que a IRIS deve priorizar na experiência do usuário.',
    group: 'Personalização',
    icon: 'Compass',
    status: 'recommended',
    href: '/onboarding/intention',
    source: 'profiles',
    columns: ['intention', 'intention_data', 'intention_completed_at'],
  },
  {
    key: 'privacy',
    title: 'Privacidade',
    subtitle: 'Visibilidade e limites.',
    description: 'Controle privacidade, memórias, IA e proteções extras.',
    group: 'Privacidade',
    icon: 'LockKeyhole',
    status: 'recommended',
    href: '/onboarding/privacy',
    source: 'profiles',
    columns: ['privacy_level', 'privacy_data', 'privacy_completed_at'],
  },
  {
    key: 'accessibility',
    title: 'Acessibilidade',
    subtitle: 'Tema, fonte e leitura.',
    description: 'Tema, dislexia, tamanho da fonte, espaçamento, contraste e movimento.',
    group: 'Experiência',
    icon: 'Accessibility',
    status: 'ready',
    href: '/onboarding/accessibility',
    source: 'profiles',
    columns: ['accessibility_data', 'accessibility_completed_at', 'theme_preference'],
  },
  {
    key: 'appearance',
    title: 'Aparência',
    subtitle: 'Tema visual.',
    description: 'Preferência visual principal da experiência.',
    group: 'Experiência',
    icon: 'Palette',
    status: 'ready',
    href: '/onboarding/accessibility',
    source: 'profiles',
    columns: ['theme_preference', 'accessibility_data'],
  },
  {
    key: 'integrations',
    title: 'Integrações',
    subtitle: 'Conexões futuras.',
    description: 'Preferências de calendário, fotos, contatos, localização, e-mail e arquivos.',
    group: 'Dados',
    icon: 'Plug',
    status: 'planned',
    href: '/onboarding/integrations',
    source: 'profiles',
    columns: ['integration_preferences', 'integration_data', 'integrations_completed_at'],
  },
  {
    key: 'subscription',
    title: 'Assinatura',
    subtitle: 'Plano ativo e ciclo.',
    description: 'Dados da tabela subscriptions: plano, status, trial e período atual.',
    group: 'Produto',
    icon: 'CreditCard',
    status: 'ready',
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
    href: '/onboarding/plan',
    source: 'profiles',
    columns: ['plan_key', 'plan_data', 'plan_completed_at'],
  },
  {
    key: 'uslife',
    title: 'usLIFE',
    subtitle: 'Convites e espaço compartilhado.',
    description: 'Preferências de convite, vínculo e permissões usLIFE.',
    group: 'Produto',
    icon: 'HeartHandshake',
    status: 'recommended',
    href: '/onboarding/uslife-invite',
    source: 'profiles',
    columns: ['uslife_invite_data', 'uslife_invite_completed_at'],
  },
  {
    key: 'completion',
    title: 'Conclusão do perfil',
    subtitle: 'Selo e tema gratuito.',
    description: 'Progresso do perfil, recompensa, badges e temas desbloqueados.',
    group: 'Produto',
    icon: 'Gift',
    status: 'ready',
    source: 'profiles',
    columns: ['onboarding_status', 'onboarding_completed', 'profile_completion_status', 'profile_completion_reward_status', 'profile_badges', 'unlocked_themes'],
  },
  {
    key: 'data',
    title: 'Dados e exportação',
    subtitle: 'Controle dos dados.',
    description: 'Área futura para exportar, apagar e revisar dados.',
    group: 'Dados',
    icon: 'Database',
    status: 'planned',
  },
  {
    key: 'notifications',
    title: 'Notificações',
    subtitle: 'Alertas e lembretes.',
    description: 'Configuração futura de push, e-mail, lembretes e modo silencioso.',
    group: 'Sistema',
    icon: 'Bell',
    status: 'planned',
  },
  {
    key: 'diagnostics',
    title: 'Diagnóstico',
    subtitle: 'Debug e ambiente.',
    description: 'Área técnica para sessão, cache, Supabase e integridade.',
    group: 'Sistema',
    icon: 'Activity',
    status: 'planned',
  },
];

export const quickSettingsKeys = [
  'profile',
  'media',
  'privacy',
  'accessibility',
  'personality',
  'culture',
  'intention',
  'subscription',
  'uslife',
  'plan',
  'completion',
  'flora',
  'appearance',
  'integrations',
  'data',
  'notifications',
];

export function getSettingByKey(key: string) {
  return settingsOptions.find((option) => option.key === key) || settingsOptions[0];
}

export function getQuickSettings() {
  return quickSettingsKeys.map((key) => getSettingByKey(key)).filter(Boolean);
}
TS

python - <<'PY'
from pathlib import Path

path = Path("src/components/settings/SettingsIcon.tsx")
if path.exists():
    text = path.read_text()
    additions = {
        "CreditCard": "Icons.CreditCard",
        "Leaf": "Icons.Leaf",
    }

    for key, value in additions.items():
        if f"{key}:" not in text:
            text = text.replace(
                "Crown: Icons.Crown,",
                f"Crown: Icons.Crown,\n  {key}: {value},"
            )

    path.write_text(text)
    print("✅ SettingsIcon atualizado.")
PY

cat > src/components/settings/SettingsDetailPanel.tsx <<'TSX'
import Link from 'next/link';
import { ArrowRight, Database, ShieldCheck } from 'lucide-react';
import type { SettingsOption } from '@/lib/settings/settingsCatalog';
import { SettingsIcon } from './SettingsIcon';

type SettingsDetailPanelProps = {
  option: SettingsOption;
  profile?: any;
  subscription?: any;
  uslifeInvites?: any[];
  planInterestRequests?: any[];
};

function formatValue(value: any) {
  if (value === null || value === undefined || value === '') return '—';

  if (Array.isArray(value)) {
    if (!value.length) return '—';
    return JSON.stringify(value, null, 2);
  }

  if (typeof value === 'object') {
    const keys = Object.keys(value);
    if (!keys.length) return '—';
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

function resolveSourceData({
  option,
  profile,
  subscription,
  uslifeInvites,
  planInterestRequests,
}: SettingsDetailPanelProps) {
  if (option.source === 'subscriptions') return subscription;
  if (option.source === 'uslife_invites') return uslifeInvites;
  if (option.source === 'plan_interest_requests') return planInterestRequests;
  return profile;
}

export function SettingsDetailPanel(props: SettingsDetailPanelProps) {
  const { option } = props;
  const sourceData = resolveSourceData(props);

  return (
    <aside className="rounded-[32px] border border-white/70 bg-white/[0.26] p-5 backdrop-blur-sm lg:sticky lg:top-6">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
          <SettingsIcon name={option.icon} size={20} />
        </span>

        <div className="min-w-0">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
            {option.group}
          </p>

          <h2 className="mt-2 font-display text-4xl leading-[1] tracking-[-0.055em] text-[#002c1f]">
            {option.title}
          </h2>

          <p className="mt-3 text-sm leading-7 text-[#476153]">
            {option.description}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        <div className="rounded-[24px] border border-white/70 bg-white/[0.30] p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck size={17} strokeWidth={1.8} className="mt-0.5 text-[#002c1f]" />

            <div>
              <p className="text-sm font-semibold text-[#002c1f]">
                Status
              </p>

              <p className="mt-1 text-sm leading-6 text-[#747D79]">
                {option.status === 'ready' && 'Esta configuração está ativa ou pronta para uso.'}
                {option.status === 'recommended' && 'Recomendado para melhorar sua experiência.'}
                {option.status === 'planned' && 'Área planejada para próxima fase.'}
                {option.status === 'sensitive' && 'Área sensível. Requer cuidado extra.'}
              </p>
            </div>
          </div>
        </div>

        {option.columns?.length ? (
          <div className="rounded-[24px] border border-white/70 bg-white/[0.30] p-4">
            <div className="mb-4 flex items-center gap-2">
              <Database size={17} strokeWidth={1.8} className="text-[#002c1f]" />
              <p className="text-sm font-semibold text-[#002c1f]">
                Dados relacionados
              </p>
            </div>

            <div className="space-y-3">
              {option.columns.map((column) => (
                <div
                  key={column}
                  className="rounded-[18px] border border-white/70 bg-white/[0.26] p-3"
                >
                  <p className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[#747D79]">
                    {option.source || 'profiles'} · {column}
                  </p>

                  <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-[#002c1f]">
                    {formatValue(sourceData?.[column])}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {option.href ? (
          <Link
            href={option.href}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[18px] bg-emerald-800 px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(0,44,31,0.18)] transition-all hover:bg-emerald-900"
          >
            Abrir configuração
            <ArrowRight size={15} strokeWidth={1.8} />
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex min-h-12 items-center justify-center rounded-[18px] border border-white/70 bg-white/[0.24] px-5 text-sm font-semibold text-[#9AA4A1]"
          >
            Em breve
          </button>
        )}
      </div>
    </aside>
  );
}
TSX

python - <<'PY'
from pathlib import Path

path = Path("src/app/(app)/settings/page.tsx")
if not path.exists():
    print("⚠️ settings/page.tsx não encontrado. Rode o setup da settings antes.")
    raise SystemExit(0)

text = path.read_text()

text = text.replace(
    "const [profile, setProfile] = useState<any>(null);",
    "const [profile, setProfile] = useState<any>(null);\n  const [subscription, setSubscription] = useState<any>(null);\n  const [uslifeInvites, setUslifeInvites] = useState<any[]>([]);\n  const [planInterestRequests, setPlanInterestRequests] = useState<any[]>([]);"
)

old = """    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.warn('[IRIS_SETTINGS_PROFILE_LOAD]', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });

      setSyncMessage('Não foi possível carregar seu perfil agora.');
      setProfile(null);
      setLoading(false);
      return;
    }

    setProfile(data);
    setLoading(false);
    setSyncMessage('Perfil sincronizado');"""

new = """    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.warn('[IRIS_SETTINGS_PROFILE_LOAD]', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });

      setSyncMessage('Não foi possível carregar seu perfil agora.');
      setProfile(null);
      setLoading(false);
      return;
    }

    const { data: subscriptionData } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    const { data: uslifeData } = await supabase
      .from('uslife_invites')
      .select('*')
      .eq('inviter_profile_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    const { data: planRequestsData } = await supabase
      .from('plan_interest_requests')
      .select('*')
      .eq('profile_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    setProfile(data);
    setSubscription(subscriptionData || null);
    setUslifeInvites(uslifeData || []);
    setPlanInterestRequests(planRequestsData || []);
    setLoading(false);
    setSyncMessage('Perfil sincronizado');"""

if old in text:
    text = text.replace(old, new)
else:
    print("⚠️ Bloco de loadProfile não encontrado exatamente. Ajuste manual pode ser necessário.")

text = text.replace(
    """          <SettingsDetailPanel
            option={selectedOption}
            profile={profile}
          />""",
    """          <SettingsDetailPanel
            option={selectedOption}
            profile={profile}
            subscription={subscription}
            uslifeInvites={uslifeInvites}
            planInterestRequests={planInterestRequests}
          />"""
)

path.write_text(text)
print("✅ settings/page.tsx alinhado ao SQL atualizado.")
PY

echo "✅ FE-IRIS-052 aplicado: alinhamento com SQL atualizado, full_name, subscriptions e settings."
