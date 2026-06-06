'use client';

import { useState, type ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

type OptionalIdentityFieldProps = {
  title: string;
  description: string;
  eyebrow?: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function OptionalIdentityField({
  title,
  description,
  eyebrow = 'Opcional',
  defaultOpen = false,
  children,
}: OptionalIdentityFieldProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card
      hover={false}
      className={[
        'overflow-hidden rounded-[24px] border p-0 backdrop-blur-xl transition-all duration-300 ease-out',
        open
          ? 'border-emerald-800/18 !bg-white/[0.76] shadow-[0_18px_48px_rgba(17,17,17,0.055)]'
          : 'border-[#DDE6DA]/62 !bg-white/[0.38] shadow-[0_8px_24px_rgba(17,17,17,0.025)]',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-4 px-5 py-3.5 text-left transition-colors hover:bg-emerald-800/[0.035] focus:outline-none focus:ring-4 focus:ring-emerald-800/10"
      >
        <span className="min-w-0">
          <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#8A9690]">
            {eyebrow}
          </span>

          <span className="mt-1 block text-sm font-semibold leading-tight text-[#002c1f]">
            {title}
          </span>

          {open && (
            <span className="mt-2 block text-sm leading-6 text-[#476153]">
              {description}
            </span>
          )}
        </span>

        <span
          className={[
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-lg leading-none shadow-sm',
            'transition-all duration-300 ease-out',
            open
              ? 'rotate-45 border-emerald-800/20 bg-emerald-800/10 text-[#002c1f]'
              : 'rotate-0 border-[#DDE6DA] bg-white/58 text-[#002c1f] group-hover:scale-105 group-hover:bg-emerald-800/10',
          ].join(' ')}
          aria-hidden="true"
        >
          +
        </span>
      </button>

      <div
        className={[
          'grid transition-all duration-300 ease-out',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        ].join(' ')}
      >
        <div className="overflow-hidden">
          <div className="border-t border-[#DDE6DA]/60 px-5 pb-5 pt-4">
            {children}
          </div>
        </div>
      </div>
    </Card>
  );
}
