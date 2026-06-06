'use client';

import { useMemo, useState } from 'react';

type IrisCalendarFieldProps = {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  helper?: string;
  error?: string;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
};

type CalendarView = 'days' | 'months' | 'years';

const monthNames = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const shortMonthNames = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function formatDateToISO(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseISODate(value?: string) {
  if (!value) return null;

  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) return null;

  const parsed = new Date(year, month - 1, day);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
}

function formatDateToBR(value?: string) {
  const parsed = parseISODate(value);

  if (!parsed) return '';

  return `${pad(parsed.getDate())}/${pad(parsed.getMonth() + 1)}/${parsed.getFullYear()}`;
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function isSameSelectedDay(value: string, viewDate: Date, day: number) {
  const selected = parseISODate(value);

  if (!selected) return false;

  return (
    selected.getFullYear() === viewDate.getFullYear() &&
    selected.getMonth() === viewDate.getMonth() &&
    selected.getDate() === day
  );
}

function isOutOfRange(isoDate: string, minDate?: string, maxDate?: string) {
  if (minDate && isoDate < minDate) return true;
  if (maxDate && isoDate > maxDate) return true;
  return false;
}

function isMonthOutOfRange(year: number, month: number, minDate?: string, maxDate?: string) {
  const firstDay = formatDateToISO(new Date(year, month, 1));
  const lastDay = formatDateToISO(new Date(year, month + 1, 0));

  if (minDate && lastDay < minDate) return true;
  if (maxDate && firstDay > maxDate) return true;

  return false;
}

function getMonthMatrix(viewDate: Date) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstWeekDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: Array<number | null> = [];

  for (let index = 0; index < firstWeekDay; index += 1) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(day);
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
}

function getMinYear(minDate?: string) {
  return parseISODate(minDate)?.getFullYear() ?? new Date().getFullYear() - 120;
}

function getMaxYear(maxDate?: string) {
  return parseISODate(maxDate)?.getFullYear() ?? new Date().getFullYear();
}

function getYearPageEnd(year: number, minYear: number, maxYear: number) {
  return Math.min(maxYear, Math.max(minYear + 11, year + 5));
}

