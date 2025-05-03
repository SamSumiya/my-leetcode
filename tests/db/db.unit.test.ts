import { Pool, PoolClient } from 'pg';

jest.mock('pg', () => {
  const mockClient = {
    query: jest.fn().mockResolvedValue({
      rows: [{ id: 1 }],
    }),
    release: jest.fn().mockImplementationOnce(() => 'Released!'),
  };

  const mockPool = {
    connect: jest.fn().mockResolvedValue(mockClient),
    end: jest.fn(),
  };

  return {
    Pool: jest.fn(() => mockPool),
  };
});

describe('Postgres Connection', () => {
  let pool: Pool;
  let client: PoolClient;

  beforeAll(async () => {
    pool = new Pool();
    client = await pool.connect();
  });

  afterAll(async () => {
    await pool.end();
    jest.clearAllMocks();
  });

  it('Should throw a connection error once', async () => {
    (pool.connect as jest.Mock).mockRejectedValueOnce(new Error('Connection error'));
    await expect(pool.connect()).rejects.toThrow('Connection error');
    expect(pool.connect).toHaveBeenCalled();
  });

  it('Should connect to db', async () => {
    const message = client.release();
    expect(message).toBe('Released!');
    expect(client.release).toHaveBeenCalled();
  });

  it('Mock client should return 1 from client.query', async () => {
    const queriedValue = await client.query(`SELECT X FROM Y`);
    expect(queriedValue.rows[0].id).toBe(1);
    expect(client.query).toHaveBeenCalled();
  });

  it('Should end the pool after all', async () => {
    await pool.end();
    expect(pool.end).toHaveBeenCalled();
  });
});
