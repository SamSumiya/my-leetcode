import { CombinedLogAndProblemMeta } from '../../types';

export function isLogEntry(obj: any): obj is CombinedLogAndProblemMeta {
  return (
    obj &&
    typeof obj.url === 'string' &&
    typeof obj.status === 'string' &&
    typeof obj.approach === 'string' &&
    typeof obj.starred === 'boolean'
  );
}
