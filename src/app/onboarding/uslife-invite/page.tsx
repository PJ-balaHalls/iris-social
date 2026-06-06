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
