import { createNodeSpecBuilder, maybeA, node } from '@marduke182/prosemirror-schema-builder';

import block from '../groups/block';
import inline from '../groups/inline';

const paragraph = createNodeSpecBuilder('paragraph', {
  group: block,
  content: maybeA(node(inline)),
  parseDOM: [{ tag: 'p' }],
  toDOM() {
    return ['p', 0];
  },
});

export default paragraph;
