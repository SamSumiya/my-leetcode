import fs from 'fs';
import path from 'path';
import prompts from 'prompts';
import { extractTitleFromUrl } from '../utils/extractTitleFromUrl';

// Define the shap of a log entry
interface LogEntry {
  dateOption: 'today' | 'yesterday';
  title: string;
  url: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: '✅ Pass' | '💥 Fail';
  approach: string;
  tags: string[];
  starred: boolean;
}

const LOG_PATH = path.resolve(__dirname, '../../leetcode-log.json');

async function main() {
  const response = await prompts([
    {
      type: 'text',
      name: 'url',
      message: 'Leetcode URL:',
    },
    {
      type: 'select',
      name: 'dateOption',
      message: 'Enter a date:',
      choices: [
        { title: '🗓️ Today', value: 'today' },
        { title: '🕰️ Yesterday', value: 'Yesterday' },
      ],
    },
    {
      type: 'select',
      name: 'difficulty',
      message: 'difficulty',
      choices: [
        { title: 'Easy', value: 'Easy' },
        { title: 'Medium', value: 'Medium' },
        { title: 'Hard', value: 'Hard' },
      ],
    },
    {
      type: 'select',
      name: 'status',
      message: 'How did you do?',
      choices: [
        { title: '✅ Pass', value: '✅ Pass' },
        { title: '💥 Fail', value: '💥 Fail' },
      ],
    },
    {
      type: 'text',
      name: 'approach',
      message: 'Approach',
    },
    {
      type: 'list',
      name: 'tags',
      message: 'Tags ( comma-seperated) ',
      separator: ',',
    },
    {
      type: 'toggle',
      name: 'starred',
      message: 'Starred?',
      initial: false,
      active: 'yes',
      inactive: 'no',
    },
  ]);

  const titleFromUrl = extractTitleFromUrl(response.url) || 'Unknown Title';

  const entry: LogEntry = {
    ...response,
    title: titleFromUrl,
    dateOption: response.dateOption,
  };

  let logs: LogEntry[] = [];

  if (fs.existsSync(LOG_PATH)) {
    const fileContent = fs.readFileSync(LOG_PATH, 'utf-8');
    logs = JSON.parse(fileContent) as LogEntry[];
  }

  logs.push(entry);

  fs.writeFileSync(LOG_PATH, JSON.stringify(logs, null, 2), 'utf-8');

  console.log(`✅ Log for "${titleFromUrl}" saved successfully!`);
}

main();
