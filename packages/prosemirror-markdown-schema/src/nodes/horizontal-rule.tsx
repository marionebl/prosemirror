import { createNodeSpecBuilder } from '@marduke182/prosemirror-schema-builder';

import block from '../groups/block';

export default createNodeSpecBuilder('horizontal_rule', {
  group: block,
  parseDOM: [{ tag: 'hr' }],
  toDOM() {
    return ['div', ['hr']];
  },
});
