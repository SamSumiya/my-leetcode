import { ProblemMeta, CombinedLogAndProblemMeta } from '../../types';
import { extractSlugFromUrl } from '../extractSlugFromUrl';
import { withSanitization } from './withSanitization';

export function sanitizeProblemEntries(entry: CombinedLogAndProblemMeta): ProblemMeta | null {
  const validate = () => {
    if (typeof entry.title !== 'string' || !entry.title.trim()) {
      throw new Error(`Invalid title: ${entry.title}`);
    }
    if (!['Easy', 'Medium', 'Hard'].includes(entry.difficulty)) {
      throw new Error(`Invalid difficulty: ${entry.difficulty}`);
    }
    if (!Array.isArray(entry.tags)) {
      throw new Error(`Invalid tags: ${JSON.stringify(entry.tags)}`);
    }
    if (typeof entry.url !== 'string' || !entry.url.trim()) {
      throw new Error(`Invalid url: ${entry.url}`);
    }
    const slug = extractSlugFromUrl(entry.url);
    if (typeof slug !== 'string' || !slug.trim()) {
      throw new Error(`Invalid slug: ${slug}`);
    }

    return {
      slug,
      title: entry.title.trim(),
      difficulty: entry.difficulty,
      tags: entry.tags,
      url: entry.url.trim(),
    };
  };
  return withSanitization(validate, 'Problem Sanitizer');
}
