import path from 'path';
import fs from 'fs';

import { getMigrationAbsPath } from '../../../src/db/migrationHelps';
import { getFilesFromMigrations } from '../../../src/db/migrationHelps';
import { getMigrationFileAbsPath } from '../../../src/db/migrationHelps';
import { readMigrationFile } from '../../../src/db/migrationHelps';

// const mockedFs = fs as jest.Mocked<typeof fs>;

jest.mock('fs', () => ({
  readdirSync: jest.fn().mockReturnValue(['file1', 'file2']),
  readFileSync: jest.fn(),
}));

describe('Testing migration helper functions', () => {
  it('should return the correct migrations absolute path', () => {
    const expectedPath = path.join(__dirname, '../../../src/migrations');
    const migrationAbsPath = getMigrationAbsPath();
    expect(migrationAbsPath).toBe(expectedPath);
  });

  it('should read the folder and return an array with file titles', () => {
    const files = getFilesFromMigrations('fake/path');
    expect(files).toEqual(['file1', 'file2']);
    expect(fs.readdirSync).toHaveBeenCalledWith('fake/path');
  });
});
