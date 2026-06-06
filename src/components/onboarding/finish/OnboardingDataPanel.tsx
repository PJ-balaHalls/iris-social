'use client';

import { buildOnboardingSections, buildOnboardingSnapshot } from '@/lib/onboarding/onboardingSnapshot';

type OnboardingDataPanelProps = {
  state: any;
  compact?: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isEmptyValue(value: unknown) {
  if (value === null || value === undefined || value === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (isRecord(value) && Object.keys(value).length === 0) return true;
  return false;
}

function formatKey(value: string) {
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function DataValue({ value, depth = 0 }: { value: unknown; depth?: number }) {
  if (isEmptyValue(value)) {
    return <span className="text-[#9AA4A1]">—</span>;
  }

  if (typeof value === 'string') {
    if (value.startsWith('data:image/') || value.startsWith('http')) {
      return (
        <div className="space-y-2">
          <span className="break-all text-xs text-[#476153]">{value}</span>
          {(value.includes('avatar') ||
            value.includes('cover') ||
            value.startsWith('data:image/')) && (
            <img
              src={value}
              alt=""
              className="max-h-40 w-full max-w-xs rounded-[18px] border border-white/70 object-cover"
            />
          )}
        </div>
      );
    }

    return <span className="break-words text-[#002c1f]">{value}</span>;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return <span className="text-[#002c1f]">{String(value)}</span>;
  }

  if (Array.isArray(value)) {
    const onlyPrimitive = value.every(
      (item) => typeof item !== 'object' || item === null
    );

    if (onlyPrimitive) {
      return (
        <div className="flex flex-wrap gap-2">
          {value.map((item, index) => (
            <span
              key={`${String(item)}-${index}`}
              className="rounded-full border border-white/70 bg-white/[0.30] px-3 py-1 text-xs font-semibold text-[#002c1f]"
            >
              {String(item)}
            </span>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {value.map((item, index) => (
          <div
            key={index}
            className="rounded-[18px] border border-white/70 bg-white/[0.22] p-3"
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#747D79]">
              Item {index + 1}
            </p>
            <DataValue value={item} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  if (isRecord(value)) {
    return (
      <div className={depth > 0 ? 'space-y-2' : 'space-y-3'}>
        {Object.entries(value).map(([key, item]) => (
          <div
            key={key}
            className={[
              'grid gap-2',
              depth > 1 ? 'grid-cols-1' : 'sm:grid-cols-[180px_1fr]',
            ].join(' ')}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#747D79]">
              {formatKey(key)}
            </p>
            <div className="min-w-0 text-sm leading-6">
              <DataValue value={item} depth={depth + 1} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <span className="text-[#002c1f]">{String(value)}</span>;
}

export function OnboardingDataPanel({
  state,
  compact = false,
}: OnboardingDataPanelProps) {
  const snapshot = buildOnboardingSnapshot(state);
  const sections = buildOnboardingSections(snapshot);

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <section
          key={section.title}
          className="rounded-[26px] border border-white/70 bg-white/[0.24] p-4 backdrop-blur-sm"
        >
          <div className="mb-4 flex items-center justify-between gap-4 border-b border-white/70 pb-3">
            <h2 className="font-display text-2xl tracking-[-0.035em] text-[#002c1f]">
              {section.title}
            </h2>

            <span className="rounded-full border border-white/70 bg-white/[0.30] px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[#747D79]">
              onboarding
            </span>
          </div>

          <DataValue value={section.data} />
        </section>
      ))}

      {!compact && (
        <section className="rounded-[26px] border border-white/70 bg-white/[0.24] p-4 backdrop-blur-sm">
          <div className="mb-4 border-b border-white/70 pb-3">
            <h2 className="font-display text-2xl tracking-[-0.035em] text-[#002c1f]">
              JSON completo
            </h2>
            <p className="mt-1 text-sm text-[#747D79]">
              Todos os dados coletados no onboarding em formato bruto.
            </p>
          </div>

          <pre className="max-h-[520px] overflow-auto rounded-[20px] border border-white/70 bg-white/[0.30] p-4 text-xs leading-6 text-[#002c1f]">
            {JSON.stringify(snapshot, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}
