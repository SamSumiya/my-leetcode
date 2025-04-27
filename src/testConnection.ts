import pool from './db';

async function main() {
  try {
    const result = await pool.query('SELECT * FROM logs');
    console.log(result.rows);
  } catch (err: any) {
    if (err.code === '42P01') {
      console.error('Table does not exist! Please create it first.');
    } else {
      throw err;
    }
  }
}

main();
