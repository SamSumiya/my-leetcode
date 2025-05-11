import { CombinedLogAndProblemMeta, LogEntryMeta } from '../../types';
import { extractSlugFromUrl } from '../extractSlugFromUrl';
import { withSanitization } from './withSanitization';

export function sanitizeLogs(entry: CombinedLogAndProblemMeta): LogEntryMeta | null {
  const sanitize = () => {
    if (typeof !entry.url === 'string' || !entry.url.trim()) {
      throw new Error(`Cannot get slug from thi invalid URL: ${entry.url}`);
    }

    const slug = extractSlugFromUrl(entry.url);
    if (typeof slug !== 'string' || !slug.trim()) {
      throw new Error(`Invalid Slug: ${slug}`);
    }

    if (typeof entry.approach !== 'string') {
      throw new Error(`Invalid Approach: ${entry.approach}`);
    }

    if (!['✅ Pass', '💥 Fail', '⚠️ Attempted'].includes(entry.status)) {
      throw new Error(`Invalid Status: ${entry.status}`);
    }
    if (typeof entry.starred !== 'boolean') {
      throw new Error(`Invalid Starred: ${entry.starred}`);
    }

    return {
      slug,
      status: entry.status,
      approach: entry.approach,
      starred: entry.starred,
    };
  };
  return withSanitization(sanitize, 'Log Sanitizer');
}
