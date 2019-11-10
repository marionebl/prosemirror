import { createNodeSpecBuilder } from '@marduke182/prosemirror-schema-builder';
import inline from '../groups/inline';

export interface ImageAttributes {
  src: string;
  alt?: string | null;
  title?: string | null;
}

const image = createNodeSpecBuilder<'image', ImageAttributes>('image', {
  group: inline,
  attrs: {
    src: {},
    alt: { default: null },
    title: { default: null },
  },
  inline: true,
  draggable: true,
  parseDOM: [
    {
      tag: 'img[src]',
      getAttrs(dom) {
        if (dom instanceof HTMLImageElement) {
          return {
            src: dom.getAttribute('src'),
            title: dom.getAttribute('title'),
            alt: dom.getAttribute('alt'),
          };
        }
      },
    },
  ],
  toDOM(node) {
    return ['img', node.attrs];
  },
});

export default image;
