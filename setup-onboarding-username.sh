#!/usr/bin/env bash
set -euo pipefail

mkdir -p src/app/onboarding/username
mkdir -p src/app/onboarding/username/components
mkdir -p src/lib/username

cat > src/lib/username/username.ts <<'TS'
export type UsernameValidationResult = {
  valid: boolean;
  message: string;
};

export function normalizeUsername(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 24);
}

export function validateUsername(username: string): UsernameValidationResult {
  if (!username) {
    return {
      valid: false,
      message: 'Escolha um nome de usuário para continuar.',
    };
  }

  if (username.length < 3) {
    return {
      valid: false,
      message: 'Use pelo menos 3 caracteres.',
    };
  }

  if (username.length > 24) {
    return {
      valid: false,
      message: 'Use no máximo 24 caracteres.',
    };
  }

  if (!/^[a-z]/.test(username)) {
    return {
      valid: false,
      message: 'Comece com uma letra.',
    };
  }

  if (!/^[a-z0-9_]+$/.test(username)) {
    return {
      valid: false,
      message: 'Use apenas letras, números e underline.',
    };
  }

  if (username.includes('__')) {
    return {
      valid: false,
      message: 'Evite underlines repetidos.',
    };
  }

  const reserved = new Set([
    'admin',
    'administrator',
    'root',
    'support',
    'suporte',
    'iris',
    'iris_ai',
    'moderador',
    'mod',
    'api',
    'auth',
    'login',
    'register',
    'onboarding',
    'settings',
    'profile',
    'security',
    'privacy',
    'kids',
    'marketplace',
  ]);

  if (reserved.has(username)) {
    return {
      valid: false,
      message: 'Esse nome é reservado pela IRIS.',
    };
  }

  return {
    valid: true,
    message: 'Formato válido.',
  };
}

export function createUsernameSuggestions(params: {
  firstName?: string;
  socialName?: string;
  current?: string;
}) {
  const sourceName = params.socialName || params.firstName || params.current || 'memoria';
  const base = normalizeUsername(sourceName).split('_')[0] || 'memoria';

  const year = new Date().getFullYear().toString().slice(-2);

  const suggestions = [
    base,
    `${base}_iris`,
    `${base}_${year}`,
    `${base}_memorias`,
    `${base}_vida`,
    `${base}_jardim`,
    `${base}_cartas`,
    `eu_${base}`,
  ]
    .map(normalizeUsername)
    .filter((item) => validateUsername(item).valid);

  return Array.from(new Set(suggestions)).slice(0, 8);
}
TS

cat > src/app/onboarding/username/components/UsernameSuggestionGrid.tsx <<'TSX'
'use client';

type UsernameSuggestionGridProps = {
  suggestions: string[];
  selected?: string;
  loading?: boolean;
  onSelect: (username: string) => void;
};

export function UsernameSuggestionGrid({
  suggestions,
  selected,
  loading = false,
  onSelect,
}: UsernameSuggestionGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-11 animate-pulse rounded-[18px] border border-[#DDE6DA]/70 bg-white/42"
          />
        ))}
      </div>
    );
  }

  if (!suggestions.length) {
    return (
      <div className="rounded-[22px] border border-[#DDE6DA]/70 bg-white/[0.42] px-4 py-3 text-sm leading-6 text-[#747D79] backdrop-blur-xl">
        Digite um nome para gerar sugestões disponíveis.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
      {suggestions.map((username) => {
        const isSelected = selected === username;

        return (
          <button
            key={username}
            type="button"
            onClick={() => onSelect(username)}
            className={[
              'min-h-11 rounded-[18px] border px-4 text-left text-sm font-semibold transition-all duration-200',
              isSelected
                ? 'border-emerald-800 bg-emerald-800 text-white shadow-[0_10px_24px_rgba(0,44,31,0.18)]'
                : 'border-emerald-800/10 bg-white/[0.46] text-[#002c1f] hover:border-emerald-800/24 hover:bg-emerald-800/10 hover:shadow-[0_10px_24px_rgba(0,44,31,0.08)]',
            ].join(' ')}
          >
            @{username}
          </button>
        );
      })}
    </div>
  );
}
TSX

