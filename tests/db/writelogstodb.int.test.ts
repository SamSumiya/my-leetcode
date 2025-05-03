import pool from '../../src/db/index';
import { writeLogToDB } from '../../src/db/writeLogsToDB';
import { LogEntryMeta } from '../../src/types';

describe('Integration Test: writeLogToDB', () => {
  let entryData: LogEntryMeta;
  beforeAll(() => {
    entryData = {
      slug: 'fake-leetcode',
      status: '✅ Pass',
      approach: 'fake-approach',
      starred: false,
    };
  });

  // TODO[refactor] extract this to a helperFunction deleteTestLog
  afterEach(async () => {
    const response = await pool.query(`DELETE FROM logs where slug = $1`, [entryData.slug]);
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
      `SELECT * FROM logs WHERE slug = $1 ORDER BY id DESC LIMIT 1`,
      [entryData.slug]
    );
    const row = response.rows[0];

    expect(row.slug).toEqual(entryData.slug);
    expect(row.status).toEqual(entryData.status);
    expect(row.approach).toEqual(entryData.approach);
    expect(row.starred).toEqual(entryData.starred);
    expect(new Date(row.date).toISOString()).toMatch(/\d{4}-\d{2}-\d{2}T/);
  });

  it('should throw an error if a required fild is missing', async () => {
    const badEntry = {
      ...entryData,
      slug: null as any,
    };
    await expect(writeLogToDB(badEntry)).rejects.toThrow();
  });
});
