import { readLogsFromLeetcode } from '../src/utils/readLogsFromLeetcode';
import { createReadStream, read } from 'node:fs';
import readline from 'readline';

jest.mock('node:fs', () => ({
  createReadStream: jest.fn(),
}));

jest.mock('readline', () => ({
  createInterface: jest.fn(),
}));

jest.mock('../src/utils/fileExists', () => ({
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
  it('Should read valid logs line and returns parse array', async () => {
    const validLogLines = JSON.stringify({
      title: 'Test Problem',
      difficulty: 'Easy',
      status: '✅ Pass',
      approach: 'two-pointer',
      tags: ['array'],
      starred: true,
      url: 'https://leetcode.com/problems/test-problem/',
      dateOption: 'today',
    });

    (createReadStream as jest.Mock).mockReturnValue({});
    (readline.createInterface as jest.Mock).mockReturnValue(mockAsyncIterator([validLogLines]));

    const logs = await readLogsFromLeetcode('fake/path');

    expect(logs).toEqual([
      {
        title: 'Test Problem',
        difficulty: 'Easy',
        status: '✅ Pass',
        approach: 'two-pointer',
        tags: ['array'],
        starred: true,
        url: 'https://leetcode.com/problems/test-problem/',
        dateOption: 'today',
      },
    ]);
  });

  it('Should throw error if the leetcode file does not exist', async () => {
    const { fileExists } = require('../src/utils/fileExists');
    fileExists.mockReturnValue(false);

    await expect(readLogsFromLeetcode('fake/path')).rejects.toThrow('❌ File not found: fake/path');
  });

  it('Should throw if createReadStream fails unexpectedly', async () => {
    const { fileExists } = require('../src/utils/fileExists');
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
});
