'use client';

import { ChevronDown, LockKeyhole, Menu } from 'lucide-react';
import type { ReactNode } from 'react';

type IrisDisclosureSectionProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  open: boolean;
  onToggle: () => void;
  collapsedLabel?: string;
};

export function IrisDisclosureSection({
  eyebrow,
  title,
  description,
  children,
  open,
  onToggle,
  collapsedLabel = 'Informações recolhidas.',
}: IrisDisclosureSectionProps) {
  return (
    <section className="border-t border-[#E2E7E3] py-7 first:border-t-0 first:pt-0">
      <div className="flex items-start justify-between gap-6">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-label={open ? `Ocultar ${title}` : `Mostrar ${title}`}
          className="group -ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#DDE6DA] bg-white/70 text-[#476153] shadow-[0_10px_30px_rgba(27,58,46,0.06)] transition hover:bg-white hover:text-[#1B3A2E]"
        >
          <Menu size={17} strokeWidth={1.8} />
        </button>

        <button
          type="button"
          onClick={onToggle}
          className="min-w-0 flex-1 text-left"
        >
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
            {eyebrow}
          </span>

          <span className="mt-2 block font-display text-[1.65rem] leading-none tracking-[-0.045em] text-[#1B3A2E] sm:text-[1.95rem]">
            {title}
          </span>

          {description ? (
            <span className="mt-3 block max-w-2xl text-sm leading-6 text-[#747D79]">
              {description}
            </span>
          ) : null}
        </button>

        <button
          type="button"
          onClick={onToggle}
          aria-label={open ? `Ocultar ${title}` : `Mostrar ${title}`}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#9AA4A1] transition hover:bg-white/70 hover:text-[#1B3A2E]"
        >
          <ChevronDown
            size={18}
            strokeWidth={1.8}
            className={open ? 'rotate-180 transition' : 'transition'}
          />
        </button>
      </div>

      {open ? (
        <div className="mt-8 pl-0 sm:pl-[52px]">{children}</div>
      ) : (
        <div className="mt-5 flex items-center gap-2 pl-0 text-sm text-[#9AA4A1] sm:pl-[52px]">
          <LockKeyhole size={14} strokeWidth={1.8} />
          {collapsedLabel}
        </div>
      )}
    </section>
  );
}
