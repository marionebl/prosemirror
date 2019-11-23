import { createDocBuilders, createElementFactory } from '@marduke182/prosemirror-test-utils';
import {
  BulletListAttributes,
  CodeBlockAttributes,
  HeadingAttributes,
  ImageAttributes,
  LinkAttributes,
  OrderedListAttributes,
  schemaBuilder,
} from '@marduke182/prosemirror-markdown-schema';
import { createSerializer } from '@marduke182/prosemirror-markdown-serializer';
import { NodeWithTags } from '@marduke182/prosemirror-test-utils/src/create-doc-builders';
import { Image, Link, List } from 'mdast';

export const schema = schemaBuilder.build();
export type MarkdownSchema = typeof schema;
export const serialize = createSerializer({
  schema,
  emptyDoc: schema.nodes.doc.create(null, schema.nodes.paragraph.create(null)),
  handlers: {
    root: { node: 'doc' },
    paragraph: { node: 'paragraph' },
    heading: {
      node: 'heading',
      getAttrs: node => ({
        level: node.depth,
      }),
    },
    list: {
      getNode: node => {
        if ((node as List).ordered) {
          return 'ordered_list';
        }
        return 'bullet_list';
      },
    },
    thematicBreak: { node: 'horizontal_rule' },
    listItem: { node: 'list_item' },
    break: { node: 'hard_break' },
    strong: { mark: 'strong' },
    emphasis: { mark: 'em' },
    inlineCode: { mark: 'code' },
    image: {
      node: 'image',
      getAttrs: node => ({
        src: (node as Image).url,
        alt: (node as Image).alt,
        title: (node as Image).title,
      }),
    },
    code: { node: 'code_block' },
    link: {
      mark: 'link',
      getAttrs: node => ({
        href: (node as Link).url,
        title: (node as Link).title,
      }),
    },
  },
});
export const docBuilders = createDocBuilders(schema, {
  aliases: {
    nodes: {
      p: { type: 'paragraph' },
      h1: { type: 'heading', attrs: { level: 1 } },
      h2: { type: 'heading', attrs: { level: 2 } },
      h3: { type: 'heading', attrs: { level: 3 } },
      h4: { type: 'heading', attrs: { level: 4 } },
      h5: { type: 'heading', attrs: { level: 5 } },
      h6: { type: 'heading', attrs: { level: 6 } },
      ol: { type: 'ordered_list' },
      ul: { type: 'bullet_list' },
      li: { type: 'list_item' },
      img: { type: 'image' },
      pre: { type: 'code_block' },
      br: { type: 'hard_break' },
    },
    marks: {
      a: { type: 'link' },
    },
  },
});

export const createElement = createElementFactory(docBuilders);
// eslint-disable-next-line @typescript-eslint/no-namespace,@typescript-eslint/no-unused-vars
export namespace createElement.JSX {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultAttributes {}
  export type Element = NodeWithTags<MarkdownSchema>;
  export interface IntrinsicElements {
    doc: DefaultAttributes;
    p: DefaultAttributes;
    paragraph: DefaultAttributes;
    code: DefaultAttributes;
    link: LinkAttributes;
    a: LinkAttributes;
    image: ImageAttributes;
    img: ImageAttributes;
    heading: HeadingAttributes;
    h1: Omit<HeadingAttributes, 'level'>;
    h2: Omit<HeadingAttributes, 'level'>;
    h3: Omit<HeadingAttributes, 'level'>;
    h4: Omit<HeadingAttributes, 'level'>;
    h5: Omit<HeadingAttributes, 'level'>;
    h6: Omit<HeadingAttributes, 'level'>;
    ordered_list: OrderedListAttributes;
    ol: OrderedListAttributes;
    bullet_list: BulletListAttributes;
    ul: BulletListAttributes;
    list_item: DefaultAttributes;
    li: DefaultAttributes;
    code_block: CodeBlockAttributes;
    pre: CodeBlockAttributes;
    hard_break: DefaultAttributes;
    br: DefaultAttributes;
    strong: DefaultAttributes;
    em: DefaultAttributes;
    horizontal_rule: DefaultAttributes;
    'select-text': {};
    cursor: {};
  }
}
