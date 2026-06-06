'use client';

type IntentionTagOption = {
  value: string;
  label: string;
};

type IntentionTagGridProps = {
  title: string;
  value: string[];
  minSelected?: number;
  options: IntentionTagOption[];
  onChange: (value: string[]) => void;
};

export function IntentionTagGrid({
  title,
  value,
  minSelected = 0,
  options,
  onChange,
}: IntentionTagGridProps) {
  function toggleTag(tag: string) {
    if (value.includes(tag)) {
      onChange(value.filter((item) => item !== tag));
      return;
    }

    onChange([...value, tag]);
  }

  return (
    <fieldset className="space-y-5">
      <legend className="w-full">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
            {title}
          </h2>

          {minSelected > 0 && (
            <span className="shrink-0 rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] px-3 py-1 text-xs font-semibold text-[#002c1f]">
              {value.length}/{minSelected}+
            </span>
          )}
        </div>
      </legend>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value.includes(option.value);

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleTag(option.value)}
              aria-pressed={selected}
              className={[
                'min-h-11 rounded-full border px-4 text-sm font-semibold transition-all duration-200',
                selected
                  ? 'border-emerald-800 bg-emerald-800 text-white shadow-[0_10px_24px_rgba(0,44,31,0.16)]'
                  : 'border-white/70 bg-white/[0.30] text-[#002c1f] hover:border-emerald-800/20 hover:bg-emerald-800/[0.065]',
              ].join(' ')}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
