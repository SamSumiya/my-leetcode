import pool from '../../src/db/index';
import { writeLogToDB } from '../../src/db/writeLogsToDB';
import { LogEntry } from '../../src/types';
import { format } from 'date-fns';

describe('Integration Test: writeLogToDB', () => {
  let entryData: LogEntry;
  beforeAll(() => {
    entryData = {
      date: '2025-05-01',
      title: 'fake-leetcode',
      url: 'https://leetcode.com/problems/fake-leetcode/description/?envType=study-plan-v2&envId=leetcode-75',
      difficulty: 'Easy',
      status: '✅ Pass',
      approach: 'fake-approach',
      tags: ['tag-A', 'tag-B'],
      starred: false,
    };
  });

  // TODO[refactor] extract this to a helperFunction deleteTestLog
  afterEach(async () => {
    const response = await pool.query(
      `DELETE FROM logs where date = $1 AND title = $2 AND url = $3`,
      [entryData.date, entryData.title, entryData.url]
    );
    if (!expect.getState().currentTestName?.includes('throw an error')) {
      expect(response.rowCount).toBe(1);
    }
  });

  afterAll(() => {
    pool.end();
  });

  // TODO[refactor] extract this to a helperFunction readLogsFromDB
  it('should insert entry data to db', async () => {
    await writeLogToDB(entryData);
    const response = await pool.query(
      `SELECT * FROM logs WHERE title = $1 AND url = $2 AND date = $3 ORDER BY id DESC LIMIT 1`,
      [entryData.title, entryData.url, entryData.date]
    );
    const row = response.rows[0];

    expect(row.title).toEqual(entryData.title);
    expect(row.url).toEqual(entryData.url);
    expect(row.difficulty).toEqual(entryData.difficulty);
    expect(row.status).toEqual(entryData.status);
    expect(row.approach).toEqual(entryData.approach);
    expect(row.starred).toEqual(entryData.starred);
    expect(row.tags).toEqual(expect.arrayContaining(entryData.tags));
    expect(format(new Date(row.date), 'yyyy-MM-dd')).toBe(entryData.date);
  });

  it('should throw an error if a required fild is missing', async () => {
    const badEntry = {
      ...entryData,
      title: null as any,
    };
    await expect(writeLogToDB(badEntry)).rejects.toThrow();
  });
});
