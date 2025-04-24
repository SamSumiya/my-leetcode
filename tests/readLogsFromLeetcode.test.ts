import { readLogsFromLeetcode } from '../src/utils/readLogsFromLeetcode';
import { createReadStream } from 'node:fs';
import readline from 'readline';
import path = require('node:path');

jest.mock('node:fs', () => ({
  createReadStream: jest.fn(),
}));

jest.mock('readline', () => ({
  createInterface: jest.fn(),
}));

jest.mock('../src/utils/fileExist', () => ({
  fileExists: jest.fn(() => true),
}));

