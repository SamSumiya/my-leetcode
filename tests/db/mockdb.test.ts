import { Pool } from 'pg';

jest.mock('pg', () => {
  const mockPool = {
    query: jest.fn().mockReturnValue({
      rows: [{ now: 'fake-date' }],
    }),
    connect: jest.fn(),
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
