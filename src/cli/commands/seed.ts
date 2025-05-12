import { parseFlags } from '../flags/parseFlags';

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
        const entry = sanitizeLogs(parsedLine);
        if (!entry) {
          invalidCount++;
          continue;
        }
        await insertIntoLogs(entry);
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

  //   console.log(invalidCount);
}
