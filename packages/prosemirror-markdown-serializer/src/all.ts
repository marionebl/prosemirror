import { one } from './one';
import { Node as PMNode } from 'prosemirror-model';
import { Factory } from './types';
import { Content, Parent } from 'mdast';

export function all(h: Factory, parent: Parent) {
  const nodes: Content[] = parent.children || [];
  const length: number = nodes.length;
  let values: PMNode[] = [];
  let index = -1;
  let result: PMNode | PMNode[] | null;

  // tslint:disable-next-line:no-increment-decrement
  while (++index < length) {
    result = one(h, nodes[index]);

    if (result) {
      values = values.concat(result);
    }
  }

  return values;
}
