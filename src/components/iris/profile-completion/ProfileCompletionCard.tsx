'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Gift, Sparkles } from 'lucide-react';
import { getProfileCompletion } from '@/lib/onboarding/completion';
import { ProfileCompletionDrawer } from './ProfileCompletionDrawer';

type ProfileCompletionCardProps = {
  state: any;
};

export function ProfileCompletionCard({ state }: ProfileCompletionCardProps) {
  const [open, setOpen] = useState(false);
  const completion = getProfileCompletion(state);
  const nextHref = completion.nextRequiredTask?.href || completion.nextTask?.href || '/onboarding/avatar';

  return (
    <>
      <section className="rounded-[28px] border border-white/70 bg-white/[0.24] p-5 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
            {completion.rewardEligible ? (
              <Gift size={19} strokeWidth={1.8} />
            ) : (
              <Sparkles size={19} strokeWidth={1.8} />
            )}
          </span>

          <div className="min-w-0">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
              {completion.rewardEligible ? 'Recompensa disponível' : 'Finalize seu cadastro'}
            </p>

            <h2 className="mt-2 font-display text-3xl leading-[1] tracking-[-0.045em] text-[#002c1f]">
              {completion.rewardEligible
                ? 'Perfil completo em validação.'
                : 'Ganhe selo oficial e tema gratuito.'}
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#476153]">
              {completion.rewardEligible
                ? 'Suas etapas principais foram concluídas. A recompensa fica pendente de validação segura.'
                : 'Complete as etapas principais de personalização para deixar a IRIS mais precisa.'}
            </p>
          </div>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/60">
          <div
            className="h-full rounded-full bg-[#002c1f] transition-all duration-500"
            style={{ width: `${completion.rewardPercent}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            {completion.requiredCompletedCount}/{completion.requiredTotalCount} principais
          </p>

          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
            {completion.rewardPercent}%
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Link
            href={nextHref}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[16px] bg-emerald-800 px-4 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(0,44,31,0.16)] transition-all hover:bg-emerald-900"
          >
            Continuar
            <ArrowRight size={15} strokeWidth={1.8} />
          </Link>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex min-h-11 items-center justify-center rounded-[16px] border border-emerald-800/18 px-4 text-sm font-semibold text-[#002c1f] transition-all hover:bg-emerald-800/10"
          >
            Ver progresso
          </button>
        </div>
      </section>

      <ProfileCompletionDrawer
        state={state}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
