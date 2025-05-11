import { parseFlags } from '../flags/parseFlags';

export function seed() {
  const args = process.argv.slice(2);
  const flags = parseFlags(args);

  if (flags.seed && flags.file) {
  }
}
