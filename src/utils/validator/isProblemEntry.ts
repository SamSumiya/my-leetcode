import { CombinedLogAndProblemMeta } from '../../types';

export function isProblemEntry(obj: any): obj is CombinedLogAndProblemMeta {
  return (
    obj &&
    typeof obj.slug === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.url === 'string'
  );
}
