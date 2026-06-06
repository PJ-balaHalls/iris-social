import type { ReactNode } from 'react';

type IrisListProps = {
  children: ReactNode;
  className?: string;
};

type IrisListItemProps = {
  title: string;
  children?: ReactNode;
  marker?: ReactNode;
  className?: string;
};

export function IrisList({ children, className = '' }: IrisListProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {children}
    </div>
  );
}

export function IrisListItem({
  title,
  children,
  marker,
  className = '',
}: IrisListItemProps) {
  return (
    <div
      className={[
        'group flex gap-3 rounded-[22px] border border-[#DDE6DA]/70 bg-white/[0.38] p-4',
        'shadow-[0_10px_28px_rgba(17,17,17,0.025)] backdrop-blur-md transition-all duration-200',
        'hover:border-emerald-800/20 hover:bg-emerald-800/[0.035]',
        className,
      ].join(' ')}
    >
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#DDE6DA] bg-white/70 text-xs font-semibold text-[#002c1f] transition-colors group-hover:border-emerald-800/25 group-hover:bg-emerald-800/10">
        {marker ?? '•'}
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold leading-5 text-[#002c1f]">
          {title}
        </p>

        {children && (
          <p className="mt-1 text-sm leading-6 text-[#476153]">
            {children}
          </p>
        )}
      </div>
    </div>
  );
}
