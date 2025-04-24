import { constants } from 'fs';
import { access } from 'fs/promises';

export async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
