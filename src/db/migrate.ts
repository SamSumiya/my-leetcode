import pool from '../db';
import {
  getFilesFromMigrations,
  getMigrationAbsPath,
  getMigrationFileAbsPath,
  readMigrationFile,
} from './migrationHelps';

export async function main() {
  const migrateDirPath = getMigrationAbsPath();
  const files = getFilesFromMigrations(migrateDirPath);

  for (let file of files) {
    const filePath = getMigrationFileAbsPath(migrateDirPath, file);
    const content = readMigrationFile(filePath);
    await pool.query(content);
  }
}

export async function runMigrations() {
  try {
    await main();
    console.log('✅ All migrations applied successfully.');
    process.exit(0);
  } catch (err) {
    if (err instanceof Error && err.message.startsWith('process.exit')) {
      throw err;
    }
    console.error('❌ Encountered an error during migration:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  runMigrations();
}
