import pool from '.';
import { ProblemMeta } from '../types';
import { QueryResult } from 'pg';

export const insertIntoProblemTable = async (entry: ProblemMeta): Promise<QueryResult<any>> => {
  return await pool.query(
    `
        INSERT INTO problems (slug, title, difficulty, tags, url)
        VALUES($1, $2,$3,$4,$5)
        ON CONFLICT (slug) DO NOTHING
        `,
    [entry.slug, entry.title, entry.difficulty, entry.tags, entry.url]
  );
};
