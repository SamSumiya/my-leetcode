import { parseFlags } from '../flags/parseFlags';

// Validate entries
import { isLogEntry } from '../../utils/validator/isLogEntry';

import { createLineReader } from '../../utils/io/createLineReader';
import { sanitizeLogs } from '../../utils/sanitize/sanitizeLog';
import { insertIntoLogs } from '../../db/logs';
import { insertIntoProblemTable } from '../../db/problems';
import { sanitizeProblemEntries } from '../../utils/sanitize';

export async function seed() {
  const args = process.argv.slice(2);
  const flags = parseFlags(args);
  const filePath = flags.file;
  const tableName = flags.table;

  if (flags.invalidInput.length > 0) {
    console.log(`❌ Invalid CLI input: ${flags.invalidInput.join(', ')}`);
  }

  const rl = createLineReader(filePath);

  let invalidCount = 0;

  for await (const line of rl) {
    try {
      const parsedLine = JSON.parse(line);

      if (tableName === 'logs') {
        if (!isLogEntry(parsedLine)) {
          console.warn(`⚠️ Invalid raw log entry. Skipping line: ${parsedLine}`);
          invalidCount++;
          continue;
        }

        const entry = sanitizeLogs(parsedLine);

        if (entry) {
          await insertIntoLogs(entry);
        } else {
          console.warn(`⚠️ Failed to sanitize log entry. Skipping line: ${line}`);
          invalidCount++;
          continue;
        }
      } else if (tableName === 'problems') {
        const entry = sanitizeProblemEntries(parsedLine);
        if (!entry) {
          invalidCount++;
          continue;
        }
        await insertIntoProblemTable(entry);
      }
    } catch (err) {
      console.error(`❌ Failed to parse/insert: ${err}`);
      invalidCount++;
    }
  }

  console.log(invalidCount);
}
