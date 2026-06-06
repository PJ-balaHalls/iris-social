'use client';

import { redirectAfterAuth } from '@/lib/auth/clientRedirect';

import { useState } from 'react';
import Link from 'next/link';
import { registerAction } from '@/lib/actions/auth.actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthUserErrorAlert } from '@/app/auth/components/AuthUserErrorAlert';
import {
  AUTH_REGISTER_ERRORS,
  type AuthActionError,
} from '@/lib/erros/auth';

export default function RegisterPage() {
  const [error, setError] = useState<AuthActionError | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const password = formData.get('password');

    if (typeof password !== 'string' || password.trim().length < 8) {
      const weakPasswordError = AUTH_REGISTER_ERRORS.WEAK_PASSWORD;

      setError({
        ok: false,
        code: weakPasswordError.code,
        title: weakPasswordError.userTitle,
        message: weakPasswordError.userMessage,
        action: weakPasswordError.userAction,
      });

      setLoading(false);
      return;
    }

    try {
      const response = await registerAction(formData);

      if (response?.ok === false) {
        setError(response);
        setLoading(false);
      }
    } catch {
      setError({
        ok: false,
        code: 'IRIS_AUTH_REGISTER_999',
        title: 'Não conseguimos preparar seu espaço.',
        message: 'Algo inesperado aconteceu durante a criação da conta.',
        action: 'Tente novamente em alguns instantes.',
      });

      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-[#747D79]">
          Novo espaço
        </p>

        <h1 className="font-display text-3xl leading-tight tracking-[-0.02em] text-[#002c1f]">
          Plante suas raízes.
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#476153] sm:text-base">
          O primeiro passo para criar o seu espaço seguro no IRIS.
        </p>
      </header>

      {error && <AuthUserErrorAlert error={error} />}

      <form onSubmit={handleSubmit} className="space-y-5" aria-busy={loading}>
        <Input
          id="email"
          name="email"
          type="email"
          label="E-mail"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="voce@exemplo.com"
          disabled={loading}
        />

        <Input
          id="password"
          name="password"
          type="password"
          label="Senha"
          required
          autoComplete="new-password"
          placeholder="••••••••"
          helper="Use pelo menos 8 caracteres para proteger seu espaço."
          disabled={loading}
        />

        <p className="text-xs leading-5 text-[#747D79]">
          Ao continuar, você concorda com nossos Termos de Privacidade e Proteção de Memórias.
        </p>

        <Button
          type="submit"
          variant="auth"
          size="lg"
          loading={loading}
          disabled={loading}
          className="min-h-12 w-full"
        >
          {loading ? 'Semeando espaço...' : 'Criar minha conta'}
        </Button>
      </form>

      <footer className="text-center">
        <p className="text-sm text-[#747D79]">
          Já tem o seu espaço?{' '}
          <Link
            href="/auth/login"
            className="font-bold text-emerald-800 transition-colors hover:text-emerald-900 hover:underline"
          >
            Entrar
          </Link>
        </p>
      </footer>
    </div>
  );
}