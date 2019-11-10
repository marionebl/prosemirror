import {
  createNodeSpecBuilder,
  maybeA,
  node,
  sequence,
} from '@marduke182/prosemirror-schema-builder';
import paragraph from './paragraph';
import block from '../groups/block';

const listItem = createNodeSpecBuilder('list_item', {
  defining: true,
  content: sequence(node(paragraph.getName()), maybeA(node(block))),
  parseDOM: [{ tag: 'li' }],
  toDOM() {
    return ['li', 0];
  },
});

export default listItem;
