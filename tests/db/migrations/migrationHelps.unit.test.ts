import path from 'path';
import fs from 'fs';

import { getMigrationAbsPath } from '../../../src/db/migrationHelps';
import { getFilesFromMigrations } from '../../../src/db/migrationHelps';
import { getMigrationFileAbsPath } from '../../../src/db/migrationHelps';
import { readMigrationFile } from '../../../src/db/migrationHelps';

// const mockedFs = fs as jest.Mocked<typeof fs>;

jest.mock('fs', () => ({
  readdirSync: jest.fn().mockReturnValue(['010file', '001file', '002file']),
  readFileSync: jest.fn().mockReturnValue('fake contents here!'),
}));

describe('Testing migration helper functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the correct migrations absolute path', () => {
    const expectedPath = path.join(__dirname, '../../../src/migrations');
    const migrationAbsPath = getMigrationAbsPath();
    expect(migrationAbsPath).toBe(expectedPath);
  });

  it('should read the folder and return an array with file titles', () => {
    const files = getFilesFromMigrations('fake/path');
    expect(files).toEqual(['001file', '002file', '010file']);
    expect(fs.readdirSync).toHaveBeenCalledWith('fake/path');
  });

  it('should return absolute path for each migration file', () => {
    const absPath = path.join(__dirname, '../../../src/migrations');
    const fileName = '/fakePath';
    const pathName = getMigrationFileAbsPath(absPath, fileName);
    const expectedPath = path.resolve(absPath, fileName);
    expect(pathName).toBe(expectedPath);
  });

  it('should return file and return the content', () => {
    const fakePath = 'fake/path';
    const content = readMigrationFile(fakePath);
    expect(content).toBe('fake contents here!');
    expect(fs.readFileSync).toHaveBeenCalledWith(fakePath, 'utf-8');
  });
});
