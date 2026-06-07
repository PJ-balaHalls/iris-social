'use client';

import { useFormStatus } from 'react-dom';
import { Pencil, Save, X } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#1B3A2E] px-5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(27,58,46,0.14)] transition hover:-translate-y-0.5 hover:bg-[#0F1512] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Save size={15} strokeWidth={1.8} />
      {pending ? 'Salvando...' : 'Salvar alterações'}
    </button>
  );
}

function FeedbackMessage({
  feedback,
}: {
  feedback?: {
    saved?: string;
    error?: string;
    readonly?: string;
  };
}) {
  if (!feedback?.saved && !feedback?.error && !feedback?.readonly) return null;

  if (feedback.saved) {
    const label =
      feedback.saved === 'memories'
        ? 'Memórias de acesso atualizadas.'
        : feedback.saved === 'device-revoked'
          ? 'Dispositivo revogado.'
          : 'Preferências de segurança atualizadas.';

    return (
      <div className="rounded-full border border-[#DDE6DA] bg-[#F2F7F3] px-4 py-2 text-sm font-medium text-[#1B3A2E]">
        {label}
      </div>
    );
  }

  const errorLabel =
    feedback.error === 'memory-validation'
      ? 'Cada memória precisa ter pergunta e resposta válida.'
      : feedback.error === 'preferences'
        ? 'Não conseguimos salvar as preferências.'
        : 'Não conseguimos salvar agora. Tente novamente.';

  return (
    <div className="rounded-full border border-[#EAD8D6] bg-[#FFF3F2] px-4 py-2 text-sm font-medium text-[#8A3532]">
      {errorLabel}
    </div>
  );
}

export function SecurityToolbar({
  isEditing,
  onEdit,
  onCancel,
  feedback,
}: {
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  feedback?: {
    saved?: string;
    error?: string;
    readonly?: string;
  };
}) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
      <div>
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
          Controles
        </p>
        <h2 className="mt-2 font-display text-[2rem] leading-none tracking-[-0.045em]">
          Preferências de entrada
        </h2>
      </div>

      <div className="flex flex-wrap gap-3">
        <FeedbackMessage feedback={feedback} />

        {!isEditing ? (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#1B3A2E] px-5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(27,58,46,0.14)] transition hover:-translate-y-0.5 hover:bg-[#0F1512]"
          >
            <Pencil size={15} strokeWidth={1.8} />
            Editar
          </button>
        ) : (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#C7CFCC] bg-white px-5 text-sm font-semibold text-[#1B3A2E] transition hover:bg-[#FFFDF8]"
          >
            <X size={15} strokeWidth={1.8} />
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}

export function SecurityFormFooter() {
  return (
    <div className="mt-10 flex justify-end">
      <SubmitButton />
    </div>
  );
}
