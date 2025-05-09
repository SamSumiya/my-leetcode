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
  const args = process.argv.slice(0);
  const filePath = parseFlags(args);
  const path = resolveFilePath(filePath.file);

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
    ⚠️ Skipped ${invalidLogCount} invalid ${invalidLogCount > 1 ? 'entries' : 'entry'}
    `);
  await pool.end();
}

main()
  .then(process.exit(0))
  .catch((err) => {
    console.log(`Error: ${err}`);
    process.exit(1);
  });
