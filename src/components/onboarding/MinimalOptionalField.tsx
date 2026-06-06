'use client';

import { useState, type ReactNode } from 'react';

type MinimalOptionalFieldProps = {
  title: string;
  description: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function MinimalOptionalField({
  title,
  description,
  children,
  defaultOpen = false,
}: MinimalOptionalFieldProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-4 text-left"
      >
        <span>
          <span className="text-sm font-semibold text-[#002c1f]">
            {title}
          </span>

          {open && (
            <span className="mt-1 block text-sm leading-6 text-[#747D79]">
              {description}
            </span>
          )}
        </span>

        <span
          className={[
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-lg leading-none transition-all',
            open
              ? 'rotate-45 border-emerald-800/20 bg-emerald-800/10 text-[#002c1f]'
              : 'border-[#DDE6DA] bg-white/40 text-[#002c1f] group-hover:bg-emerald-800/10',
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
          <div className="pt-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
