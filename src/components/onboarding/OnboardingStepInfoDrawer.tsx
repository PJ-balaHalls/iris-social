'use client';

import { useEffect, useState, type ReactNode } from 'react';

type OnboardingStepInfoDrawerProps = {
  title: string;
  children: ReactNode;
};

export function OnboardingStepInfoDrawer({
  title,
  children,
}: OnboardingStepInfoDrawerProps) {
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
        className="inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-[#747D79] transition-colors hover:text-[#002c1f] focus:outline-none focus:ring-4 focus:ring-emerald-800/10"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#C7CFCC] text-[0.65rem] text-[#747D79]">
          ?
        </span>
        O que essa etapa faz
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Fechar explicação"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-[#0f1512]/24 backdrop-blur-[2px]"
          />

          <aside className="absolute bottom-0 right-0 top-0 flex h-full w-[92vw] max-w-[430px] flex-col border-l border-[#DDE6DA] bg-[#FAF7F2] p-6 shadow-[-24px_0_80px_rgba(0,44,31,0.18)] md:w-full md:p-7">
            <div className="mb-6 flex items-start justify-between gap-5 border-b border-[#DDE6DA] pb-5">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
                  IRIS
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
