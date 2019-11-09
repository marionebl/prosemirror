import { createMarkSpecBuilder } from '@marduke182/prosemirror-schema-builder';

export interface LinkAttributes {
  href: string;
  title?: string | null;
}

const link = createMarkSpecBuilder<'link', LinkAttributes>('link', {
  attrs: {
    href: {},
    title: { default: null },
  },
  inclusive: false,
  parseDOM: [
    {
      tag: 'a[href]',
      getAttrs(dom) {
        if (dom instanceof HTMLAnchorElement) {
          return {
            href: dom.getAttribute('href'),
            title: dom.getAttribute('title'),
          };
        }
      },
    },
  ],
  toDOM(node) {
    return ['a', node.attrs];
  }
});

export default link;
