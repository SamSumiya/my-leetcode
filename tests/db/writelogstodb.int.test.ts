// import { write } from 'fs';
import pool from '../../src/db';
import { writeLogToDB } from '../../src/db/writeLogsToDB';
import { LogEntry } from '../../src/types';
import { format } from 'date-fns';

describe('Integration Test: writeLogsToDB', () => {
  let logData: LogEntry;
  beforeEach(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    logData = {
      date: today,
      title: 'Two Sum',
      url: 'https://leetcode.com/problems/two-sum',
      difficulty: 'Easy',
      status: '✅ Pass',
      approach: 'Hash map',
      tags: ['array', 'hashmap'],
      starred: false,
    };
  });

  // TODO extract the following deleteLog to a function
  afterEach(async () => {
    await pool.query(
      `
      DELETE FROM logs WHERE title = $1 AND url = $2 AND date = $3
    `,
      [logData.title, logData.url, logData.date]
    );
  });

  afterAll(() => {
    pool.end();
  });

  it('should write a log entry to db', async () => {
    await writeLogToDB(logData);

    const result = await pool.query(
      `SELECT * FROM logs WHERE title = $1 AND url = $2 AND date = $3 ORDER BY id DESC LIMIT 1`,
      [logData.title, logData.url, logData.date]
    );
    const row = result.rows[0];

    expect(row.title).toBe(logData.title);
    expect(row.url).toBe(logData.url);
    expect(row.difficulty).toBe(logData.difficulty);
    expect(row.status).toBe(logData.status);
    expect(row.approach).toBe(logData.approach);
    expect(row.starred).toBe(logData.starred);
    expect(format(new Date(row.date), 'yyyy-MM-dd')).toBe(logData.date);
    expect(row.tags).toEqual(expect.arrayContaining(logData.tags));
  });
});
