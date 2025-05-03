import { readLogsFromLeetcode } from '../../src/utils/readLogsFromLeetcode';
import { createReadStream } from 'node:fs';
import readline from 'readline';

jest.mock('node:fs', () => ({
  createReadStream: jest.fn(),
}));

jest.mock('readline', () => ({
  createInterface: jest.fn(),
}));

jest.mock('../../src/utils/fileExists', () => ({
  fileExists: jest.fn(() => true),
}));

function mockAsyncIterator(lines: string[]) {
  return {
    [Symbol.asyncIterator]: () => {
      let index = 0;
      return {
        next: () => {
          return Promise.resolve(
            index < lines.length
              ? { value: lines[index++], done: false }
              : { value: undefined, done: true }
          );
        },
      };
    },
  };
}

describe('readLogsFromLeetcode', () => {
  it('Should read valid logs line and returns parsed array', async () => {
    const validLogLines = JSON.stringify({
      slug: 'test-problem',
      // difficulty: 'Easy',
      status: '✅ Pass',
      approach: 'two-pointer',
      // tags: ['array'],
      starred: true,
      // url: 'https://leetcode.com/problems/test-problem/',
    });

    (createReadStream as jest.Mock).mockReturnValue({});
    (readline.createInterface as jest.Mock).mockReturnValue(mockAsyncIterator([validLogLines]));

    const logs = await readLogsFromLeetcode('fake/path');

    expect(logs).toEqual([
      {
        slug: 'test-problem',
        // difficulty: 'Easy',
        status: '✅ Pass',
        approach: 'two-pointer',
        // tags: ['array'],
        starred: true,
        // url: 'https://leetcode.com/problems/test-problem/',
      },
    ]);
  });

  it('Should throw error if the leetcode file does not exist', async () => {
    const { fileExists } = require('../../src/utils/fileExists');
    fileExists.mockReturnValue(false);

    await expect(readLogsFromLeetcode('fake/path')).rejects.toThrow('❌ File not found: fake/path');
  });

  it('Should throw if createReadStream fails unexpectedly', async () => {
    const { fileExists } = require('../../src/utils/fileExists');
    fileExists.mockReturnValue(true);

    (createReadStream as jest.Mock).mockImplementation(() => {
      throw new Error('Stream creation failed');
    });

    await expect(readLogsFromLeetcode('fake/path')).rejects.toThrow('Stream creation failed');
  });

  it('Should return an empty array if the file has no lines', async () => {
    (createReadStream as jest.Mock).mockReturnValue({});
    (readline.createInterface as jest.Mock).mockReturnValue(mockAsyncIterator([]));

    const logs = await readLogsFromLeetcode('fake/path');
    expect(logs).toEqual([]);
  });

  it('Should skip malformed lines', async () => {
    const badLine = '{this is a bad line}';
    const validLogLines = JSON.stringify({
      slug: 'test-problem',
      // difficulty: 'Easy',
      status: '✅ Pass',
      approach: 'two-pointer',
      // tags: ['array'],
      starred: true,
      // url: 'https://leetcode.com/problems/test-problem/',
    });
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const input = [badLine, validLogLines];

    (createReadStream as jest.Mock).mockReturnValue({});
    (readline.createInterface as jest.Mock).mockReturnValue(mockAsyncIterator(input));

    const logs = await readLogsFromLeetcode('fake/path');

    expect(logs).toEqual([
      {
        slug: 'test-problem',
        // difficulty: 'Easy',
        status: '✅ Pass',
        approach: 'two-pointer',
        // tags: ['array'],
        starred: true,
        // url: 'https://leetcode.com/problems/test-problem/',
      },
    ]);

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('⚠️ Skipping malformed line:'));
    warnSpy.mockRestore();
  });

  it('Should parse multiple valid log lines', async () => {
    const entries = [
      {
        slug: 'p-1',
        // difficulty: 'Easy',
        status: '✅ Pass',
        approach: '',
        // tags: [],
        starred: false,
        // url: '',
      },
      {
        slug: 'p-2',
        // difficulty: 'Hard',
        status: '💥 Fail',
        approach: '',
        // tags: [],
        starred: false,
        // url: '',
      },
    ];

    const parsed = entries.map((entry) => JSON.stringify(entry));

    (createReadStream as jest.Mock).mockReturnValue({});
    (readline.createInterface as jest.Mock).mockReturnValue(mockAsyncIterator(parsed));

    const logs = await readLogsFromLeetcode('path/fake');
    expect(logs).toEqual([
      {
        slug: 'p-1',
        // difficulty: 'Easy',
        status: '✅ Pass',
        approach: '',
        // tags: [],
        starred: false,
        // url: '',
      },
      {
        slug: 'p-2',
        // difficulty: 'Hard',
        status: '💥 Fail',
        approach: '',
        // tags: [],
        starred: false,
        // url: '',
      },
    ]);
  });
});
