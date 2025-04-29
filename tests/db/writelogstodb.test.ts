import pool from '../../src/db/index';
import { LogEntry } from '../../src/types';

jest.mock('../../src/db/index', () => {
  const mockPool = {
    query: jest.fn().mockReturnValue({
      rows: [{ data: 'fake_value' }],
    }),
  };
  return {
    __esModule: true,
    default: mockPool,
  };
});
