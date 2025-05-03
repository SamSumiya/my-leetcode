import { extractSlugFromUrl } from './extractSlugFromUrl';
import type { LogEntryMeta } from '../types';

export function buildLogEntry(response: LogEntryMeta): LogEntryMeta {
  return {
    ...response,
    slug: extractSlugFromUrl(response.slug) || 'unknown-slug',
  };
}
