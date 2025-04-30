import { runMigrations } from '../../../src/db/migrate';
import pool from '../../../src/db';
import fs from 'fs';
// TODO: refactor these tests cases to accomendate more files in the directory and add // tests/db/migrations/__mocks__/mockMigrations.ts
// TODO: add tests/__mocks__/createDefaultMock.ts

jest.mock('../../../src/db', () => {
  const mockPool = {
    query: jest.fn(),
    end: jest.fn().mockResolvedValue('Pool Closed!'),
  };

  return {
    __esModule: true,
    default: mockPool,
  };
});

jest.mock('fs', () => ({
  readdirSync: jest.fn(() => ['001_fake_file.sql']),
  readFileSync: jest.fn(() => 'FAKE SQL CONTENT;'),
}));

const mockFs = fs as jest.Mocked<typeof fs>;

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

  it('should throw an error if no files in migration', async () => {
    mockFs.readdirSync.mockReturnValueOnce([]);
    await expect(runMigrations()).rejects.toThrow('process.exit: 0');
    expect(pool.query).not.toHaveBeenCalled();
  });

  it('should apply migrations successfully and close pool', async () => {
    expect.assertions(4);

    await expect(runMigrations()).rejects.toThrow('process.exit: 0');

    expect(pool.query).toHaveBeenCalledWith('FAKE SQL CONTENT;');
    expect(pool.query).toHaveBeenCalledTimes(1);

    const messageFromEnd = await pool.end();
    expect(messageFromEnd).toBe('Pool Closed!');
  });

  it('should mock read file and return content from files', () => {
    expect.assertions(2);
    const file = mockFs.readdirSync('fake/path/to/migrations');
    const content = mockFs.readFileSync('fake_contents');
    expect(file).toEqual(['001_fake_file.sql']);
    expect(content).toBe('FAKE SQL CONTENT;');
  });

  // it('should handle migration fail and throw error', async () => {
  //   expect.assertions(2);
  //   (pool.query as jest.Mock).mockRejectedValueOnce(new Error('failed migration'));
  //   await expect(runMigrations()).rejects.toThrow('failed migration');
  //   expect(pool.query).toHaveBeenCalledTimes(1);
  // });
  it('should handle migration fail and throw error', async () => {
    expect.assertions(2);

    const originalConsoleError = console.error;
    console.error = jest.fn(); // suppress expected error log

    (pool.query as jest.Mock).mockRejectedValueOnce(new Error('failed migration'));
    await expect(runMigrations()).rejects.toThrow('failed migration');
    expect(pool.query).toHaveBeenCalledTimes(1);

    console.error = originalConsoleError; // restore after test
  });
});