export function IrisCalendarField({
  id,
  label,
  value,
  onChange,
  helper,
  error,
  placeholder = 'Selecionar data',
  minDate,
  maxDate,
  disabled = false,
}: IrisCalendarFieldProps) {
  const minYear = getMinYear(minDate);
  const maxYear = getMaxYear(maxDate);

  const initialDate =
    parseISODate(value) ||
    parseISODate(maxDate) ||
    new Date(new Date().getFullYear() - 18, new Date().getMonth(), 1);

  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<CalendarView>('days');
  const [viewDate, setViewDate] = useState(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
  );
  const [yearPageEnd, setYearPageEnd] = useState(
    getYearPageEnd(initialDate.getFullYear(), minYear, maxYear)
  );

  const fieldId = id || label.toLowerCase().replace(/\s+/g, '-');
  const monthDays = useMemo(() => getMonthMatrix(viewDate), [viewDate]);

  const previousMonth = addMonths(viewDate, -1);
  const nextMonth = addMonths(viewDate, 1);

  const yearGrid = useMemo(
    () => Array.from({ length: 12 }, (_, index) => yearPageEnd - index),
    [yearPageEnd]
  );

  const canGoPrevious =
    viewMode === 'years'
      ? yearPageEnd - 12 >= minYear
      : viewMode === 'months'
        ? viewDate.getFullYear() - 1 >= minYear
        : !minDate ||
          formatDateToISO(
            new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0)
          ) >= minDate;

  const canGoNext =
    viewMode === 'years'
      ? yearPageEnd < maxYear
      : viewMode === 'months'
        ? viewDate.getFullYear() + 1 <= maxYear
        : !maxDate ||
          formatDateToISO(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1)) <= maxDate;

  const selectedLabel = formatDateToBR(value);

  function handlePrevious() {
    if (!canGoPrevious) return;

    if (viewMode === 'years') {
      setYearPageEnd((current) => Math.max(minYear + 11, current - 12));
      return;
    }

    if (viewMode === 'months') {
      setViewDate((current) => new Date(current.getFullYear() - 1, current.getMonth(), 1));
      return;
    }

    setViewDate(previousMonth);
  }

  function handleNext() {
    if (!canGoNext) return;

    if (viewMode === 'years') {
      setYearPageEnd((current) => Math.min(maxYear, current + 12));
      return;
    }

    if (viewMode === 'months') {
      setViewDate((current) => new Date(current.getFullYear() + 1, current.getMonth(), 1));
      return;
    }

    setViewDate(nextMonth);
  }

  function selectYear(year: number) {
    if (year < minYear || year > maxYear) return;

    setViewDate((current) => new Date(year, current.getMonth(), 1));
    setViewMode('months');
  }

  function selectMonth(month: number) {
    if (isMonthOutOfRange(viewDate.getFullYear(), month, minDate, maxDate)) return;

    setViewDate((current) => new Date(current.getFullYear(), month, 1));
    setViewMode('days');
  }

  function handleSelectDay(day: number) {
    const selectedISO = formatDateToISO(
      new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
    );

    if (isOutOfRange(selectedISO, minDate, maxDate)) return;

    onChange(selectedISO);
    setOpen(false);
    setViewMode('days');
  }

  return (
    <div className="relative w-full">
      <label
        htmlFor={fieldId}
        className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]"
      >
        {label}
      </label>

      <button
        id={fieldId}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={[
          'flex min-h-12 w-full items-center justify-between gap-4 rounded-[18px] border px-4 py-3 text-left',
          'bg-white/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.70)] outline-none backdrop-blur-xl',
          'transition-all duration-200 ease-out hover:border-emerald-800/25 hover:bg-emerald-800/[0.035]',
          'focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/10 disabled:cursor-not-allowed disabled:opacity-60',
          error ? 'border-[var(--color-danger)]' : 'border-[#DDE6DA]',
        ].join(' ')}
      >
        <span className={selectedLabel ? 'text-[#002c1f]' : 'text-[#9AA4A1]'}>
          {selectedLabel || placeholder}
        </span>

        <span
          className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.06] text-sm text-[#002c1f]"
          aria-hidden="true"
        >
          ◷
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-50 mt-3 overflow-hidden rounded-[30px] border border-emerald-800/12 bg-[#FAF7F2]/72 p-4 shadow-[0_28px_80px_rgba(0,44,31,0.16)] backdrop-blur-2xl sm:right-auto sm:w-[420px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(0,44,31,0.10),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.76),rgba(0,44,31,0.045))]" />

          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={!canGoPrevious}
                onClick={handlePrevious}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-800/12 bg-white/48 text-[#002c1f] shadow-sm transition-all hover:border-emerald-800/25 hover:bg-emerald-800/10 disabled:cursor-not-allowed disabled:opacity-35"
                aria-label="Voltar no calendário"
              >
                ‹
              </button>

              <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode('months')}
                  className={[
                    'rounded-full px-4 py-2 text-sm font-semibold transition-all',
                    viewMode === 'months'
                      ? 'bg-emerald-800 text-white shadow-[0_8px_20px_rgba(0,44,31,0.18)]'
                      : 'bg-white/46 text-[#002c1f] hover:bg-emerald-800/10',
                  ].join(' ')}
                >
                  {monthNames[viewDate.getMonth()]}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setYearPageEnd(getYearPageEnd(viewDate.getFullYear(), minYear, maxYear));
                    setViewMode('years');
                  }}
                  className={[
                    'rounded-full px-4 py-2 text-sm font-semibold transition-all',
                    viewMode === 'years'
                      ? 'bg-emerald-800 text-white shadow-[0_8px_20px_rgba(0,44,31,0.18)]'
                      : 'bg-white/46 text-[#002c1f] hover:bg-emerald-800/10',
                  ].join(' ')}
                >
                  {viewDate.getFullYear()}
                </button>
              </div>

              <button
                type="button"
                disabled={!canGoNext}
                onClick={handleNext}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-800/12 bg-white/48 text-[#002c1f] shadow-sm transition-all hover:border-emerald-800/25 hover:bg-emerald-800/10 disabled:cursor-not-allowed disabled:opacity-35"
                aria-label="Avançar no calendário"
              >
                ›
              </button>
            </div>

            {viewMode === 'years' && (
              <div className="grid grid-cols-3 gap-2">
                {yearGrid.map((year) => {
                  const disabledYear = year < minYear || year > maxYear;
                  const selectedYear = year === viewDate.getFullYear();

                  return (
                    <button
                      key={year}
                      type="button"
                      disabled={disabledYear}
                      onClick={() => selectYear(year)}
                      className={[
                        'min-h-12 rounded-[18px] border text-sm font-semibold transition-all duration-150',
                        selectedYear
                          ? 'border-emerald-800 bg-emerald-800 text-white shadow-[0_10px_24px_rgba(0,44,31,0.18)]'
                          : 'border-emerald-800/8 bg-white/46 text-[#002c1f] hover:border-emerald-800/22 hover:bg-emerald-800/10 hover:shadow-[0_10px_24px_rgba(0,44,31,0.08)]',
                        disabledYear ? 'cursor-not-allowed opacity-25 hover:bg-white/46 hover:shadow-none' : '',
                      ].join(' ')}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            )}

            {viewMode === 'months' && (
              <div className="grid grid-cols-3 gap-2">
                {shortMonthNames.map((month, index) => {
                  const disabledMonth = isMonthOutOfRange(
                    viewDate.getFullYear(),
                    index,
                    minDate,
                    maxDate
                  );
                  const selectedMonth = index === viewDate.getMonth();

                  return (
                    <button
                      key={month}
                      type="button"
                      disabled={disabledMonth}
                      onClick={() => selectMonth(index)}
                      className={[
                        'min-h-12 rounded-[18px] border text-sm font-semibold transition-all duration-150',
                        selectedMonth
                          ? 'border-emerald-800 bg-emerald-800 text-white shadow-[0_10px_24px_rgba(0,44,31,0.18)]'
                          : 'border-emerald-800/8 bg-white/46 text-[#002c1f] hover:border-emerald-800/22 hover:bg-emerald-800/10 hover:shadow-[0_10px_24px_rgba(0,44,31,0.08)]',
                        disabledMonth ? 'cursor-not-allowed opacity-25 hover:bg-white/46 hover:shadow-none' : '',
                      ].join(' ')}
                    >
                      {month}
                    </button>
                  );
                })}
              </div>
            )}

            {viewMode === 'days' && (
              <div className="grid grid-cols-7 gap-1 text-center">
                {weekDays.map((day, index) => (
                  <span
                    key={`${day}-${index}`}
                    className="py-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#747D79]"
                  >
                    {day}
                  </span>
                ))}

                {monthDays.map((day, index) => {
                  if (!day) {
                    return <span key={`empty-${index}`} className="h-10" />;
                  }

                  const isoDate = formatDateToISO(
                    new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
                  );

                  const selected = isSameSelectedDay(value, viewDate, day);
                  const disabledDay = isOutOfRange(isoDate, minDate, maxDate);

                  return (
                    <button
                      key={isoDate}
                      type="button"
                      disabled={disabledDay}
                      onClick={() => handleSelectDay(day)}
                      className={[
                        'flex h-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-150',
                        selected
                          ? 'bg-emerald-800 text-white shadow-[0_10px_24px_rgba(0,44,31,0.18)]'
                          : 'text-[#002c1f] hover:bg-emerald-800/10 hover:text-emerald-900 hover:shadow-[0_8px_18px_rgba(0,44,31,0.08)]',
                        disabledDay ? 'cursor-not-allowed opacity-25 hover:bg-transparent hover:shadow-none' : '',
                      ].join(' ')}
                      aria-label={`Selecionar ${pad(day)}/${pad(
                        viewDate.getMonth() + 1
                      )}/${viewDate.getFullYear()}`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <p id={`${fieldId}-error`} className="mt-1.5 text-sm text-[var(--color-danger)]">
          {error}
        </p>
      )}

      {helper && !error && (
        <p id={`${fieldId}-helper`} className="mt-1.5 text-sm text-[var(--color-text-muted)]">
          {helper}
        </p>
      )}
    </div>
  );
}
