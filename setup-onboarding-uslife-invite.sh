#!/usr/bin/env bash
set -euo pipefail

mkdir -p src/app/onboarding/uslife-invite
mkdir -p src/components/onboarding/uslife
mkdir -p src/lib/store

cat > src/lib/store/onboardingStore.ts <<'TS'
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FloraInclinacao, SubscriptionPlan } from '@/types/flora';

interface OnboardingState {
  firstName: string;
  socialName: string;
  cpf: string;
  birthDate: string;
  avatarUrl: string;
  coverUrl: string;
  colorSymbol: string;
  username: string;
  personalityData: any;
  cultureTags: string[];
  cultureData: any;
  integrationPreferences: string[];
  integrationData: any;
  intention: FloraInclinacao;
  intentionData: any;
  privacyLevel: 'private' | 'friends' | 'public';
  privacyData: any;
  accessibilityData: any;
  usLifeInviteData: any;
  plan: SubscriptionPlan;

  updateField: (
    field: keyof Omit<OnboardingState, 'updateField' | 'clearStore'>,
    value: any
  ) => void;
  clearStore: () => void;
}

const initialState = {
  firstName: '',
  socialName: '',
  cpf: '',
  birthDate: '',
  avatarUrl: '',
  coverUrl: '',
  colorSymbol: '#1B3A2E',
  username: '',
  personalityData: {},
  cultureTags: [],
  cultureData: {},
  integrationPreferences: [],
  integrationData: {},
  intention: 'INTROSPECTIVA' as FloraInclinacao,
  intentionData: {},
  privacyLevel: 'private' as const,
  privacyData: {},
  accessibilityData: {},
  usLifeInviteData: {},
  plan: 'free' as SubscriptionPlan,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialState,
      updateField: (field, value) => set((state) => ({ ...state, [field]: value })),
      clearStore: () => set({ ...initialState }),
    }),
    { name: 'iris-onboarding-storage' }
  )
);
TS

cat > src/components/onboarding/uslife/UsLifeChoiceQuestion.tsx <<'TSX'
'use client';

import type { LucideIcon } from 'lucide-react';

type UsLifeChoiceOption = {
  value: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
};

type UsLifeChoiceQuestionProps = {
  title: string;
  value: string;
  options: UsLifeChoiceOption[];
  onChange: (value: string) => void;
};