cat > src/app/onboarding/username/components/UsernameAvailabilityField.tsx <<'TSX'
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Spinner } from '@/components/global/Loader/Spinner';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';
import {
  createUsernameSuggestions,
  normalizeUsername,
  validateUsername,
} from '@/lib/username/username';
import { UsernameSuggestionGrid } from './UsernameSuggestionGrid';

type AvailabilityStatus = 'idle' | 'invalid' | 'checking' | 'available' | 'unavailable' | 'error';

type UsernameAvailabilityFieldProps = {
  value: string;
  firstName?: string;
  socialName?: string;
  onChange: (username: string) => void;
  onAvailabilityChange: (available: boolean) => void;
};

const statusCopy: Record<
  AvailabilityStatus,
  {
    title: string;
    message: string;
    className: string;
  }
> = {
  idle: {
    title: 'Seu @ público',
    message: 'Ele será seu identificador afetivo dentro da IRIS.',
    className: 'border-[#DDE6DA]/70 bg-white/[0.42] text-[#476153]',
  },
  invalid: {
    title: 'Ajuste o formato',
    message: 'Use letras, números e underline. Comece com uma letra.',
    className: 'border-[#E8CF8B] bg-[#FFF7DC]/70 text-[#7A5A12]',
  },
  checking: {
    title: 'Verificando disponibilidade',
    message: 'Estamos consultando se esse nome ainda está livre.',
    className: 'border-emerald-800/12 bg-emerald-800/[0.055] text-[#002c1f]',
  },
  available: {
    title: 'Disponível',
    message: 'Esse nome está livre para o seu espaço IRIS.',
    className: 'border-emerald-800/20 bg-emerald-800/[0.075] text-[#002c1f]',
  },
  unavailable: {
    title: 'Já está em uso',
    message: 'Esse nome já pertence a outro espaço. Escolha uma sugestão ou tente uma variação.',
    className: 'border-[#F3C9C7] bg-[#FCE8E8]/76 text-[#8F312D]',
  },
  error: {
    title: 'Não conseguimos verificar agora',
    message: 'Você pode tentar novamente em alguns instantes.',
    className: 'border-[#E8CF8B] bg-[#FFF7DC]/70 text-[#7A5A12]',
  },
};

