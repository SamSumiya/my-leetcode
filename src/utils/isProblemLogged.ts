import { extractSlugFromUrl } from './extractSlugFromUrl';
import { problemLookUp } from '../db/problemLookup';

export async function main(url: string): Promise<boolean> {
  const slug = extractSlugFromUrl(url);
  return await problemLookUp(slug);
}
