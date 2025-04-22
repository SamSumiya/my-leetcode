export function freezeDate(year: number, month: number, day: number): void {
  const date = new Date(year, month, day);
  jest.useFakeTimers();
  jest.setSystemTime(date);
}
