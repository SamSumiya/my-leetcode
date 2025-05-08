import path from 'path';
import fs from 'fs';

export function resolveFilePath(filePath: string): string {
  const fromCwd = path.resolve(process.cwd(), filePath);

  if (fs.existsSync(fromCwd)) {
    return fromCwd;
  }
  const fromScript = path.resolve(__dirname, filePath);
  if (fs.existsSync(fromScript)) return fromScript;

  throw new Error(`File not found ${filePath}`);
}
