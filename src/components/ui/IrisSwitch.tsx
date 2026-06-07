'use client';

type IrisSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
};

export function IrisSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}: IrisSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="group flex w-full items-center justify-between gap-4 text-left disabled:cursor-not-allowed disabled:opacity-60"
    >
      {label || description ? (
        <span className="min-w-0">
          {label ? (
            <span className="block text-sm font-semibold text-[#1B3A2E]">
              {label}
            </span>
          ) : null}

          {description ? (
            <span className="mt-1 block text-sm leading-6 text-[#747D79]">
              {description}
            </span>
          ) : null}
        </span>
      ) : null}

      <span
        className={[
          'relative h-7 w-12 shrink-0 rounded-full border transition',
          checked
            ? 'border-[#1B3A2E] bg-[#1B3A2E]'
            : 'border-[#C7CFCC] bg-white/80',
        ].join(' ')}
      >
        <span
          className={[
            'absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-[0_4px_12px_rgba(27,58,46,0.18)] transition',
            checked ? 'left-[22px]' : 'left-1',
          ].join(' ')}
        />
      </span>
    </button>
  );
}
