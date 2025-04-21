import fs from 'fs';
import { format } from 'date-fns';
import prompts from 'prompts';

interface LogEntry {
  title?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: '✅ Pass' | '💥 Fail';
  approach: string;
  tags?: string[];
  starred?: boolean;
  url?: string;
  dateOption: 'today' | 'yesterday';
}

function extractTitleFromUrl(url: string): string {
  try {
    const match = url.match(/leetcode\.com\/problems\/([a-z0-9-]+)\/?/i);
    if (match && match[1]) {
      const kebab = match[1];
      return kebab
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
  } catch (error) {
    console.warn('URL parse failed:', error);
  }
  return '';
}

async function main() {
  const response: LogEntry = await prompts([
    {
      type: 'text',
      name: 'url',
      message: 'Leetcode URL: ',
    },
    {
      type: 'select',
      name: 'dateOption',
      message: 'Log date: ',
      choices: [
        { title: '🗓️ Today', value: 'today' },
        { title: '🕰️ Yesterday', value: 'yesterday' },
      ],
    },
    {
      type: 'select',
      name: 'difficulty',
      message: 'Difficulty',
      choices: [
        { title: 'Easy', value: 'Easy' },
        { title: 'Medium', value: 'Medium' },
        { title: 'Hard', value: 'Hard' },
      ],
    },
    {
      type: 'text',
      name: 'approach',
      message: 'Approach Used: ',
    },
    {
      type: 'select',
      name: 'status',
      message: 'Did you pass it?',
      choices: [
        { title: '✅ Pass', value: '✅ Pass' },
        { title: '💥 Fail', value: '💥 Fail' },
      ],
    },
    {
      type: 'list',
      name: 'tags',
      message: 'Tags: DFS, 2P, DP, Backtrack',
      separator: ',',
    },
    {
      type: 'toggle',
      name: 'starred',
      message: 'Do you want to star this entry?',
      initial: false,
      active: 'Yes',
      inactive: 'No',
    },
  ]);

  if (Object.keys(response).length === 0) {
    console.log('❌ Entry cancelled!');
    return;
  }

  const now = new Date();
  const date = format(
    response.dateOption === 'yesterday' ? new Date(now.setDate(now.getDate() - 1)) : now,
    'MM-dd-yyyy'
  );
  const tagsFormatted =
    response.tags
      ?.map((tag) => tag.trim())
      .filter(Boolean)
      .join(', ') ?? '';
  const starSymbol = response.starred ? '🌟' : '';
  const parsedTitle = extractTitleFromUrl(response.url || '');
  const titleWithLink = response.url
    ? `[${parsedTitle || 'Unknown Title'}](${response.url})`
    : parsedTitle;
  response.title = parsedTitle;
  const logLine = `| ${date} | ${titleWithLink} | ${response.difficulty} | ${response.status} | ${response.approach ?? ''} | ${tagsFormatted} | ${starSymbol} |`;

  if (!fs.existsSync('logs.md')) {
    fs.writeFileSync(
      'logs.md',
      '| Date | Title | Difficulty | Status | Approach | Tags | ⭐ |\n' +
        '|------|-------|------------|--------|----------|------|----|\n'
    );
  }
  fs.appendFileSync('logs.md', logLine + '\n');
  console.log(`✅ Log entry saved to logs.md`);
}

main();
