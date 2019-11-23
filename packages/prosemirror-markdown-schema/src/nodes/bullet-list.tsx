import { atLeastOne, node, createNodeSpecBuilder } from '@marduke182/prosemirror-schema-builder';

import listItem from './list-item';
import block from '../groups/block';

export interface BulletListAttributes {
  tight?: boolean | null;
}

const bulletList = createNodeSpecBuilder<'bullet_list', BulletListAttributes>('bullet_list', {
  group: block,
  attrs: {
    tight: {
      default: false,
    },
  },
  content: atLeastOne(node(listItem.getName())),
  parseDOM: [
    {
      tag: 'ul',
      getAttrs: dom => {
        if (dom instanceof HTMLUListElement) {
          return { tight: dom.hasAttribute('data-tight') };
        }
      },
    },
  ],
  toDOM(pmNode) {
    return ['ul', { 'data-tight': pmNode.attrs.tight ? 'true' : '' }, 0];
  },
});

export default bulletList;
