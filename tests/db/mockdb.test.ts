import { Pool } from 'pg';

jest.mock('pg', () => {
  const mockClient = {
    query: jest.fn().mockResolvedValue({
      rows: [{ now: 'fake-date' }],
    }),
    release: jest.fn(),
  };
  const mockPool = {
    query: jest.fn().mockResolvedValue({
      rows: [{ now: 'fake-date' }],
    }),
    connect: jest.fn().mockResolvedValue(mockClient),
    end: jest.fn(),
  };

  return { Pool: jest.fn(() => mockPool) };
});

describe('Mocked Postgres Connection', () => {
  let pool: Pool;

  beforeAll(() => {
    pool = new Pool();
  });

  it('Should return mocked current timestamp', async () => {
    const result = await pool.query('SELECT NOW()');
    expect(result.rows[0].now).toBe('fake-date');
  });
});
