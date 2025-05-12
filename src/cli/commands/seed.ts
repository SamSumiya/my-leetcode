import { parseFlags } from '../flags/parseFlags';

import { createLineReader } from '../../utils/io/createLineReader';

export function seed() {
  const args = process.argv.slice(2);
  const flags = parseFlags(args);
  const filePath = flags.file;

  const rl = createLineReader(filePath);
}
