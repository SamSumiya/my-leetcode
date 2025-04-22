export function extractTitleFromUrl(url: string): string {
  const match = url.match(/leetcode\.com\/problems\/([a-z0-9-]+)\/?/i);
  if (match && match[1]) {
    const kebab = match[1];
    return kebab
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  return 'Unknown Title';
}
