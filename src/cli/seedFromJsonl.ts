import fs from 'fs';
import path from 'path';
import readline from 'readline';
import pool from '../db/index';
import { ProblemMeta } from '../types';

async function purgeDB() {
  await pool.query('DELETE FROM problems');
}

async function insertToDB(p: ProblemMeta) {
  await pool.query(
    `INSERT INTO problems (url, title, slug, difficulty, tags)
     VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (slug) DO NOTHING`,
    [p.url, p.title, p.slug, p.difficulty, p.tags]
  );
}

const makeSlug = (t: string) =>
  t
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

async function main() {
  const absPath = path.join(__dirname, '../../leetcode-logs.jsonl');
  if (!fs.existsSync(absPath)) throw new Error(`file not found: ${absPath}`);

  const {
    rows: [{ count }],
  } = await pool.query('SELECT COUNT(*) FROM problems');
  if (+count) await purgeDB();

  const rl = readline.createInterface({
    input: fs.createReadStream(absPath, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (!line.trim()) continue; // skip blank lines
    const raw = JSON.parse(line) as ProblemMeta;
    await insertToDB({ ...raw, slug: makeSlug(raw.title) });
  }

  rl.close();

  const {
    rows: [{ count: final }],
  } = await pool.query('SELECT COUNT(*) FROM problems');
  console.log(`✅ inserted ${final} rows`);
  await pool.end(); // release connections
}

main().catch((e) => {
  console.error('❌ script failed:', e);
  process.exit(1);
});
