import { writeLogToJsonlFile } from '../src/utils/writeLogToFile';
import { writeFile } from 'fs/promises';

import type { LogEntry } from '../src/types';

jest.mock('fs/promises', () => ({
  writeFile: jest.fn(),
}));

describe('writeLogToFile', () => {
  it('Should call writeFile with inputs path and log object', async () => {
    const fakePath = '';
    const fakeData: LogEntry[] = [];
    await writeLogToJsonlFile(fakePath, fakeData);

    expect(writeFile).toHaveBeenCalledWith(fakePath, JSON.stringify(fakeData, null, 2), 'utf-8');
  });
});
