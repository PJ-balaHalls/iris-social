'use client';

type PersonalityChoiceOption = {
  value: string;
  label: string;
};

type PersonalityChoiceGroupProps = {
  title: string;
  value: string;
  options: PersonalityChoiceOption[];
  onChange: (value: string) => void;
};

export function PersonalityChoiceGroup({
  title,
  value,
  options,
  onChange,
}: PersonalityChoiceGroupProps) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-[#002c1f]">
        {title}
      </legend>

      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const selected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={[
                'min-h-12 rounded-[18px] border px-4 text-left text-sm font-semibold transition-all duration-200',
                selected
                  ? 'border-emerald-800 bg-emerald-800 text-white shadow-[0_10px_24px_rgba(0,44,31,0.18)]'
                  : 'border-emerald-800/10 bg-white/[0.34] text-[#002c1f] hover:border-emerald-800/24 hover:bg-emerald-800/10',
              ].join(' ')}
              aria-pressed={selected}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
