import pool from '.';

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
