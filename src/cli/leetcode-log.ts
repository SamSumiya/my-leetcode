import fs from 'fs';
import path from 'path';
import prompts from 'prompts';
import { format } from 'date-fns';
import { extractTitleFromUrl } from '../utils/extractTitleFromUrl';

// Define the shap of a log entry
interface LogEntry {
  dateOption: 'Today' | 'Yesterday';
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
      name: 'title',
      message: 'Problem Title:',
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
      type: 'text',
      name: 'url',
      message: 'Leetcode URL:',
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
      inital: false,
      active: 'yes',
      inactive: 'no',
    },
  ]);

  //   const titleFromUrl = extractTitleFromUrl(response.url);
  const entry: LogEntry = {
    ...response,
    title: extractTitleFromUrl(response.url) || 'Unknow Title',
    dateOption: 
  };
}

main();
