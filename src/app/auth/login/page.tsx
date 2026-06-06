'use client';

import { useState } from 'react';
import Link from 'next/link';
import { loginAction } from '@/lib/actions/auth.actions';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import type { AuthActionError } from '@/lib/erros/auth';

export default function LoginPage() {
  const [error, setError] = useState<AuthActionError | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await loginAction(formData);

      if (response?.error) {
        setError(response);
        setLoading(false);
      }
    } catch {
      setError({
        error: 'Não conseguimos abrir seu espaço agora. Tente novamente em instantes.',
        code: 'IRIS_AUTH_LOGIN_999',
        help: 'Verifique sua conexão e tente novamente.',
      });
      setLoading(false);
    }
  };

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

      {error && (
        <Card
          hover={false}
          className="rounded-[22px] border border-[#F3C9C7] !bg-[#FCE8E8] p-4 shadow-none"
        >
          <p role="alert" className="text-sm font-medium leading-6 text-[#B3261E]">
            {error.error}
          </p>

          <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[#8F312D]">
            {error.code}
          </p>

          <p className="mt-2 text-xs leading-5 text-[#8F312D]">
            {error.help}
          </p>
        </Card>
      )}

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
            <label className="text-sm font-medium text-[#002c1f]" htmlFor="password">
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