import { format } from 'date-fns';

export function todayOrYesterday(dateOption: string): string {
  const base = new Date();
  const year = base.getFullYear();
  const month = base.getMonth();
  const day = base.getDate();

  const date =
    dateOption === 'yesterday' ? new Date(year, month, day - 1) : new Date(year, month, day);

  return format(date, 'MM-dd-yyyy');
}
