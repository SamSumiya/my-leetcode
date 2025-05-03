import { extractSlugFromUrl } from '../utils/extractSlugFromUrl';
import pool from '../db/index';

export async function main(url: string): Promise<void> {
  const currentSlug = extractSlugFromUrl(url);

  const result = await pool.query(
    `
    SELECT 
        slug 
    FROM
        problems 
    WHERE 
        slug = $1
    `,
    [currentSlug]
  );

  const hasSlug = (result.rowCount ?? 0) > 0;
}
