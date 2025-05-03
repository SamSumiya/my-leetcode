// import { writeFile } from 'fs/promises';
import { appendFile } from 'fs/promises';
import type { LogEntryMeta } from '../types';

export async function appendLogToJsonlFile(filePath: string, log: LogEntryMeta): Promise<void> {
  try {
    await appendFile(filePath, JSON.stringify(log) + '\n', 'utf-8');
  } catch (err) {
    console.error('Error writing log to file:', err);
  }
}
