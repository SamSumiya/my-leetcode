import { createReadStream } from 'node:fs';
import readline from 'readline';
import path from 'node:path';
import type { LogEntry } from '../types';

import { fileExists } from './fileExists';

export async function readLogsFromLeetcode(leetcodePath: string): Promise<LogEntry[]> {
  if (!fileExists(leetcodePath)) {
    throw new Error(`❌ File not found: ${leetcodePath}`);
  }

  const logs: LogEntry[] = [];

  const readStream = createReadStream(leetcodePath, { encoding: 'utf-8' });

  const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    try {
      const entry: LogEntry = JSON.parse(line);
      logs.push(entry);
    } catch (err) {
      console.warn(`⚠️ Skipping malformed line: ${line}`);
    }
  }

  return logs;
}
