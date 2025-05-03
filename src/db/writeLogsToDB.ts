import pool from './index';
import { LogEntryMeta } from '../types';
// TODO: add reusable runQuery.ts;

export async function writeLogToDB(entry: LogEntryMeta) {
  const query = `
         INSERT INTO logs (
            slug, status, approach, starred )
            VALUES( $1, $2, $3, $4)
        `;

  const values = [entry.slug, entry.status, entry.approach, entry.starred];

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
