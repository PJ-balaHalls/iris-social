'use client';

import { useFormStatus } from 'react-dom';
import { Save } from 'lucide-react';

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#1B3A2E] px-5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(27,58,46,0.14)] transition hover:-translate-y-0.5 hover:bg-[#0F1512] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Save size={15} strokeWidth={1.8} />
      {pending ? 'Salvando...' : 'Salvar painel'}
    </button>
  );
}

export function IntegrationsToolbar({
  saved,
  error,
}: {
  saved?: string;
  error?: string;
}) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
      <div>
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
          Loja de plugins
        </p>
        <h2 className="mt-2 font-display text-[2rem] leading-none tracking-[-0.045em]">
          Catálogo de conexões
        </h2>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {saved ? (
          <div className="rounded-full border border-[#DDE6DA] bg-[#F2F7F3] px-4 py-2 text-sm font-medium text-[#1B3A2E]">
            Integrações atualizadas.
          </div>
        ) : null}

        {error ? (
          <div className="rounded-full border border-[#EAD8D6] bg-[#FFF3F2] px-4 py-2 text-sm font-medium text-[#8A3532]">
            Não conseguimos salvar. Verifique as colunas de integração no banco.
          </div>
        ) : null}

        <SaveButton />
      </div>
    </div>
  );
}
