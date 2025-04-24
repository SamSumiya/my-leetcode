import { todayOrYesterday } from '../../src/utils/todayOrYesterday';
import { freezeDate } from '.././utils/freezeDate';

describe('todayOrYesterday', () => {
  beforeAll(() => {
    freezeDate(2025, 3, 21);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("returns today's date", () => {
    expect(todayOrYesterday('today')).toBe('04-21-2025');
  });

  it("returns yesterday's date", () => {
    expect(todayOrYesterday('yesterday')).toBe('04-20-2025');
  });
});
