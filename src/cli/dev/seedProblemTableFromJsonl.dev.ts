// 1. Built-in Node.js modules
import fs from 'fs';
import readline from 'readline';

// 2. Third-party modules
import pool from '../../db';

// 3. Internal modules (aliases or relative paths)
import { ProblemMeta } from '../../types';
import { parseFlags } from '../../utils/parseFlags';
import { resolveFilePath } from '../../utils/resolveFilePath';
import { sanitizeProblemEntries } from '../../utils/sanitize/sanitizeProblem';
import { insertIntoProblemTable } from '../../db/problems';

async function deleteDataFromProblemTable() {
  await pool.query(`DELETE FROM problems`);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  let newRows = 0;
  let skippedInvalidLineCount = 0;
  let skippedDuplicateLineCount = 0;
  let inserted = new Set();
  const args = process.argv.slice(2);
  const flags = parseFlags(args);
  const batchSize = flags.limit ?? Infinity;
  const absPath = resolveFilePath(flags.file);
  // const tableName = flags.table;

  if (flags.invalidInput.length > 0) {
    console.log(`❌ Invalid CLI input: ${flags.invalidInput.join(', ')}`);
    return;
  }

  if (flags.noDelete) {
    console.log('🍀 Previous DB data was not delete');
  } else {
    await deleteDataFromProblemTable();
  }

  const rl = readline.createInterface({
    input: fs.createReadStream(absPath, { encoding: 'utf-8' }),
    crlfDelay: Infinity,
  });

  let processed = 0;
  for await (const line of rl) {
    if (!line.trim()) {
      skippedInvalidLineCount++;
      continue;
    }

    try {
      const parsedLine = JSON.parse(line);
      const sanitizedProblemEntry = sanitizeProblemEntries(parsedLine);

      if (!sanitizedProblemEntry) {
        skippedInvalidLineCount++;
        continue;
      }

      if (inserted.has(sanitizedProblemEntry.slug)) {
        skippedDuplicateLineCount++;
        continue;
      }

      if (flags.dryRun) {
        console.log(`[Dry Run] Would insert: ${sanitizedProblemEntry.slug}`);
      } else {
        const response = await insertIntoProblemTable(sanitizedProblemEntry);
        newRows += response.rowCount ?? 0;
      }

      inserted.add(sanitizedProblemEntry.slug);
      processed++;

      if (processed % batchSize === 0 && flags.delay > 0) {
        console.log(`⏸️ Pausing for ${flags.delay}ms after ${processed} rows...`);
        await sleep(flags.delay);
      }
    } catch (err) {
      console.error('❌ JSON parse error on the following line:\n');
      console.error(line);
      console.error('\n📍 Error message:', (err as Error).message);
    }
  }

  rl.close();
  console.log(`📄 Using file: ${absPath}`);
  if (skippedInvalidLineCount > 0) {
    console.log(
      `⚠️ Skipped ${skippedInvalidLineCount} invalid ${skippedInvalidLineCount > 1 ? 'entries' : 'entry'}`
    );
  }
  if (skippedDuplicateLineCount > 0) {
    console.log(
      `⚠️  Skipped ${skippedDuplicateLineCount} duplicate ${skippedDuplicateLineCount > 1 ? 'entries' : 'entry'}`
    );
  }
  console.log(`🪵  Logged ${newRows} new row${newRows < 1 ? '' : 's'}`);
  await pool.end();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
