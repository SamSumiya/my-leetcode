export function extractSlugFromUrl(url: string): string {
  const match = url.match(/leetcode\.com\/problems\/([a-z0-9-]+)\/?/i);
  return match ? match[1] : '';
}
