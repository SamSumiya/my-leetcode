// 1. Built-in Node.js modules
import fs from 'fs';
import readline from 'readline';
import path from 'path';

// 2. Third-party modules
import pool from '../db';

// 3. Internal modules (aliases or relative paths)
import { ProblemMeta } from '../types';
import { extractSlugFromUrl } from '../utils/extractSlugFromUrl';
import { parseFlags } from '../utils/parseFlags';

async function insertIntoDB(entry: ProblemMeta) {
  return await pool.query(
    `
  INSERT INTO problems (slug, title, difficulty, tags, url)
  VALUES($1,$2,$3,$4,$5)
  ON CONFLICT (slug) DO NOTHING
  `,
    [entry.slug, entry.title, entry.difficulty, entry.tags, entry.url]
  );
}

async function deleteDataFromProblemTable() {
  await pool.query(`DELETE FROM problems`);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  let newRows = 0;
  let skipped = 0;
  let inserted = new Set();
  const args = process.argv.slice(2);
  const flags = parseFlags(args);
  const batchSize = flags.limit ?? Infinity;
  const absPath = path.resolve(flags.file);

  if (flags.noDelete) {
    console.log('🍀 Previous DB data was not delete');
  } else {
    await deleteDataFromProblemTable();
  }

  const rl = readline.createInterface({
    input: fs.createReadStream(absPath, { encoding: 'utf-8' }),
    crlfDelay: Infinity,
  });

  let processed = 0;
  for await (const line of rl) {
    if (!line.trim()) {
      skipped++;
      continue;
    }

    try {
      const parsedLine = JSON.parse(line);
      const slug = extractSlugFromUrl(parsedLine.url);
      const validEntry = {
        ...parsedLine,
        slug: slug,
      };

      if (inserted.has(validEntry.slug)) {
        skipped++;
        continue;
      }

      if (flags.dryRun) {
        console.log(`[Dry Run] Would insert: ${slug}`);
      } else {
        const response = await insertIntoDB(validEntry);
        newRows += response.rowCount ?? 0;
      }

      inserted.add(validEntry.slug);
      processed++;

      if (processed % batchSize === 0 && flags.delay > 0) {
        console.log(`⏸️ Pausing for ${flags.delay}ms after ${processed} rows...`);
        await sleep(flags.delay);
      }
    } catch (err) {
      console.error('❌ JSON parse error on the following line:\n');
      console.error(line);
      console.error('\n📍 Error message:', (err as Error).message);
    }
  }

  rl.close();
  console.log(`📄 Using file: ${absPath}`);
  if (skipped > 0) {
    console.log(`⚠️ Skipped ${skipped} duplicates or invalid or blank line(s)`);
  }
  console.log(`🪵 Logged ${newRows} new row${newRows < 1 ? '' : 's'}`);
  await pool.end();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