export function UsernameAvailabilityField({
  value,
  firstName,
  socialName,
  onChange,
  onAvailabilityChange,
}: UsernameAvailabilityFieldProps) {
  const supabase = useMemo(() => createClient(), []);
  const [status, setStatus] = useState<AvailabilityStatus>('idle');
  const [message, setMessage] = useState(statusCopy.idle.message);
  const [availableSuggestions, setAvailableSuggestions] = useState<string[]>([]);
  const [checkingSuggestions, setCheckingSuggestions] = useState(false);

  const validation = validateUsername(value);

  useEffect(() => {
    let active = true;

    async function checkUsername() {
      if (!value) {
        setStatus('idle');
        setMessage(statusCopy.idle.message);
        onAvailabilityChange(false);
        return;
      }

      if (!validation.valid) {
        setStatus('invalid');
        setMessage(validation.message);
        onAvailabilityChange(false);
        return;
      }

      setStatus('checking');
      setMessage(statusCopy.checking.message);
      onAvailabilityChange(false);

      await new Promise((resolve) => setTimeout(resolve, 420));

      if (!active) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', value)
        .maybeSingle();

      if (!active) return;

      if (error) {
        setStatus('error');
        setMessage(statusCopy.error.message);
        onAvailabilityChange(false);
        return;
      }

      if (data) {
        setStatus('unavailable');
        setMessage(statusCopy.unavailable.message);
        onAvailabilityChange(false);
        return;
      }

      setStatus('available');
      setMessage(statusCopy.available.message);
      onAvailabilityChange(true);
    }

    checkUsername();

    return () => {
      active = false;
    };
  }, [onAvailabilityChange, supabase, validation.message, validation.valid, value]);

  useEffect(() => {
    let active = true;

    async function loadSuggestions() {
      const baseSuggestions = createUsernameSuggestions({
        firstName,
        socialName,
        current: value,
      }).filter((suggestion) => suggestion !== value);

      if (!baseSuggestions.length) {
        setAvailableSuggestions([]);
        return;
      }

      setCheckingSuggestions(true);

      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .in('username', baseSuggestions);

      if (!active) return;

      if (error) {
        setAvailableSuggestions(baseSuggestions.slice(0, 5));
        setCheckingSuggestions(false);
        return;
      }

      const unavailable = new Set((data || []).map((item) => item.username));
      const available = baseSuggestions.filter((suggestion) => !unavailable.has(suggestion));

      setAvailableSuggestions(available.slice(0, 6));
      setCheckingSuggestions(false);
    }

    loadSuggestions();

    return () => {
      active = false;
    };
  }, [firstName, socialName, supabase, value]);

  const copy = statusCopy[status];

  return (
    <div className="space-y-5">
      <div className="relative">
        <Input
          id="username"
          name="username"
          label="Nome de usuário"
          value={value ? `@${value}` : ''}
          onChange={(event) => {
            const normalized = normalizeUsername(event.target.value.replace(/^@/, ''));
            onChange(normalized);
          }}
          placeholder="@seunome"
          autoComplete="username"
          helper="Use de 3 a 24 caracteres. Letras, números e underline."
        />

        {status === 'checking' && (
          <div className="pointer-events-none absolute bottom-[38px] right-4">
            <Spinner size="sm" tone="brand" label="Verificando username..." />
          </div>
        )}
      </div>

      <div
        className={[
          'rounded-[24px] border px-4 py-3 shadow-[0_12px_30px_rgba(17,17,17,0.035)] backdrop-blur-xl transition-all duration-200',
          copy.className,
        ].join(' ')}
      >
        <div className="flex items-start gap-3">
          <span
            className={[
              'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold',
              status === 'available'
                ? 'bg-emerald-800 text-white'
                : status === 'checking'
                  ? 'bg-emerald-800/10 text-[#002c1f]'
                  : status === 'unavailable'
                    ? 'bg-[#F3C9C7] text-[#8F312D]'
                    : 'bg-white/70 text-[#002c1f]',
            ].join(' ')}
          >
            {status === 'available'
              ? '✓'
              : status === 'checking'
                ? '…'
                : status === 'unavailable'
                  ? '!'
                  : '@'}
          </span>

          <div>
            <p className="text-sm font-semibold">
              {copy.title}
            </p>

            <p className="mt-1 text-sm leading-6">
              {message}
            </p>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
          Sugestões disponíveis
        </p>

        <UsernameSuggestionGrid
          suggestions={availableSuggestions}
          selected={value}
          loading={checkingSuggestions}
          onSelect={onChange}
        />
      </div>
    </div>
  );
}
TSX

cat > src/app/onboarding/username/page.tsx <<'TSX'
'use client';

import { useCallback, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IrisList, IrisListItem } from '@/components/ui/IrisList';
import { Spinner } from '@/components/global/Loader/Spinner';
import { useOnboardingStore } from '@/lib/store/onboardingStore';
import { UsernameAvailabilityField } from './components/UsernameAvailabilityField';

