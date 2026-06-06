'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Gift, LockKeyhole, Sparkles } from 'lucide-react';
import { getProfileCompletion } from '@/lib/onboarding/completion';

type ProfileCompletionDrawerProps = {
  state: any;
  open: boolean;
  onClose: () => void;
};

export function ProfileCompletionDrawer({
  state,
  open,
  onClose,
}: ProfileCompletionDrawerProps) {
  const completion = getProfileCompletion(state);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const nextHref = completion.nextRequiredTask?.href || completion.nextTask?.href || '/onboarding/avatar';

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Fechar conclusão de cadastro"
        onClick={onClose}
        className="absolute inset-0 bg-[#0f1512]/24 backdrop-blur-[2px]"
      />

      <aside className="absolute bottom-0 right-0 top-0 flex h-full w-[92vw] max-w-[460px] flex-col border-l border-[#DDE6DA] bg-[#FAF7F2] p-6 shadow-[-24px_0_80px_rgba(0,44,31,0.18)] md:w-full md:p-7">
        <div className="mb-6 flex items-start justify-between gap-5 border-b border-[#DDE6DA] pb-5">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
              IRIS
            </p>

            <h2 className="mt-2 font-display text-3xl leading-tight tracking-[-0.035em] text-[#002c1f]">
              Finalize seu cadastro
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#DDE6DA] bg-white text-[#002c1f] transition-all hover:bg-emerald-800/10"
            aria-label="Fechar drawer"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto pr-1">
          <div className="rounded-[24px] border border-[#DDE6DA] bg-white/60 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-800/[0.08] text-[#002c1f]">
                <Gift size={18} strokeWidth={1.8} />
              </span>

              <div>
                <h3 className="font-display text-2xl tracking-[-0.035em] text-[#002c1f]">
                  Recompensa de perfil completo
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#476153]">
                  Ao finalizar as etapas principais, você poderá ganhar um selo oficial e um tema gratuito.
                </p>

                <p className="mt-2 text-xs leading-5 text-[#747D79]">
                  A liberação real ficará como validação pendente até criarmos a regra server-side.
                </p>
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#DDE6DA]">
              <div
                className="h-full rounded-full bg-[#002c1f] transition-all duration-500"
                style={{ width: `${completion.rewardPercent}%` }}
              />
            </div>

            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
              {completion.requiredCompletedCount}/{completion.requiredTotalCount} etapas obrigatórias
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {completion.tasks.map((task) => (
              <Link
                key={task.key}
                href={task.href}
                className="flex items-start justify-between gap-4 rounded-[22px] border border-[#DDE6DA] bg-white/54 p-4 transition-all hover:bg-emerald-800/[0.055]"
              >
                <div className="flex min-w-0 gap-3">
                  <span
                    className={[
                      'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
                      task.completed
                        ? 'border-emerald-800/18 bg-emerald-800/[0.08] text-[#002c1f]'
                        : 'border-[#DDE6DA] bg-white text-[#747D79]',
                    ].join(' ')}
                  >
                    {task.completed ? (
                      <CheckCircle2 size={16} strokeWidth={1.8} />
                    ) : task.requiredForReward ? (
                      <Sparkles size={15} strokeWidth={1.8} />
                    ) : (
                      <LockKeyhole size={15} strokeWidth={1.8} />
                    )}
                  </span>

                  <span>
                    <span className="block text-sm font-semibold text-[#002c1f]">
                      {task.label}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-[#747D79]">
                      {task.description}
                    </span>
                  </span>
                </div>

                <ArrowRight size={15} strokeWidth={1.8} className="mt-2 shrink-0 text-[#747D79]" />
              </Link>
            ))}
          </div>

          <Link
            href={nextHref}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[18px] bg-emerald-800 px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(0,44,31,0.18)] transition-all hover:bg-emerald-900"
          >
            Continuar personalização
            <ArrowRight size={15} strokeWidth={1.8} />
          </Link>
        </div>
      </aside>
    </div>
  );
}
