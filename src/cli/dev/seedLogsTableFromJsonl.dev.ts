import readline from 'readline';
import fs from 'fs';

import pool from '../../db';

import { LogEntryMeta } from '../../types';

import { resolveFilePath } from '../../utils/resolveFilePath';
import { parseFlags } from '../../utils/parseFlags';
import { sanitizeLogs } from '../../utils/sanitize/sanitizeLog';

async function insertIntoDB(logData: LogEntryMeta): Promise<void> {
  await pool.query(
    `
        INSERT INTO logs ( slug, status, approach, starred )
        VALUES ( $1, $2, $3, $4) 
    `,
    [logData.slug, logData.status, logData.approach, logData.starred]
  );
}

async function main() {
  let invalidLogCount = 0;
  const args = process.argv.slice(2);
  const flags = parseFlags(args);
  const path = resolveFilePath(flags.file);

  if (flags.dedupe) {
    const { rowCount } = await pool.query(`
        DELETE FROM logs
        WHERE id IN (
          SELECT id
          FROM (
            SELECT id,
                   ROW_NUMBER() OVER (
                     PARTITION BY slug, status, approach, starred, date_trunc('second', date)
                     ORDER BY id
                   ) AS row_num
            FROM logs
          ) sub
          WHERE sub.row_num > 1
        );
      `);
    const deleted = rowCount ?? 0;
    if (deleted > 0) {
      console.log(`🧹 Removed ${rowCount} duplicate log entr${rowCount === 1 ? 'y' : 'ies'}`);
    } else {
      console.log('🧼 No exact timestamp duplicates found.');
    }
  }

  const rl = readline.createInterface({
    input: fs.createReadStream(path, { encoding: 'utf-8' }),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    try {
      const parsedLine = JSON.parse(line);
      const sanitizedData = sanitizeLogs(parsedLine);
      if (!sanitizedData) {
        invalidLogCount++;
        continue;
      }
      await insertIntoDB(sanitizedData);
    } catch (err) {
      console.error(`❌ Faild to read line - ${err}`);
    }
  }

  rl.close();
  console.log(`
    📄 Using file: ${path}`);
  console.log(`
    ⚠️ Skipped ${invalidLogCount} invalid ${invalidLogCount > 1 ? 'entries' : 'entry'}
    `);
  await pool.end();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(`Error: ${err}`);
    process.exit(1);
  });
