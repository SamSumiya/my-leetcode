import { format } from 'date-fns';

export function todayOrYesterday(dateOption: string): string {
  const now = new Date();
  const date = dateOption === 'yesterday' ? new Date(now.setDate(now.getDate() - 1)) : now;

  return format(date, 'MM-dd-yyyy');
}
