'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export type IrisSelectOption = {
  label: string;
  value: string;
  description?: string;
};

type IrisSelectFieldProps = {
  id?: string;
  label: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: IrisSelectOption[];
  placeholder?: string;
  helper?: string;
  disabled?: boolean;
};

export function IrisSelectField({
  id,
  label,
  name,
  value,
  onChange,
  options,
  placeholder = 'Selecionar',
  helper,
  disabled = false,
}: IrisSelectFieldProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  const fieldId = id || label.toLowerCase().replace(/\s+/g, '-');

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative w-full">
      {name ? <input type="hidden" name={name} value={value} /> : null}

      <label
        htmlFor={fieldId}
        className="mb-2 block text-sm font-medium text-[#1B3A2E]"
      >
        {label}
      </label>

      <button
        id={fieldId}
        type="button"
        disabled={disabled}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex min-h-12 w-full items-center justify-between gap-4 rounded-[18px] border border-[#DDE6DA] bg-white/72 px-4 py-3 text-left text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.70)] outline-none backdrop-blur-xl transition hover:border-emerald-900/25 hover:bg-white focus:border-[#1B3A2E] focus:ring-4 focus:ring-[#1B3A2E]/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="min-w-0">
          <span className={selected ? 'block font-semibold text-[#1B3A2E]' : 'block text-[#9AA4A1]'}>
            {selected?.label || placeholder}
          </span>

          {selected?.description ? (
            <span className="mt-0.5 block truncate text-xs text-[#747D79]">
              {selected.description}
            </span>
          ) : null}
        </span>

        <ChevronDown
          size={17}
          strokeWidth={1.8}
          className={open ? 'shrink-0 rotate-180 text-[#1B3A2E] transition' : 'shrink-0 text-[#747D79] transition'}
        />
      </button>

      {helper ? (
        <p className="mt-2 text-xs leading-5 text-[#747D79]">{helper}</p>
      ) : null}

      {open ? (
        <div className="absolute left-0 right-0 z-50 mt-3 overflow-hidden rounded-[24px] border border-[#DDE6DA] bg-[#FFFDF8]/92 p-2 shadow-[0_24px_70px_rgba(27,58,46,0.14)] backdrop-blur-xl">
          <div className="max-h-72 overflow-auto">
            {options.map((option) => {
              const active = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={[
                    'flex w-full items-start justify-between gap-4 rounded-[18px] px-4 py-3 text-left transition',
                    active ? 'bg-[#1B3A2E] text-white' : 'text-[#1B3A2E] hover:bg-[#F2F4F3]',
                  ].join(' ')}
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">
                      {option.label}
                    </span>

                    {option.description ? (
                      <span className={active ? 'mt-1 block text-xs leading-5 text-white/72' : 'mt-1 block text-xs leading-5 text-[#747D79]'}>
                        {option.description}
                      </span>
                    ) : null}
                  </span>

                  {active ? (
                    <Check size={17} strokeWidth={1.9} className="mt-0.5 shrink-0" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
