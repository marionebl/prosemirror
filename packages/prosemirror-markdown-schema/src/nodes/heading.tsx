import {
  maybeA,
  node,
  createNodeSpecBuilder,
} from '@marduke182/prosemirror-schema-builder';
import inline from '../groups/inline';
import block from '../groups/block';

export interface HeadingAttributes {
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

const heading = createNodeSpecBuilder<'heading', HeadingAttributes>('heading', {
  group: block,
  attrs: {
    level: {
      default: 1,
    },
  },
  content: maybeA(node(inline)),
  parseDOM: [
    { tag: 'h1', attrs: { level: 1 } },
    { tag: 'h2', attrs: { level: 2 } },
    { tag: 'h3', attrs: { level: 3 } },
    { tag: 'h4', attrs: { level: 4 } },
    { tag: 'h5', attrs: { level: 5 } },
    { tag: 'h6', attrs: { level: 6 } },
  ],
  toDOM(n) {
    return [`h${n.attrs.level}`, 0];
  }
});

export default heading;
