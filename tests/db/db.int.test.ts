import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

describe('Postgres Connection', () => {
  let pool: Pool;

  beforeAll(() => {
    pool = new Pool({
      host: process.env.POSTGRES_HOST || 'localhost',
      port: Number(process.env.PG_PORT) || 5432,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  it('Should connect to db and return current timeStamp', async () => {
    const res = await pool.query('SELECT NOW()');
    expect(res.rows[0]).toHaveProperty('now');
  });
});
