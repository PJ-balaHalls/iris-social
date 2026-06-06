'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Info } from 'lucide-react';

type PlanInfoDrawerProps = {
  title: string;
  triggerLabel?: string;
  children: ReactNode;
};

export function PlanInfoDrawer({
  title,
  triggerLabel = 'Ver detalhes',
  children,
}: PlanInfoDrawerProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-9 items-center justify-center gap-2 rounded-full border border-white/70 bg-white/[0.34] px-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#747D79] transition-all hover:border-emerald-800/20 hover:bg-emerald-800/[0.055] hover:text-[#002c1f] focus:outline-none focus:ring-4 focus:ring-emerald-800/10"
      >
        <Info size={13} strokeWidth={1.8} />
        {triggerLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Fechar detalhes"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-[#0f1512]/24 backdrop-blur-[2px]"
          />

          <aside className="absolute bottom-0 right-0 top-0 flex h-full w-[92vw] max-w-[430px] flex-col border-l border-[#DDE6DA] bg-[#FAF7F2] p-6 shadow-[-24px_0_80px_rgba(0,44,31,0.18)] md:w-full md:p-7">
            <div className="mb-6 flex items-start justify-between gap-5 border-b border-[#DDE6DA] pb-5">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
                  Plano IRIS
                </p>

                <h2 className="mt-2 font-display text-3xl leading-tight tracking-[-0.035em] text-[#002c1f]">
                  {title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#DDE6DA] bg-white text-[#002c1f] transition-all hover:bg-emerald-800/10 focus:outline-none focus:ring-4 focus:ring-emerald-800/10"
                aria-label="Fechar drawer"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto text-sm leading-7 text-[#476153]">
              {children}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