export function UsLifeChoiceQuestion({
  title,
  value,
  options,
  onChange,
}: UsLifeChoiceQuestionProps) {
  return (
    <fieldset className="space-y-6">
      <legend className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
        {title}
      </legend>

      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const selected = value === option.value;
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={selected}
              className={[
                'min-h-20 rounded-[22px] border px-5 py-4 text-left transition-all duration-200',
                selected
                  ? 'border-emerald-800 bg-emerald-800 text-white shadow-[0_12px_28px_rgba(0,44,31,0.18)]'
                  : 'border-white/70 bg-white/[0.28] text-[#002c1f] hover:border-emerald-800/20 hover:bg-emerald-800/[0.065]',
              ].join(' ')}
            >
              <span className="flex items-start gap-3">
                {Icon && (
                  <Icon
                    size={17}
                    strokeWidth={1.8}
                    className={selected ? 'mt-0.5 text-white' : 'mt-0.5 text-[#002c1f]'}
                  />
                )}

                <span>
                  <span className="block text-sm font-semibold">
                    {option.label}
                  </span>

                  {option.description && (
                    <span
                      className={[
                        'mt-1 block text-xs leading-5',
                        selected ? 'text-white/78' : 'text-[#747D79]',
                      ].join(' ')}
                    >
                      {option.description}
                    </span>
                  )}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
TSX

cat > src/components/onboarding/uslife/UsLifeInviteForm.tsx <<'TSX'
'use client';

import { Mail, UserRound } from 'lucide-react';
import { Input } from '@/components/ui/Input';

type UsLifeInviteFormProps = {
  partnerName: string;
  partnerContact: string;
  contactError?: string;
  onPartnerNameChange: (value: string) => void;
  onPartnerContactChange: (value: string) => void;
};

export function UsLifeInviteForm({
  partnerName,
  partnerContact,
  contactError,
  onPartnerNameChange,
  onPartnerContactChange,
}: UsLifeInviteFormProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
          <Mail size={17} strokeWidth={1.8} />
        </span>

        <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
          Para quem será o convite?
        </h2>
      </div>

      <div className="space-y-4">
        <Input
          id="partnerName"
          name="partnerName"
          label="Nome da pessoa"
          value={partnerName}
          onChange={(event) => onPartnerNameChange(event.target.value)}
          placeholder="Nome ou apelido"
          autoComplete="name"
          helper="Opcional. Serve apenas para personalizar o convite."
        />

        <Input
          id="partnerContact"
          name="partnerContact"
          label="E-mail ou @"
          value={partnerContact}
          onChange={(event) => onPartnerContactChange(event.target.value)}
          placeholder="email@exemplo.com ou @username"
          autoComplete="email"
          error={contactError}
          helper="Use e-mail para convite externo ou @ para pessoa já cadastrada."
        />

        <div className="rounded-[22px] border border-white/70 bg-white/[0.26] p-4">
          <div className="flex items-start gap-3">
            <UserRound size={17} strokeWidth={1.8} className="mt-0.5 text-[#002c1f]" />

            <p className="text-sm leading-6 text-[#476153]">
              O convite será preparado, mas o envio real pode ser conectado depois ao sistema de e-mail/notificação.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
TSX

cat > src/components/onboarding/uslife/UsLifePermissionGrid.tsx <<'TSX'
'use client';

import type { LucideIcon } from 'lucide-react';

type PermissionOption = {
  value: string;
  label: string;
  icon?: LucideIcon;
};

type UsLifePermissionGridProps = {
  title: string;
  value: string[];
  options: PermissionOption[];
  onChange: (value: string[]) => void;
};

export function UsLifePermissionGrid({
  title,
  value,
  options,
  onChange,
}: UsLifePermissionGridProps) {
  function toggle(permission: string) {
    if (value.includes(permission)) {
      onChange(value.filter((item) => item !== permission));
      return;
    }

    onChange([...value, permission]);
  }

  return (
    <fieldset className="space-y-5">
      <legend className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
        {title}
      </legend>

      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const selected = value.includes(option.value);
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggle(option.value)}
              aria-pressed={selected}
              className={[
                'flex min-h-14 items-center gap-3 rounded-[20px] border px-4 text-left text-sm font-semibold transition-all duration-200',
                selected
                  ? 'border-emerald-800 bg-emerald-800 text-white shadow-[0_10px_24px_rgba(0,44,31,0.18)]'
                  : 'border-white/70 bg-white/[0.28] text-[#002c1f] hover:border-emerald-800/20 hover:bg-emerald-800/[0.065]',
              ].join(' ')}
            >
              {Icon && <Icon size={17} strokeWidth={1.8} />}
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
TSX

cat > src/components/onboarding/uslife/UsLifeFinalReview.tsx <<'TSX'
import { CheckCircle2 } from 'lucide-react';

type UsLifeFinalReviewProps = {
  inviteMode: string;
  relationshipType: string;
  partnerName: string;
  partnerContact: string;
  permissions: string[];
  labels: Record<string, string>;
};

export function UsLifeFinalReview({
  inviteMode,
  relationshipType,
  partnerName,
  partnerContact,
  permissions,
  labels,
}: UsLifeFinalReviewProps) {
  const items = [
    labels[inviteMode] || inviteMode,
    labels[relationshipType] || relationshipType,
    partnerName,
    partnerContact,
    ...permissions.map((permission) => labels[permission] || permission),
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
          <CheckCircle2 size={17} strokeWidth={1.8} />
        </span>

        <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
          usLIFE preparado.
        </h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/70 bg-white/[0.30] px-3 py-1.5 text-xs font-semibold text-[#002c1f]"
          >
            {item}
          </span>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-[22px] border border-white/70 bg-white/[0.26] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Modo
          </p>
          <p className="mt-2 font-display text-2xl text-[#002c1f]">
            {labels[inviteMode] || '—'}
          </p>
        </div>

        <div className="rounded-[22px] border border-white/70 bg-white/[0.26] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Vínculo
          </p>
          <p className="mt-2 font-display text-2xl text-[#002c1f]">
            {labels[relationshipType] || '—'}
          </p>
        </div>

        <div className="rounded-[22px] border border-white/70 bg-white/[0.26] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            Permissões
          </p>
          <p className="mt-2 font-display text-3xl text-[#002c1f]">
            {permissions.length}
          </p>
        </div>
      </div>
    </div>
  );
}
TSX

cat > src/app/onboarding/uslife-invite/page.tsx <<'TSX'
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  BookHeart,
  CalendarDays,
  HeartHandshake,
  Images,
  Link2,
  LockKeyhole,
  Mail,
  MessageCircleHeart,
  Sparkles,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { OnboardingBottomActions } from '@/components/onboarding/OnboardingBottomActions';
import { OnboardingFieldLine } from '@/components/onboarding/OnboardingFieldLine';
import { OnboardingMinimalStep } from '@/components/onboarding/OnboardingMinimalStep';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { UsLifeChoiceQuestion } from '@/components/onboarding/uslife/UsLifeChoiceQuestion';
import { UsLifeInviteForm } from '@/components/onboarding/uslife/UsLifeInviteForm';
import { UsLifePermissionGrid } from '@/components/onboarding/uslife/UsLifePermissionGrid';
import { UsLifeFinalReview } from '@/components/onboarding/uslife/UsLifeFinalReview';

type UsLifeDraft = {
  inviteMode: string;
  relationshipType: string;
  partnerName: string;
  partnerContact: string;
  permissions: string[];
};

type UsLifeStepKey = 'mode' | 'relationship' | 'invite' | 'permissions' | 'review';

const labels: Record<string, string> = {
  solo: 'Seguir sozinho',
  invite_now: 'Convidar agora',
  prepare_later: 'Preparar depois',
  romantic: 'Par romântico',
  family: 'Família',
  close_friend: 'Amizade próxima',
  creative_pair: 'Dupla criativa',
  memories: 'Memórias',
  albums: 'Álbuns',
  letters: 'Cartas',
  dreams: 'Sonhos',
  calendar: 'Datas importantes',
  private_review: 'Revisão antes de publicar',
};

const steps: Array<{ key: UsLifeStepKey; shortLabel: string }> = [
  { key: 'mode', shortLabel: 'Modo' },
  { key: 'relationship', shortLabel: 'Vínculo' },
  { key: 'invite', shortLabel: 'Convite' },
  { key: 'permissions', shortLabel: 'Permissões' },
  { key: 'review', shortLabel: 'Revisão' },
];

function createInitialDraft(usLifeInviteData: any): UsLifeDraft {
  return {
    inviteMode: usLifeInviteData?.inviteMode || 'prepare_later',
    relationshipType: usLifeInviteData?.relationshipType || 'romantic',
    partnerName: usLifeInviteData?.partnerName || '',
    partnerContact: usLifeInviteData?.partnerContact || '',
    permissions: Array.isArray(usLifeInviteData?.permissions)
      ? usLifeInviteData.permissions
      : ['memories', 'albums', 'private_review'],
  };
}

function isValidContact(value: string) {
  const trimmed = value.trim();

  if (!trimmed) return false;
  if (trimmed.startsWith('@')) return /^@[a-z0-9_]{3,24}$/i.test(trimmed);

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

function createInviteCode() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `uslife_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function UsLifeInvitePage() {
  const router = useRouter();
  const { usLifeInviteData, updateField } = useOnboardingStore();

  const [draft, setDraft] = useState<UsLifeDraft>(() => createInitialDraft(usLifeInviteData));
  const [stepIndex, setStepIndex] = useState(0);
  const [alert, setAlert] = useState('');
  const [contactError, setContactError] = useState('');

  const currentStep = steps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isReviewStep = currentStep.key === 'review';
  const needsInviteContact = draft.inviteMode === 'invite_now';

  const completed =
    Boolean(draft.inviteMode) &&
    Boolean(draft.relationshipType) &&
    draft.permissions.length > 0 &&
    (!needsInviteContact || isValidContact(draft.partnerContact));

  function updateDraft<Key extends keyof UsLifeDraft>(key: Key, value: UsLifeDraft[Key]) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));

    setAlert('');
    setContactError('');
  }

  function currentStepIsReady() {
    if (currentStep.key === 'mode') return Boolean(draft.inviteMode);
    if (currentStep.key === 'relationship') return Boolean(draft.relationshipType);

    if (currentStep.key === 'invite') {
      if (!needsInviteContact) return true;
      return isValidContact(draft.partnerContact);
    }

    if (currentStep.key === 'permissions') return draft.permissions.length > 0;

    return completed;
  }

  function goNext() {
    if (!currentStepIsReady()) {
      if (currentStep.key === 'invite' && needsInviteContact) {
        setContactError('Informe um e-mail válido ou um @ com pelo menos 3 caracteres.');
        return;
      }

      if (currentStep.key === 'permissions') {
        setAlert('Escolha pelo menos uma permissão inicial.');
        return;
      }

      setAlert('Escolha uma opção para continuar.');
      return;
    }

    setAlert('');
    setContactError('');
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  }

  function goBack() {
    setAlert('');
    setContactError('');

    if (isFirstStep) {
      router.back();
      return;
    }

    setStepIndex((current) => Math.max(current - 1, 0));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!completed) {
      setAlert('Finalize as escolhas do usLIFE para continuar.');
      return;
    }

    const finalUsLifeInviteData = {
      ...draft,
      inviteCode: draft.inviteMode === 'invite_now' ? createInviteCode() : null,
      inviteStatus:
        draft.inviteMode === 'invite_now'
          ? 'prepared'
          : draft.inviteMode === 'solo'
            ? 'skipped'
            : 'pending',
      labels: {
        inviteMode: labels[draft.inviteMode],
        relationshipType: labels[draft.relationshipType],
        permissions: draft.permissions.map((permission) => labels[permission] || permission),
      },
      completedAt: new Date().toISOString(),
    };

    updateField('usLifeInviteData', finalUsLifeInviteData);

    router.push('/onboarding/plan');
  }

  function renderCurrentStep() {
    switch (currentStep.key) {
      case 'mode':
        return (
          <UsLifeChoiceQuestion
            title="Como quer começar o usLIFE?"
            value={draft.inviteMode}
            onChange={(value) => updateDraft('inviteMode', value)}
            options={[
              {
                value: 'solo',
                label: 'Seguir sozinho',
                description: 'Comece com seu espaço pessoal e convide alguém depois.',
                icon: UserRound,
              },
              {
                value: 'invite_now',
                label: 'Convidar agora',
                description: 'Prepare um convite para criar um espaço compartilhado.',
                icon: Mail,
              },
              {
                value: 'prepare_later',
                label: 'Preparar depois',
                description: 'Deixe o usLIFE configurado, sem enviar convite ainda.',
                icon: Link2,
              },
            ]}
          />
        );

      case 'relationship':
        return (
          <UsLifeChoiceQuestion
            title="Que tipo de vínculo é esse?"
            value={draft.relationshipType}
            onChange={(value) => updateDraft('relationshipType', value)}
            options={[
              {
                value: 'romantic',
                label: 'Par romântico',
                description: 'Namoro, casamento ou uma relação afetiva principal.',
                icon: MessageCircleHeart,
              },
              {
                value: 'family',
                label: 'Família',
                description: 'Memórias e rotinas com alguém da família.',
                icon: UsersRound,
              },
              {
                value: 'close_friend',
                label: 'Amizade próxima',
                description: 'Um vínculo de confiança, história e presença.',
                icon: HeartHandshake,
              },
              {
                value: 'creative_pair',
                label: 'Dupla criativa',
                description: 'Uma pessoa para criar, registrar e construir junto.',
                icon: Sparkles,
              },
            ]}
          />
        );

      case 'invite':
        if (!needsInviteContact) {
          return (
            <UsLifeChoiceQuestion
              title="Quer deixar o convite em espera?"
              value={draft.inviteMode}
              onChange={(value) => updateDraft('inviteMode', value)}
              options={[
                {
                  value: 'solo',
                  label: 'Sim, seguir sozinho',
                  description: 'O usLIFE fica disponível para ativar depois.',
                  icon: UserRound,
                },
                {
                  value: 'prepare_later',
                  label: 'Sim, preparar depois',
                  description: 'A IRIS guarda as preferências sem criar convite agora.',
                  icon: Link2,
                },
                {
                  value: 'invite_now',
                  label: 'Prefiro convidar agora',
                  description: 'Abrir campo para informar e-mail ou @.',
                  icon: Mail,
                },
              ]}
            />
          );
        }

        return (
          <UsLifeInviteForm
            partnerName={draft.partnerName}
            partnerContact={draft.partnerContact}
            contactError={contactError}
            onPartnerNameChange={(value) => updateDraft('partnerName', value)}
            onPartnerContactChange={(value) => updateDraft('partnerContact', value)}
          />
        );

      case 'permissions':
        return (
          <UsLifePermissionGrid
            title="O que esse espaço poderá compartilhar?"
            value={draft.permissions}
            onChange={(value) => updateDraft('permissions', value)}
            options={[
              { value: 'memories', label: 'Memórias', icon: BookHeart },
              { value: 'albums', label: 'Álbuns', icon: Images },
              { value: 'letters', label: 'Cartas', icon: Mail },
              { value: 'dreams', label: 'Sonhos', icon: Sparkles },
              { value: 'calendar', label: 'Datas importantes', icon: CalendarDays },
              { value: 'private_review', label: 'Revisão antes de publicar', icon: LockKeyhole },
            ]}
          />
        );

      case 'review':
        return (
          <UsLifeFinalReview
            inviteMode={draft.inviteMode}
            relationshipType={draft.relationshipType}
            partnerName={draft.partnerName}
            partnerContact={draft.partnerContact}
            permissions={draft.permissions}
            labels={labels}
          />
        );

      default:
        return null;
    }
  }

  return (
    <OnboardingMinimalStep
      eyebrow="usLIFE"
      title="Convide quando fizer sentido."
    >
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl">
        {alert && (
          <div className="mb-4 rounded-[20px] border border-[#E8CF8B] bg-[#FFF7DC]/70 px-4 py-3 text-sm leading-6 text-[#7A5A12]">
            {alert}
          </div>
        )}

        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between gap-4 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-[#747D79]">
            <span>{String(stepIndex + 1).padStart(2, '0')}</span>
            <span>{currentStep.shortLabel}</span>
            <span>{String(steps.length).padStart(2, '0')}</span>
          </div>

          <div className="h-[5px] overflow-hidden rounded-full bg-white/54">
            <div
              className="h-full rounded-full bg-[#002c1f] transition-all duration-300"
              style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div data-iris-onboarding-surface className="rounded-[26px] bg-white/[0.22] px-4 py-2 backdrop-blur-sm">
          <OnboardingFieldLine>
            {renderCurrentStep()}
          </OnboardingFieldLine>
        </div>

        <OnboardingBottomActions
          helpTitle="O que essa etapa faz"
          help={
            <>
              <p>
                O usLIFE prepara um espaço compartilhado para memórias, cartas, datas, sonhos e registros em conjunto.
              </p>
              <p>
                Você pode convidar alguém agora, deixar o convite para depois ou seguir sozinho.
              </p>
              <p>
                Nenhuma pessoa ganha acesso sem confirmação. O convite apenas prepara o vínculo.
              </p>
            </>
          }
          left={
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="min-h-12 rounded-[18px] px-6 text-[#747D79] hover:text-[#002c1f]"
              onClick={goBack}
            >
              <ArrowLeft size={16} strokeWidth={1.8} />
              {isFirstStep ? 'Voltar' : 'Anterior'}
            </Button>
          }
          right={
            isReviewStep ? (
              <Button
                type="submit"
                variant="auth"
                size="lg"
                disabled={!completed}
                className="min-h-12 rounded-[18px] px-8"
              >
                Continuar
              </Button>
            ) : (
              <Button
                type="button"
                variant="auth"
                size="lg"
                disabled={!currentStepIsReady()}
                className="min-h-12 rounded-[18px] px-8"
                onClick={goNext}
              >
                Próxima
                <ArrowRight size={16} strokeWidth={1.8} />
              </Button>
            )
          }
        />
      </form>
    </OnboardingMinimalStep>
  );
}
TSX

echo "✅ FE-IRIS-042 aplicado: uslife-invite criado com convite opcional, vínculo, permissões e revisão."
