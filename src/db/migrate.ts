import fs from 'fs';
import path from 'path';
import pool from '../db';

async function main() {
  const migrateDirPath = path.join(__dirname, '../migrations');
  const files = fs.readdirSync(migrateDirPath).sort();

  for (let file of files) {
    const filePath = path.resolve(migrateDirPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');
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
