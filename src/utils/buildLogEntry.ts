import { extractTitleFromUrl } from './extractTitleFromUrl';
import type { LogEntry, LogEntryInput } from '../types';

export function buildLogEntry(response: LogEntryInput): LogEntry {
  return {
    ...response,
    title: extractTitleFromUrl(response.url) || 'Unknown Title',
  };
}
