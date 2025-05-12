import readline from 'readline';
import fs from 'fs';

import { resolveFilePath } from '../resolveFilePath';

export function createLineReader(filePath: string) {
  const path = resolveFilePath(filePath);

  const rl = readline.createInterface({
    input: fs.createReadStream(path, { encoding: 'utf-8' }),
    crlfDelay: Infinity,
  });

  return rl;
}