export default function UsernamePage() {
  const router = useRouter();

  const {
    firstName,
    socialName,
    username,
    updateField,
  } = useOnboardingStore();

  const [draftUsername, setDraftUsername] = useState(username);
  const [available, setAvailable] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState('');

  const handleAvailabilityChange = useCallback((value: boolean) => {
    setAvailable(value);
  }, []);

  function handleUsernameChange(value: string) {
    setDraftUsername(value);
    setAlert('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!available) {
      setAlert('Escolha um nome de usuário disponível antes de continuar.');
      return;
    }

    setSaving(true);
    setAlert('');

    updateField('username', draftUsername);

    router.push('/onboarding/personality');
  }

  return (
    <section className="relative mx-auto w-full">
      <style>
        {`
          @keyframes iris-username-enter {
            from {
              opacity: 0;
              transform: translateY(16px);
              filter: blur(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
              filter: blur(0);
            }
          }

          .iris-username-enter {
            animation: iris-username-enter 620ms cubic-bezier(0.22, 1, 0.36, 1) both;
          }

          @media (prefers-reduced-motion: reduce) {
            .iris-username-enter {
              animation: none !important;
              opacity: 1 !important;
              transform: none !important;
              filter: none !important;
            }
          }
        `}
      </style>

      <Card
        hover={false}
        className="iris-username-enter w-full rounded-[40px] border border-[#E2E7E3]/78 !bg-white/[0.58] p-5 shadow-[0_28px_90px_rgba(17,17,17,0.08)] backdrop-blur-xl sm:p-7 md:p-9 lg:p-11"
      >
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-12 xl:gap-14">
          <aside className="lg:sticky lg:top-8">
            <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
              Identidade pública
            </p>

            <h1 className="font-display text-[2.45rem] leading-[1.02] tracking-[-0.045em] text-[#002c1f] sm:text-[3.1rem] lg:text-[3.35rem]">
              Escolha seu @ dentro da IRIS.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#476153] sm:text-base">
              Esse será o identificador do seu espaço. Ele ajuda pessoas certas a encontrarem você, sem transformar sua presença em métrica.
            </p>

            <IrisList className="mt-7 hidden lg:block">
              <IrisListItem title="Único" marker="01">
                Cada @ pertence a uma única pessoa e ajuda a preservar sua identidade na plataforma.
              </IrisListItem>

              <IrisListItem title="Permanente" marker="02">
                Escolha com calma. Depois, mudanças devem ser tratadas como ação sensível.
              </IrisListItem>

              <IrisListItem title="Simples" marker="03">
                Use letras, números e underline. Evite símbolos difíceis de lembrar.
              </IrisListItem>
            </IrisList>
          </aside>

          <form
            onSubmit={handleSubmit}
            className="rounded-[34px] border border-[#DDE6DA]/72 bg-white/[0.50] p-4 shadow-[0_18px_54px_rgba(17,17,17,0.045)] backdrop-blur-xl sm:p-6 md:p-7"
          >
            <div className="space-y-6">
              {alert && (
                <div className="rounded-[24px] border border-[#E8CF8B] bg-[#FFF7DC]/80 px-4 py-3 text-sm leading-6 text-[#7A5A12]">
                  {alert}
                </div>
              )}

              <UsernameAvailabilityField
                value={draftUsername}
                firstName={firstName}
                socialName={socialName}
                onChange={handleUsernameChange}
                onAvailabilityChange={handleAvailabilityChange}
              />

              <div className="rounded-[28px] border border-emerald-800/10 bg-emerald-800/[0.045] p-5 backdrop-blur-xl">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
                  Preview
                </p>

                <div className="mt-4 rounded-[26px] border border-[#DDE6DA]/76 bg-white/[0.52] p-5 shadow-[0_12px_34px_rgba(17,17,17,0.04)]">
                  <p className="font-display text-2xl tracking-[-0.025em] text-[#002c1f]">
                    {socialName || firstName || 'Seu nome'}
                  </p>

                  <p className="mt-1 font-mono text-sm text-[#476153]">
                    @{draftUsername || 'username'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  className="min-h-12 rounded-[18px] px-6 text-[#747D79] hover:text-[#002c1f]"
                  disabled={saving}
                  onClick={() => router.back()}
                >
                  Voltar
                </Button>

                <Button
                  type="submit"
                  variant="auth"
                  size="lg"
                  disabled={!available || saving}
                  className="min-h-12 rounded-[18px] px-8"
                >
                  {saving ? (
                    <span className="inline-flex items-center gap-3">
                      <Spinner size="sm" tone="light" label="Salvando username..." />
                      Salvando...
                    </span>
                  ) : (
                    'Continuar'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Card>
    </section>
  );
}
TSX

echo "✅ FE-IRIS-030 aplicado: username com validação de disponibilidade, sugestões e preview."
