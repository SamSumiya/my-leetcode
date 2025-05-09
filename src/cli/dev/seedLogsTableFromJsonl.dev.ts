import readline from 'readline';
import fs from 'fs';

import { LogEntryMeta } from '../../types';

import { resolveFilePath } from '../../utils/resolveFilePath';
import { parseFlags } from '../../utils/parseFlags';

async function main() {
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
      const logData = {
        ...parsedLine,
      };
    } catch (err) {
      console.error(`❌ Faild to read line - ${err}`);
    }
  }
}

main()
  .then(process.exit(0))
  .catch((err) => {
    console.log(`Error: ${err}`);
    process.exit(1);
  });
