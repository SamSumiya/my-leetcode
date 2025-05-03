import { appendLogToJsonlFile } from '../../src/utils/appendLogToJsonlFile';
import { appendFile } from 'fs/promises';

import type { LogEntryMeta } from '../../src/types';

jest.mock('fs/promises', () => ({
  appendFile: jest.fn(),
}));

describe('appendLogToJsonlFile', () => {
  it('should call appendFile with correct path and log data', async () => {
    const fakePath = '';
    const fakeData: LogEntryMeta = {
      slug: 'fake-slug',
      status: '✅ Pass',
      approach: 'Brute force',
      starred: false,
    };
    await appendLogToJsonlFile(fakePath, fakeData);

    expect(appendFile).toHaveBeenCalledWith(fakePath, JSON.stringify(fakeData) + '\n', 'utf-8');
  });
});
