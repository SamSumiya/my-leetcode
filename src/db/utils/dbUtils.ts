import pool from '..';

export const whiteListedTablenName = ['logs', 'problems'] as const;

export async function DeleteAllFromTable(table: string): Promise<number> {
  if (!whiteListedTablenName.includes(table as any)) {
    throw new Error(`Not valid table name: ${table} `);
  }

  console.log(`Delete all rows from ${table} table`);
  const result = await pool.query(`DELETE FROM ${table}`);
  return result.rowCount ?? 0;
}
