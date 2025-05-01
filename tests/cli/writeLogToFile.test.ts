import { appendLogToJsonlFile } from '../../src/utils/appendLogToJsonlFile';
import { appendFile } from 'fs/promises';

import type { LogEntry } from '../../src/types';

jest.mock('fs/promises', () => ({
  appendFile: jest.fn(),
}));

describe('appendLogToJsonlFile', () => {
  it('should call appendFile with correct path and log data', async () => {
    const fakePath = '';
    const fakeData: LogEntry = {
      title: 'Fake Title',
      url: 'https://leetcode.com/problems/fake',
      difficulty: 'Easy',
      status: '✅ Pass',
      approach: 'Brute force',
      tags: ['array'],
      starred: false,
    };
    await appendLogToJsonlFile(fakePath, fakeData);

    expect(appendFile).toHaveBeenCalledWith(fakePath, JSON.stringify(fakeData) + '\n', 'utf-8');
  });
});
