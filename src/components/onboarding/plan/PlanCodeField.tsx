'use client';

import { useState } from 'react';
import { TicketPercent } from 'lucide-react';
import { Input } from '@/components/ui/Input';

type PlanCodeFieldProps = {
  enabled: boolean;
  code: string;
  error?: string;
  onEnabledChange: (value: boolean) => void;
  onCodeChange: (value: string) => void;
};

export function PlanCodeField({
  enabled,
  code,
  error,
  onEnabledChange,
  onCodeChange,
}: PlanCodeFieldProps) {
  const [localOpen, setLocalOpen] = useState(enabled);

  function toggle() {
    const next = !localOpen;
    setLocalOpen(next);
    onEnabledChange(next);

    if (!next) {
      onCodeChange('');
    }
  }

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={localOpen}
        className="group flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
            <TicketPercent size={17} strokeWidth={1.8} />
          </span>

          <span>
            <span className="block font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
              Tenho código.
            </span>

            <span className="mt-1 block text-sm leading-6 text-[#747D79]">
              Cupom, convite, benefício interno ou código de acesso.
            </span>
          </span>
        </span>

        <span
          className={[
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-lg leading-none transition-all',
            localOpen
              ? 'rotate-45 border-emerald-800/20 bg-emerald-800/10 text-[#002c1f]'
              : 'border-[#DDE6DA] bg-white/40 text-[#002c1f] group-hover:bg-emerald-800/10',
          ].join(' ')}
          aria-hidden="true"
        >
          +
        </span>
      </button>

      {localOpen && (
        <Input
          id="planCode"
          name="planCode"
          label="Código"
          value={code}
          onChange={(event) => onCodeChange(event.target.value.toUpperCase().replace(/\s+/g, ''))}
          placeholder="IRIS2026"
          autoComplete="off"
          error={error}
          helper="A validação real do código será conectada depois ao billing."
        />
      )}
    </div>
  );
}
