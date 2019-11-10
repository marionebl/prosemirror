import { maybeA, node, createNodeSpecBuilder } from '@marduke182/prosemirror-schema-builder';
import inline from '../groups/inline';
import block from '../groups/block';

const paragraph = createNodeSpecBuilder('paragraph', {
  group: block,
  content: maybeA(node(inline)),
  parseDOM: [{ tag: 'p' }],
  toDOM() {
    return ['p', 0];
  },
});

export default paragraph;
