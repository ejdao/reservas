export interface DateRangeI {
  start: Date;
  end: Date;
}

type DayForHumans = 'Lunes' | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes' | 'Sabado' | 'Domingo';

const rangeOneDay = (start: Date, end?: Date, manageTimeZone?: 'add' | 'remove'): DateRangeI => {
  if (typeof start === 'string') start = new Date(`${start}T00:00:00.000Z`);
  else start = new Date(`${start.toISOString().split('T')[0]}T00:00:00.000Z`);
  if (end) {
    if (typeof end === 'string') end = new Date(`${end}T00:00:00.000Z`);
    else end = new Date(`${end.toISOString().split('T')[0]}T00:00:00.000Z`);
    end = new Date(end.getTime() + 86399000);
  } else end = new Date(start.getTime() + 86399000);
  if (!manageTimeZone) return { start, end };
  else {
    return {
      start: DATE_UTILITIES.manageTimeZone(start, 'add'),
      end: DATE_UTILITIES.manageTimeZone(end, 'add'),
    };
  }
};

const manageTimeZone = (date: Date, key: 'remove' | 'add') => {
  let value = 18000000;
  return key === 'add' ? new Date(date.getTime() + value) : new Date(date.getTime() - value);
};

const parseMinutesToDate = (date: Date, minutes: number) => {
  if (typeof date === 'string') date = new Date(`${date}T00:00:00.000Z`);
  else date = new Date(`${date.toISOString().split('T')[0]}T00:00:00.000Z`);
  const res = new Date(date.getTime() + minutes * 60000);
  return res;
};

const generateRangesByInterval = (dateRanges: DateRangeI[], interval: number): DateRangeI[] => {
  const result: DateRangeI[] = [];
  const intervalMs = interval * 60 * 1000;
  for (const dateRange of dateRanges) {
    let cursor = new Date(dateRange.start);
    while (cursor.getTime() + intervalMs <= dateRange.end.getTime()) {
      const start = new Date(cursor);
      const end = new Date(cursor.getTime() + intervalMs);
      result.push({ start, end });
      cursor = end;
    }
  }
  return result;
};

const dayForHumans = (day: Date): DayForHumans => {
  const dayOfWeek = day.getDay();
  if (dayOfWeek === 0) return 'Domingo';
  if (dayOfWeek === 1) return 'Lunes';
  if (dayOfWeek === 2) return 'Martes';
  if (dayOfWeek === 3) return 'Miercoles';
  if (dayOfWeek === 4) return 'Jueves';
  if (dayOfWeek === 5) return 'Viernes';
  if (dayOfWeek === 6) return 'Sabado';
};

export const DATE_UTILITIES = {
  rangeOneDay,
  parseMinutesToDate,
  manageTimeZone,
  generateRangesByInterval,
  dayForHumans,
};
