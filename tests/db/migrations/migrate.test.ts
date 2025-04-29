import { runMigrations } from '../../../src/db/migrate';
import pool from '../../../src/db';
// TODO: refactor these tests cases to accomendate more files in the directory and add // tests/db/migrations/__mocks__/mockMigrations.ts

jest.mock('../../../src/db', () => ({
  query: jest.fn(),
  end: jest.fn().mockResolvedValue('Pool Closed!'),
}));

jest.mock('fs', () => ({
  readdirSync: jest.fn(() => ['001_fake_file.sql']),
  readFileSync: jest.fn(() => 'FAKE SQL CONTENT;'),
}));

describe('Migration runner ', () => {
  let mockExit: jest.SpyInstance;

  beforeAll(() => {
    mockExit = jest.spyOn(process, 'exit').mockImplementation((code?: string | number | null) => {
      throw new Error(`process.exit: ${code}`);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockExit.mockRestore();
  });

  it('should apply migrations successfully and close pool', async () => {
    expect.assertions(4);

    await expect(runMigrations()).rejects.toThrow('process.exit: 0');

    expect(pool.query).toHaveBeenCalledWith('FAKE SQL CONTENT;');
    expect(pool.query).toHaveBeenCalledTimes(1);

    const messageFromEnd = await pool.end();
    expect(messageFromEnd).toBe('Pool Closed!');
  });

  it('should handle migration fail and throw error', async () => {
    expect.assertions(2);
    (pool.query as jest.Mock).mockRejectedValueOnce(new Error('failed migration'));
    await expect(runMigrations()).rejects.toThrow('failed migration');
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
});
