import type { HTMLAttributes } from 'react';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SpinnerTone = 'brand' | 'light' | 'muted';

type SpinnerProps = HTMLAttributes<HTMLDivElement> & {
  size?: SpinnerSize;
  tone?: SpinnerTone;
  label?: string;
  fullScreen?: boolean;
  withBrand?: boolean;
};

const sizeClasses: Record<SpinnerSize, string> = {
  xs: 'h-3 w-3 border',
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-9 w-9 border-[3px]',
  xl: 'h-12 w-12 border-[3px]',
};

const toneClasses: Record<SpinnerTone, string> = {
  brand: 'border-[#DDE6DA] border-t-[#006D4E]',
  light: 'border-white/35 border-t-white',
  muted: 'border-[#E2E7E3] border-t-[#9A7CA7]',
};

export function Spinner({
  size = 'md',
  tone = 'brand',
  label = 'Carregando...',
  fullScreen = false,
  withBrand = false,
  className = '',
  ...props
}: SpinnerProps) {
  const spinner = (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={`inline-flex items-center justify-center gap-3 text-[#1B3A2E] ${className}`}
      {...props}
    >
      <span
        className={`${sizeClasses[size]} ${toneClasses[tone]} block animate-spin rounded-full`}
        aria-hidden="true"
      />

      {withBrand && (
        <span className="select-none text-sm font-medium tracking-wide text-[#476153]">
          {label}
        </span>
      )}

      <span className="sr-only">{label}</span>
    </div>
  );

  if (!fullScreen) {
    return spinner;
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#FAF7F2] px-6">
      <div className="flex flex-col items-center gap-5 rounded-[24px] border border-[#E2E7E3] bg-white/75 px-8 py-7 text-center shadow-[0_10px_30px_rgba(17,17,17,0.06)] backdrop-blur-xl">
        <div className="font-display text-2xl font-semibold tracking-[0.18em] text-[#1B3A2E]">
          IRIS
        </div>
        {spinner}
      </div>
    </div>
  );
}

export default Spinner;