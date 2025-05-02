import { extractSlugFromUrl } from '../utils/extractSlugFromUrl';
import pool from '../db/index';

export async function main(url: string) {
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
}
