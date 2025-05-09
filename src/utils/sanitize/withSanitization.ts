export function withSanitization<T>(fn: () => T, label?: string): T | null {
  try {
    return fn();
  } catch (err) {
    const prifix = label ? `[${label}]` : '';
    if (err instanceof Error) {
      console.warn(`${prifix} Skipped invalid entry: ${err.message} `);
    } else {
      console.warn(`${prifix} Skipped invalid entry: ${err} `);
    }
  }
  return null;
}
