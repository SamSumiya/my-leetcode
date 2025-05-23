/* eslint-disable no-unused-vars */
const mockPool = {
  query: jest.fn().mockImplementation((sql: string, _values: LogEntryMeta[]) => {
    if (sql.includes('INSERT')) {
      return Promise.resolve({
        rows: [{ data: 'fake-data here...' }],
      });
    }
    return Promise.resolve({ rows: [] });
  }),
  end: jest.fn().mockResolvedValue('pool connected ended!'),
};

jest.mock('../../src/db/index', () => {
  return {
    __esModule: true,
    default: mockPool,
  };
});

import pool from '../../src/db/index';
import { writeLogToDB } from '../../src/db/writeLogsToDB';
import { LogEntryMeta } from '../../src/types';
describe('writeLogToDB', () => {
  let newEntry: LogEntryMeta;

  beforeEach(() => {
    newEntry = {
      slug: 'fake-title',
      status: '✅ Pass',
      approach: 'fake-approach',
      starred: false,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should fail to log to db', async () => {
    (pool.query as jest.Mock).mockRejectedValueOnce(new Error('DB error'));
    await expect(writeLogToDB(newEntry)).rejects.toThrow('DB error');
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  it('Should insert log entry with correct SQL and values', async () => {
    await writeLogToDB(newEntry);
    const [sql, values] = (pool.query as jest.Mock).mock.calls[0];
    expect(sql).toMatch('INSERT INTO logs');
    expect(values).toEqual([newEntry.slug, newEntry.status, newEntry.approach, newEntry.starred]);
    expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO logs'), [
      newEntry.slug,
      newEntry.status,
      newEntry.approach,
      newEntry.starred,
    ]);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  it('should return fake data from the function call with keyword insert', async () => {
    const fakeData = await pool.query('INSERT ...');
    expect(pool.query).toHaveBeenCalledWith('INSERT ...');
    expect(fakeData.rows[0].data).toBe('fake-data here...');
  });

  it('should return fall back value which is an empty []', async () => {
    const val = await pool.query('SOMETHINGELSE ...');
    expect(pool.query).toHaveBeenCalledWith('SOMETHINGELSE ...');
    expect(val.rows).toEqual([]);
  });

  it('Should resolve mockPool.end and return expected message', async () => {
    const message = await pool.end();
    expect(message).toBe('pool connected ended!');
  });
});
