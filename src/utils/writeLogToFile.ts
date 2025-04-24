import { writeFile } from 'fs/promises';

import type { LogEntry } from '../types';

export async function writeLogToJsonlFile(filePath: string, log: LogEntry[]): Promise<void> {
  try {
    await writeFile(filePath, JSON.stringify(log, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing log to file:', err);
  }
}
