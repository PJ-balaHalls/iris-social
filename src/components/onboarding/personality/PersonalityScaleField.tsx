'use client';

type PersonalityScaleFieldProps = {
  title: string;
  minLabel: string;
  maxLabel: string;
  value: number;
  onChange: (value: number) => void;
};

export function PersonalityScaleField({
  title,
  minLabel,
  maxLabel,
  value,
  onChange,
}: PersonalityScaleFieldProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-4">
        <label className="text-sm font-semibold text-[#002c1f]">
          {title}
        </label>

        <span className="rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] px-3 py-1 text-xs font-semibold text-[#002c1f]">
          {value}/10
        </span>
      </div>

      <input
        type="range"
        min="1"
        max="10"
        step="1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-emerald-800"
        aria-label={title}
      />

      <div className="mt-2 flex items-center justify-between gap-4 text-xs leading-5 text-[#747D79]">
        <span>{minLabel}</span>
        <span className="text-right">{maxLabel}</span>
      </div>
    </div>
  );
}
