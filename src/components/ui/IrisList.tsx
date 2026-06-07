import Link from 'next/link';
import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

export type IrisListItem = {
  id: string;
  title: string;
  description?: string;
  value?: ReactNode;
  meta?: string;
  icon?: ReactNode;
  href?: string;
  status?: ReactNode;
  action?: ReactNode;
};

type IrisListProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  items: IrisListItem[];
  footer?: ReactNode;
  variant?: 'line' | 'soft' | 'compact';
  emptyTitle?: string;
  emptyDescription?: string;
};

function IrisListRow({
  item,
  variant = 'line',
}: {
  item: IrisListItem;
  variant?: 'line' | 'soft' | 'compact';
}) {
  const isLine = variant === 'line';
  const isCompact = variant === 'compact';

  const content = (
    <div
      className={[
        'group flex w-full items-center gap-4 transition',
        isLine
          ? 'border-b border-[#E2E7E3] py-4 last:border-b-0'
          : 'rounded-[22px] border border-[#E2E7E3] bg-white/70 p-4',
        isCompact ? 'py-3' : '',
        item.href ? 'hover:text-[#006D4E]' : '',
      ].join(' ')}
    >
      {item.icon ? (
        <div
          className={[
            'flex shrink-0 items-center justify-center text-[#1B3A2E]',
            isLine
              ? 'h-9 w-9 rounded-full bg-[#F2F4F3]'
              : 'h-11 w-11 rounded-[16px] bg-[#F2F4F3]',
          ].join(' ')}
        >
          {item.icon}
        </div>
      ) : null}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-[#1B3A2E]">{item.title}</p>
          {item.status}
        </div>

        {item.description ? (
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[#747D79]">
            {item.description}
          </p>
        ) : null}

        {item.meta ? (
          <p className="mt-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#9AA4A1]">
            {item.meta}
          </p>
        ) : null}
      </div>

      {item.value ? (
        <div className="max-w-[46%] shrink-0 text-right text-sm font-medium text-[#1B3A2E]">
          {item.value}
        </div>
      ) : null}

      {item.action ? <div className="shrink-0">{item.action}</div> : null}

      {item.href ? (
        <ChevronRight
          size={17}
          strokeWidth={1.8}
          className="shrink-0 text-[#9AA4A1] transition group-hover:translate-x-1 group-hover:text-[#006D4E]"
        />
      ) : null}
    </div>
  );

  if (!item.href) return content;

  return (
    <Link href={item.href} className="block">
      {content}
    </Link>
  );
}

export function IrisList({
  eyebrow,
  title,
  description,
  items,
  footer,
  variant = 'line',
  emptyTitle = 'Nada por aqui ainda.',
  emptyDescription = 'As informações aparecerão aqui quando estiverem disponíveis.',
}: IrisListProps) {
  return (
    <section className="w-full">
      {eyebrow || title || description ? (
        <header className="mb-5">
          {eyebrow ? (
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
              {eyebrow}
            </p>
          ) : null}

          {title ? (
            <h2 className="mt-2 font-display text-[1.7rem] leading-none tracking-[-0.045em] text-[#1B3A2E]">
              {title}
            </h2>
          ) : null}

          {description ? (
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#747D79]">
              {description}
            </p>
          ) : null}
        </header>
      ) : null}

      {items.length > 0 ? (
        <div className={variant === 'line' ? '' : 'space-y-3'}>
          {items.map((item) => (
            <IrisListRow key={item.id} item={item} variant={variant} />
          ))}
        </div>
      ) : (
        <div className="rounded-[22px] border border-dashed border-[#C7CFCC] bg-white/40 p-5">
          <p className="text-sm font-semibold text-[#1B3A2E]">{emptyTitle}</p>
          <p className="mt-2 text-sm leading-6 text-[#747D79]">
            {emptyDescription}
          </p>
        </div>
      )}

      {footer ? <div className="mt-5">{footer}</div> : null}
    </section>
  );
}