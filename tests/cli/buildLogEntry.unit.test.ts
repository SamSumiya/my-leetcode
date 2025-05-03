import { buildLogEntry } from '../../src/utils/buildLogEntry';
import type { LogEntryMeta } from '../../src/types';

describe('buildLogEntry', () => {
  // const input: LogEntryMeta = {
  //   slug: 'two-sum',
  //   status: '✅ Pass',
  //   approach: 'Hash map',
  //   starred: false,
  // };

  const inputWithoutURL: LogEntryMeta = {
    slug: 'two-sum',
    status: '✅ Pass',
    approach: 'Hash map',
    starred: false,
  };

  // it('Should return correct response object from input data', () => {
  //   expect(buildLogEntry(input)).toEqual({
  //     // TODO need to fix this later as not having enough code right now
  //     slug: 'unknown-slug',
  //     // url: 'https://leetcode.com/problems/two-sum',
  //     // difficulty: 'Easy',
  //     status: '✅ Pass',
  //     approach: 'Hash map',
  //     // tags: ['array', 'hashmap'],
  //     starred: false,
  //   });
  // });

  it('Should be Unknown Title if user did not provide an url', () => {
    expect(buildLogEntry(inputWithoutURL)).toEqual({
      slug: 'unknown-slug',
      status: '✅ Pass',
      approach: 'Hash map',
      starred: false,
    });
  });
});
