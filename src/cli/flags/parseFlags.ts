import { CLIFlags } from './flagType';

const validFlags: Set<string> = new Set([
  '--dry-run',
  '--no-delete',
  '--delete',
  '--seed',
  '--delay',
  '--file',
  '--dedupe',
  '--limit',
] as const);

export function parseFlags(args: string[]): CLIFlags {
  const getValue = (key: string) => {
    const i = args.indexOf(key);
    return i !== -1 && args[i + 1] ? args[i + 1] : null;
  };

  // Need to get value from the second input after CLI command
  const rawLimit = getValue('--limit');
  const limit = rawLimit && /^\d+$/.test(rawLimit) ? parseInt(rawLimit, 10) : undefined;

  const rawDelay = getValue('--delay');
  const delay = rawDelay && /^\d+$/.test(rawDelay) ? parseInt(rawDelay, 10) : 0;

  const rawFile = getValue('--file') || '../../leetcode-logs.jsonl';
  const file = rawFile && !rawFile.startsWith('--') ? rawFile : '../../leetcode-logs.jsonl';

  // Only Checking if args has CLI command or not
  const dryRun = args.includes('--dry-run');
  const noDelete = args.includes('--no-delete');
  const dedupe = args.includes('--dedupe');
  const shouldDelete = args.includes('--delete');
  const shouldSeed = args.includes('--seed');

  // Need modification
  const invalidInput = args
    .filter((arg) => arg.startsWith('--'))
    .filter((arg) => !validFlags.has(arg as string));

  return {
    delay,
    limit,
    dryRun,
    file,
    noDelete,
    dedupe,
    invalidInput,
    seed: shouldSeed,
    delete: shouldDelete,
  };
}
