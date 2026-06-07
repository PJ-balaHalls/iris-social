'use client';

import { ChevronDown, Menu } from 'lucide-react';
import { scrollToSection } from '../_utils/accountSettings';

const menuItems = [
  { id: 'essenciais', label: 'Essenciais' },
  { id: 'contexto', label: 'Contexto' },
  { id: 'dados', label: 'Dados da IRIS' },
];

export function AccountMobileSectionNav({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mb-8 border-y border-[#E2E7E3] py-3 lg:hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-2 text-left text-sm font-semibold text-[#1B3A2E]"
      >
        <span className="inline-flex items-center gap-2">
          <Menu size={17} strokeWidth={1.8} />
          Seções da conta
        </span>

        <ChevronDown
          size={17}
          strokeWidth={1.8}
          className={open ? 'rotate-180 transition' : 'transition'}
        />
      </button>

      {open ? (
        <div className="grid gap-2 pb-3 pt-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onToggle();
                scrollToSection(item.id);
              }}
              className="rounded-full border border-[#E2E7E3] bg-white/55 px-4 py-2 text-left text-sm font-medium text-[#476153]"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function AccountDesktopSectionNav({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <aside className="hidden xl:sticky xl:top-8 xl:block">
      <button
        type="button"
        onClick={onToggle}
        className="mb-4 flex w-full items-center justify-between rounded-full px-3 py-2 text-left text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79] transition hover:bg-white/55"
      >
        Menu
        <ChevronDown
          size={14}
          strokeWidth={1.8}
          className={open ? 'rotate-180 transition' : 'transition'}
        />
      </button>

      {open ? (
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className="block w-full rounded-full px-3 py-2 text-left text-sm font-medium text-[#476153] transition hover:bg-white/55 hover:text-[#1B3A2E]"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </aside>
  );
}
