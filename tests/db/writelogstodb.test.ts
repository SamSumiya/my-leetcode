const mockPool = {
  query: jest.fn().mockResolvedValue({
    rows: [{ data: 'fake_value' }],
  }),
  end: jest.fn(),
};

jest.mock('../../src/db/index', () => {
  return {
    __esModule: true,
    default: mockPool,
  };
});

import pool from '../../src/db/index';
import { LogEntry } from '../../src/types';
import { writeLogToDB } from '../../src/db/writeLogsToDB';

describe('writeLogToDB', () => {
  let fakeLog: LogEntry;
  fakeLog = {
    date: 'today',
    title: 'Two Sum',
    url: 'https://leetcode.com/problems/two-sum',
    difficulty: 'Easy',
    status: '✅ Pass',
    approach: 'Hash map',
    tags: ['array'],
    starred: false,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockPool.end();
  });

  it('should call pool.query with correct SQL and values', async () => {
    const data = await writeLogToDB(fakeLog);
    // const [sql, values] = (pool.query as jest.Mock).mock.calls[0];
    const [sql, values] = mockPool.query.mock.calls[0];

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(sql).toMatch(/INSERT INTO logs/);
    expect(values).toEqual([
      fakeLog.date,
      fakeLog.title,
      fakeLog.url,
      fakeLog.difficulty,
      fakeLog.status,
      fakeLog.approach,
      fakeLog.tags,
      fakeLog.starred,
    ]);

    expect(data.rows[0].data).toBe('fake_value');
  });
});
