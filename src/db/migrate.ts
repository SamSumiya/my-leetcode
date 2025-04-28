import pool from '../db';
import {
  getFilesFromMigrations,
  getMigrationAbsPath,
  getMigrationFileAbsPath,
  readMigrationFile,
} from './migrationHelps';

async function main() {
  const migrateDirPath = getMigrationAbsPath();
  const files = getFilesFromMigrations(migrateDirPath);

  for (let file of files) {
    const filePath = getMigrationFileAbsPath(migrateDirPath, file);
    const content = readMigrationFile(filePath);
    await pool.query(content);
  }
}

main()
  .then(() => {
    console.log('✅ All migrations applied successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Encountered an error during migration:', err);
    process.exit(1);
  });
