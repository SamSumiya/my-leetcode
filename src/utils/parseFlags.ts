export type CLIFlags = {
  limit?: number;
  delay: number;
  dryRun: boolean;
  file: string;
  noDelete: boolean;
  dedupe: boolean;
  invalidInput: string[];
  deleteTable?: string;
};

const validFlags: Set<string> = new Set([
  '--dry-run',
  '--delay',
  '--file',
  '--no-delete',
  '--dedupe',
  '--delete-table',
  '--limit',
] as const);

export function parseFlags(args: string[]): CLIFlags {
  const getValue = (key: string) => {
    const i = args.indexOf(key);
    return i !== -1 && args[i + 1] ? args[i + 1] : null;
  };

  const dryRun = args.includes('--dry-run');
  const rawLimit = getValue('--limit');
  const limit = rawLimit && /^\d+$/.test(rawLimit) ? parseInt(rawLimit, 10) : undefined;
  const rawDelay = getValue('--delay');
  const delay = rawDelay && /^\d+$/.test(rawDelay) ? parseInt(rawDelay, 10) : 0;
  const rawFile = getValue('--file') || '../../leetcode-logs.jsonl';
  const file = rawFile && !rawFile.startsWith('--') ? rawFile : '../../leetcode-logs.jsonl';
  const noDelete = args.includes('--no-delete');
  const dedupe = args.includes('--dedupe');
  const rawTable = getValue('--delete-table');
  const deleteTable = rawTable && rawTable.startsWith('--delete-table') ? rawTable : undefined;
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
    deleteTable,
  };
}
