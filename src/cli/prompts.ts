import path from 'path';

import { extractTitleFromUrl } from '../utils/extractTitleFromUrl';
import { buildLogEntry } from '../utils/buildLogEntry';
import { appendLogToJsonlFile } from '../utils/appendLogToJsonlFile';
import { writeLogToDB } from '../db/writeLogsToDB';
import { isProblemLogged } from '../utils/isProblemLogged';
// TODO: add a default of user's choice and flexibity of changing it as they wish

const LOG_PATH = path.resolve(__dirname, '../../leetcode-logs.jsonl');

async function main() {
  // TODO needs revamp
  // const response = await XXX([
  //   {
  //     type: 'text',
  //     name: 'url',
  //     message: 'Leetcode URL:',
  //   },
  //   {
  //     type: 'select',
  //     name: 'difficulty',
  //     message: 'difficulty',
  //     choices: [
  //       { title: 'Easy', value: 'Easy' },
  //       { title: 'Medium', value: 'Medium' },
  //       { title: 'Hard', value: 'Hard' },
  //     ],
  //   },
  //   {
  //     type: 'select',
  //     name: 'status',
  //     message: 'How did you do?',
  //     choices: [
  //       { title: '✅ Pass', value: '✅ Pass' },
  //       { title: '💥 Fail', value: '💥 Fail' },
  //     ],
  //   },
  //   {
  //     type: 'text',
  //     name: 'approach',
  //     message: 'Approach',
  //   },
  //   {
  //     type: 'list',
  //     name: 'tags',
  //     message: 'Tags ( comma-seperated) ',
  //     separator: ',',
  //   },
  //   {
  //     type: 'toggle',
  //     name: 'starred',
  //     message: 'Starred?',
  //     initial: false,
  //     active: 'yes',
  //     inactive: 'no',
  //   },
  // ]);
  // const titleFromUrl = extractTitleFromUrl(response.url) || 'Unknown Title';
  // const entry = buildLogEntry(response);
  // let logs: LogEntry;
  // if (await fileExists(LOG_PATH)) {
  //   logs = await readLogsFromLeetcode(LOG_PATH);
  // }
  // logs.push(entry);
  // await appendLogToJsonlFile(LOG_PATH, entry);
  // await writeLogToDB(entry);
  // console.log(`✅ Log for "${titleFromUrl}" saved successfully!`);
}

main();
