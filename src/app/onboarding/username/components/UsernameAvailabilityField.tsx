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

type AvailabilityStatus =
  | 'idle'
  | 'invalid'
  | 'checking'
  | 'available'
  | 'unavailable'
  | 'error';

type UsernameAvailabilityFieldProps = {
  value: string;
  firstName?: string;
  socialName?: string;
  onChange: (username: string) => void;
  onAvailabilityChange: (available: boolean) => void;
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
  const [message, setMessage] = useState('Use de 3 a 24 caracteres.');
  const [availableSuggestions, setAvailableSuggestions] = useState<string[]>([]);
  const [checkingSuggestions, setCheckingSuggestions] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkUsername() {
      const validation = validateUsername(value);

      if (!value) {
        setStatus('idle');
        setMessage('Use de 3 a 24 caracteres.');
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
      setMessage('Verificando disponibilidade...');
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
        setMessage('Não conseguimos verificar agora.');
        onAvailabilityChange(false);
        return;
      }

      if (data) {
        setStatus('unavailable');
        setMessage('Esse nome já está em uso.');
        onAvailabilityChange(false);
        return;
      }

      setStatus('available');
      setMessage('Disponível.');
      onAvailabilityChange(true);
    }

    checkUsername();

    return () => {
      active = false;
    };
  }, [onAvailabilityChange, supabase, value]);

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

  const statusClass =
    status === 'available'
      ? 'text-emerald-900'
      : status === 'unavailable' || status === 'invalid'
        ? 'text-[#8F312D]'
        : 'text-[#747D79]';

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
          helper="Letras, números e underline."
        />

        {status === 'checking' && (
          <div className="pointer-events-none absolute bottom-[38px] right-4">
            <Spinner size="sm" tone="brand" label="Verificando username..." />
          </div>
        )}
      </div>

      <p className={`text-sm font-medium ${statusClass}`}>
        {message}
      </p>

      <UsernameSuggestionGrid
        suggestions={availableSuggestions}
        selected={value}
        loading={checkingSuggestions}
        onSelect={onChange}
      />
    </div>
  );
}
