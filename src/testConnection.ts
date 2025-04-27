import pool from './db';

const result = await pool.query('SELECT * FROM logs');
console.log(result.rows);
