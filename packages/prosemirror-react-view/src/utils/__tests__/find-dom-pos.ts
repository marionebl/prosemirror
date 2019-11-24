import { docBuilders } from '@marduke182/prosemirror-markdown';
import { Node as ProsemirrorNode } from 'prosemirror-model';

import { PMViewDesc } from '../../components/types';
import { findStartPosition } from '../find-dom-pos';

const { doc, p } = docBuilders;

function createPMViewDesc(root: ProsemirrorNode, pos: number): PMViewDesc {
  const resolvedPos = root.resolve(pos);

  let parentPMViewDesc: PMViewDesc | undefined = undefined;
  const maxDepth = resolvedPos.depth;
  for (let i = 0; i <= maxDepth; i++) {
    const node = resolvedPos.node(i);
    if (node) {
      parentPMViewDesc = {
        node,
        parent: parentPMViewDesc,
      };
    }
  }

  if (!parentPMViewDesc) {
    throw new Error('View Desc cannot be created it');
  }
  return parentPMViewDesc;
}

describe('findStartPos', () => {
  test('should find position', () => {
    const { node } = doc(p('hello'));

    const pmViewDesc = createPMViewDesc(node, 1);
    expect(findStartPosition(pmViewDesc)).toBe(0);
  });
});
