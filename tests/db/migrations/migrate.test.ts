import { runMigrations } from '../../../src/db/migrate';
import pool from '../../../src/db';
import fs from 'fs';

jest.mock('../../../src/db', () => ({
  query: jest.fn(),
  end: jest.fn(),
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

  it('main should return FAKE SQL CONTENT;', async () => {
    expect.assertions(3);

    await expect(runMigrations()).rejects.toThrow('process.exit: 0');

    expect(pool.query).toHaveBeenCalledWith('FAKE SQL CONTENT;');
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
});
