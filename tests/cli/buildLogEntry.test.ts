import { buildLogEntry } from '../../src/utils/buildLogEntry';
import type { LogEntryInput } from '../../src/types';

describe('buildLogEntry', () => {
  const input: LogEntryInput = {
    url: 'https://leetcode.com/problems/two-sum',
    difficulty: 'Easy',
    status: '✅ Pass',
    approach: 'Hash map',
    tags: ['array', 'hashmap'],
    starred: false,
    dateOption: 'today',
  };

  const inputWithoutURL: LogEntryInput = {
    url: '',
    difficulty: 'Easy',
    status: '✅ Pass',
    approach: 'Hash map',
    tags: ['array', 'hashmap'],
    starred: false,
    dateOption: 'today',
  };

  it('Should return correct response object from input data', () => {
    expect(buildLogEntry(input)).toEqual({
      title: 'Two Sum',
      url: 'https://leetcode.com/problems/two-sum',
      difficulty: 'Easy',
      status: '✅ Pass',
      approach: 'Hash map',
      tags: ['array', 'hashmap'],
      starred: false,
      dateOption: 'today',
    });
  });

  it('Should be Unknown Title if user did not provide an url', () => {
    expect(buildLogEntry(inputWithoutURL)).toEqual({
      title: 'Unknown Title',
      url: '',
      difficulty: 'Easy',
      status: '✅ Pass',
      approach: 'Hash map',
      tags: ['array', 'hashmap'],
      starred: false,
      dateOption: 'today',
    });
  });
});
