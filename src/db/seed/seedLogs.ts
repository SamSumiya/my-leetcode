import pool from '..';
import { LogEntryMeta } from '../../types';

export async function seedLogs(entry: LogEntryMeta): Promise<number> {
  const rows = await pool.query(
    `
        INSERT INTO logs (slug, status, approach, starred)
        VALUES($1, $2, $3, $4)
        `,
    [entry.slug, entry.status, entry.approach, entry.starred]
  );
  return rows.rowCount ?? 0;
}
