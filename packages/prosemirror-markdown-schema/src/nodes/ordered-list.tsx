import { atLeastOne, node, createNodeSpecBuilder } from '@marduke182/prosemirror-schema-builder';

import listItem from './list-item';
import block from '../groups/block';

export interface OrderedListAttributes {
  order?: number | null;
  tight?: boolean | null;
}

export default createNodeSpecBuilder<'ordered_list', OrderedListAttributes>('ordered_list', {
  group: block,
  content: atLeastOne(node(listItem.getName())),
  attrs: {
    order: {
      default: 1,
    },
    tight: {
      default: false,
    },
  },
  parseDOM: [
    {
      tag: 'ol',
      getAttrs(dom) {
        if (dom instanceof HTMLOListElement) {
          const start = dom.getAttribute('start');
          return {
            order: start ? Number.parseInt(start, 10) : 1,
            tight: dom.hasAttribute('data-tight'),
          };
        }
      },
    },
  ],
  toDOM(pmNode) {
    return [
      'ol',
      {
        start: pmNode.attrs.order === 1 ? '' : pmNode.attrs.order,
        'data-tight': pmNode.attrs.tight ? 'true' : '',
      },
      0,
    ];
  },
});
