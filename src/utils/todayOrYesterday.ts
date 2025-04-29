import { format } from 'date-fns';

export function todayOrYesterday(date: string): string {
  const base = new Date();
  const year = base.getFullYear();
  const month = base.getMonth();
  const day = base.getDate();

  const d = date === 'yesterday' ? new Date(year, month, day - 1) : new Date(year, month, day);

  return format(d, 'MM-dd-yyyy');
}
