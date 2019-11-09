import { ExcludesFromSchema } from './types';

export function isMarkExcluded(name: string, excludes?: ExcludesFromSchema) {
  if (excludes && excludes.marks) {
    return excludes.marks.indexOf(name) !== -1;
  }
  return false;
}

export function isNodeExcluded(name: string, excludes?: ExcludesFromSchema) {
  if (excludes && excludes.nodes) {
    return excludes.nodes.indexOf(name) !== -1;
  }
  return false;
}
