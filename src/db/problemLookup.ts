import pool from './index';

export async function problemLookUp(slug: string): Promise<boolean> {
  const result = await pool.query(
    `
    SELECT 
        slug 
    FROM
        problems 
    WHERE 
        slug = $1
    `,
    [slug]
  );

  const hasSlug = (result.rowCount ?? 0) > 0;
  return hasSlug;
}
