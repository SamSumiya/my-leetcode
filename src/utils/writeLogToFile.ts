import { writeFile } from 'fs/promises';
import { appendFile } from 'fs/promises';
import type { LogEntry } from '../types';

export async function writeLogToJsonlFile(filePath: string, log: LogEntry): Promise<void> {
  try {
    await appendFile(filePath, JSON.stringify(log) + '\n', 'utf-8');
  } catch (err) {
    console.error('Error writing log to file:', err);
  }
}
