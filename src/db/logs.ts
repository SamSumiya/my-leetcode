import pool from '.';
import { LogEntryMeta } from '../types';

export const deleteDuplicateToSeconds = () =>
  pool.query(`
    DELETE FROM logs
    WHERE id IN (
      SELECT id
      FROM (
        SELECT id,
               ROW_NUMBER() OVER (
                PARTITION BY slug, status, approach, starred, date_trunc('second', date)
                ORDER BY id
               ) AS row_num
        FROM logs
      ) sub
      WHERE sub.row_num > 1
    );
  `);

export const insertIntoLogs = async (logData: LogEntryMeta): Promise<void> => {
  pool.query(
    `
        INSERT INTO logs ( slug, status, approach, starred )
        VALUES ( $1, $2, $3, $4) 
        `,
    [logData.slug, logData.status, logData.approach, logData.starred]
  );
};
