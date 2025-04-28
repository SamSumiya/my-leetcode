import fs from 'fs';
import path from 'path';

export function getMigrationAbsPath(): string {
  return path.join(__dirname, '../migrations');
}

export function getFilesFromMigrations(migrationsDirPath: string): string[] {
  const files = fs.readdirSync(migrationsDirPath);
  return files.sort();
}

export function getMigrationFileAbsPath(migrationsAbsPath: string, filePath: string): string {
  return path.resolve(migrationsAbsPath, filePath);
}

export function readMigrationFile(fileAbsPath: string): string {
  return fs.readFileSync(fileAbsPath, 'utf-8');
}
