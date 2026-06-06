'use client';

import { redirectAfterAuth } from '@/lib/auth/clientRedirect';

import { useState } from 'react';
import Link from 'next/link';
import { loginAction } from '@/lib/actions/auth.actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthUserErrorAlert } from '@/app/auth/components/AuthUserErrorAlert';
import type { AuthActionError } from '@/lib/erros/auth';

export default function LoginPage() {
  const [error, setError] = useState<AuthActionError | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await loginAction(formData);

      if (response?.ok === false) {
        setError(response);
        setLoading(false);
      }
    } catch {
      setError({
        ok: false,
        code: 'IRIS_AUTH_LOGIN_999',
        title: 'Não conseguimos abrir seu espaço.',
        message: 'Algo inesperado aconteceu durante o acesso.',
        action: 'Tente novamente em alguns instantes.',
      });

      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-[#747D79]">
          Acesso seguro
        </p>

        <h1 className="font-display text-3xl leading-tight tracking-[-0.02em] text-[#002c1f]">
          Que bom ter você aqui.
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#476153] sm:text-base">
          Acesse seu espaço seguro de memórias, cartas e vínculos preservados.
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

        <div className="space-y-1">
          <div className="mb-1.5 flex items-center justify-between gap-4">
            <label
              className="text-sm font-medium text-[#002c1f]"
              htmlFor="password"
            >
              Senha
            </label>

            <Link
              href="/auth/forgot-password"
              className="text-sm font-semibold text-emerald-800 transition-colors hover:text-emerald-900 hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>

          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          variant="auth"
          size="lg"
          loading={loading}
          disabled={loading}
          className="mt-4 min-h-12 w-full"
        >
          {loading ? 'Destrancando seu espaço...' : 'Entrar no IRIS'}
        </Button>
      </form>

      <footer className="text-center">
        <p className="text-sm text-[#747D79]">
          Ainda não tem o seu espaço?{' '}
          <Link
            href="/auth/register"
            className="font-bold text-emerald-800 transition-colors hover:text-emerald-900 hover:underline"
          >
            Criar conta
          </Link>
        </p>
      </footer>
    </div>
  );
}