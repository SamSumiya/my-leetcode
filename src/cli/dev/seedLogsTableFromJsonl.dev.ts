import readline from 'readline';
import fs from 'fs';

import pool from '../../db';

import { resolveFilePath } from '../../utils/resolveFilePath';
import { parseFlags } from '../../utils/parseFlags';
import { sanitizeLogs } from '../../utils/sanitize/sanitizeLog';
import { deleteDuplicateToSeconds, insertIntoLogs } from '../../db/logs';
import { DeleteAllFromTable } from '../../db/utils/dbUtils';

async function main() {
  let invalidLogCount = 0;
  const args = process.argv.slice(2);
  const flags = parseFlags(args);
  const path = resolveFilePath(flags.file);
  const noDelete = flags.noDelete;
  const tableName = flags.deleteTable;

  if (flags.invalidInput.length > 0) {
    console.log(`❌ Invalid CLI input: ${flags.invalidInput.join(', ')}`);
    return;
  }

  if (noDelete) {
    console.log(`🍀 No previous logs table was deleted
    `);
  } else {
    if (tableName) {
      const deletedCount = await DeleteAllFromTable(tableName);
      console.log(`🚛 Delete ${deletedCount} rows from table`);
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
      await insertIntoLogs(sanitizedData);
    } catch (err) {
      console.error(`❌ Faild to read line - ${err}`);
    }
  }

  if (flags.dedupe) {
    const { rowCount } = await deleteDuplicateToSeconds();

    const deleted = rowCount ?? 0;
    if (deleted > 0) {
      console.log(`🧹 Removed ${rowCount} duplicate log entr${rowCount === 1 ? 'y' : 'ies'}`);
    } else {
      console.log('🧼 No exact timestamp duplicates found.');
    }
  }

  rl.close();
  console.log(`📄 Using file: ${path}`);
  console.log(`⚠️ Skipped ${invalidLogCount} invalid ${invalidLogCount > 1 ? 'entries' : 'entry'}`);
  await pool.end();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(`Error: ${err}`);
    process.exit(1);
  });
