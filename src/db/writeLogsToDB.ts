import pool from './index';
import { LogEntry } from '../types';

// TODO: add reusable runQuery.ts;

export async function writeLogToDB(entry: LogEntry) {
  const query = `
         INSERT INTO logs (
            date, title, url, difficulty, status, approach, tags, starred )
            VALUES( $1, $2, $3, $4, $5, $6, $7, $8)
        `;

  const values = [
    entry.date,
    entry.title,
    entry.url,
    entry.difficulty,
    entry.status,
    entry.approach,
    entry.tags,
    entry.starred,
  ];

  try {
    const result = await pool.query(query, values);
    console.log('✅ Log inserted into DB');
    return result;
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Encountered an err: ', err);
    } else {
      throw err;
    }
  }
}
