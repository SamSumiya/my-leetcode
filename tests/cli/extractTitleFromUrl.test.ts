import { extractTitleFromUrl } from '../../src/utils/extractTitleFromUrl';

describe('extractTitleFromUrl', () => {
  it('should convert valid LeetCode URLs to formatted titles', () => {
    expect(extractTitleFromUrl('https://leetcode.com/problems/two-sum/')).toBe('Two Sum');
  });

  it('should return "Unknown Title" for malformed or invalid URLs', () => {
    expect(extractTitleFromUrl('')).toBe('Unknown Title');
    expect(extractTitleFromUrl('not-a-leetcode-url')).toBe('Unknown Title');
    expect(extractTitleFromUrl('leetcode.com/problems/')).toBe('Unknown Title');
  });
});
