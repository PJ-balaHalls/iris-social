import type { SettingsField } from '@/lib/settings/settingsFields';

type SettingsFieldRendererProps = {
  field: SettingsField;
  value: unknown;
};

function stringifyValue(value: unknown) {
  if (value === null || value === undefined) return '';

  if (Array.isArray(value)) {
    return value.join('\n');
  }

  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

const fieldClassName =
  'mt-2 w-full rounded-[18px] border border-emerald-950/10 bg-white/70 px-4 py-3 text-sm text-[#1B3A2E] shadow-sm outline-none transition focus:border-[#9A7CA7] focus:ring-4 focus:ring-[#9A7CA7]/15';

export function SettingsFieldRenderer({
  field,
  value,
}: SettingsFieldRendererProps) {
  const currentValue = stringifyValue(value);
  const isReadonly = field.readonly || field.type === 'readonly';

  return (
    <label className="block rounded-[24px] border border-white/70 bg-white/35 p-4">
      <span className="text-sm font-semibold text-[#1B3A2E]">
        {field.label}
      </span>

      {field.helper ? (
        <span className="mt-1 block text-xs leading-5 text-[#747D79]">
          {field.helper}
        </span>
      ) : null}

      {isReadonly ? (
        <pre className="mt-3 max-h-44 overflow-auto rounded-[18px] border border-emerald-950/10 bg-[#F2F4F3]/80 p-4 text-xs leading-5 text-[#476153]">
          {currentValue || '—'}
        </pre>
      ) : field.type === 'select' ? (
        <select
          name={field.name}
          defaultValue={currentValue}
          className={fieldClassName}
        >
          <option value="">Selecionar</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : field.type === 'textarea' ||
        field.type === 'json' ||
        field.type === 'array' ? (
        <textarea
          name={field.name}
          defaultValue={currentValue}
          rows={field.rows || (field.type === 'array' ? 7 : 8)}
          placeholder={field.placeholder}
          spellCheck={field.type !== 'json'}
          className={`${fieldClassName} font-mono text-xs leading-5`}
        />
      ) : (
        <input
          name={field.name}
          type={
            field.type === 'date' ||
            field.type === 'color' ||
            field.type === 'email'
              ? field.type
              : 'text'
          }
          defaultValue={currentValue}
          placeholder={field.placeholder}
          className={
            field.type === 'color'
              ? `${fieldClassName} h-14 p-2`
              : fieldClassName
          }
        />
      )}
    </label>
  );
}