export type CLIFlags = {
  limit?: number;
  delay: number;
  dryRun: boolean;
  file: string;
  noDelete: boolean;
  dedupe: boolean;
  invalidInput: string[];
  seed?: boolean;
  delete?: boolean;
};
