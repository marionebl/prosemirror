import { Content } from 'mdast';
import { Node as PMNode } from 'prosemirror-model';

import { Factory, MdastNodes } from './types';

const own = {}.hasOwnProperty;

function unkown() {
  return null;
}

export const one = (h: Factory, node: Content): PMNode | PMNode[] | null => {
  const type = node && node.type;

  // Fail on non-nodes.
  if (!type) {
    throw new Error(`Expected node, got '${node}'`);
  }

  const fn = own.call(h.handlers, type) ? h.handlers[type as MdastNodes] : null;

  return (typeof fn === 'function' ? fn : unkown)(h, node);
};
