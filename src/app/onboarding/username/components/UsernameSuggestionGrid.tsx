'use client';

type UsernameSuggestionGridProps = {
  suggestions: string[];
  selected?: string;
  loading?: boolean;
  onSelect: (username: string) => void;
};

export function UsernameSuggestionGrid({
  suggestions,
  selected,
  loading = false,
  onSelect,
}: UsernameSuggestionGridProps) {
  if (loading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-10 w-28 animate-pulse rounded-full border border-[#DDE6DA]/70 bg-white/32"
          />
        ))}
      </div>
    );
  }

  if (!suggestions.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((username) => {
        const isSelected = selected === username;

        return (
          <button
            key={username}
            type="button"
            onClick={() => onSelect(username)}
            className={[
              'min-h-10 rounded-full border px-4 text-sm font-semibold transition-all duration-200',
              isSelected
                ? 'border-emerald-800 bg-emerald-800 text-white shadow-[0_10px_24px_rgba(0,44,31,0.18)]'
                : 'border-emerald-800/10 bg-white/[0.32] text-[#002c1f] hover:border-emerald-800/24 hover:bg-emerald-800/10',
            ].join(' ')}
          >
            @{username}
          </button>
        );
      })}
    </div>
  );
}
