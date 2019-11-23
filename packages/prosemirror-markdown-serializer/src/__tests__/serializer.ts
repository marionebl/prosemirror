import { schemaBuilder } from '@marduke182/prosemirror-markdown-schema';
import { createDocBuilders, getNode } from '@marduke182/prosemirror-test-utils';
import { Image, Link, List } from 'mdast';

import { createSerializer } from '../serializer';
import { Options, Serializer } from '../types';

const schema = schemaBuilder.build();
const {
  doc,
  p,
  br,
  heading,
  strong,
  em,
  code,
  link,
  code_block,
  ordered_list,
  bullet_list,
  list_item,
  image,
  horizontal_rule,
} = createDocBuilders(schema, {
  aliases: {
    nodes: {
      p: { type: 'paragraph' },
      br: { type: 'hard_break' },
    },
  },
});

const options: Options<typeof schema> = {
  schema,
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
};

describe('remark-prosemirror-doc', () => {
  let serializer: Serializer;

  beforeEach(() => {
    serializer = createSerializer(options);
  });

  test('should parse empty markdown', () => {
    const file = serializer('');

    expect(file).toEqual(getNode(doc()));
  });

  test('should parse single text', () => {
    const file = serializer('Hello World');

    expect(file).toEqual(getNode(doc(p('Hello World'))));
  });

  test('should parse single lines as a hard break', () => {
    const file = serializer(
      `
Hello
World
`,
    );

    expect(file).toEqual(getNode(doc(p('Hello', br(), 'World'))));
  });

  test('should parse multiple lines as paragraphs', () => {
    const file = serializer(
      `
Hello

World
`,
    );

    expect(file).toEqual(getNode(doc(p('Hello'), p('World'))));
  });

  test.each([
    ['#', 1],
    ['##', 2],
    ['###', 3],
    ['####', 4],
    ['#####', 5],
    ['######', 6],
  ])('should %s parse into %d', (md, level) => {
    const file = serializer(`${md} Heading ${level}`);
    expect(file).toEqual(getNode(doc(heading({ level }, `Heading ${level}`))));
  });

  test('should ** parse to strong', () => {
    const file = serializer('**strong**');
    expect(file).toEqual(getNode(doc(p(strong('strong')))));
  });

  test('should __ parse to strong', () => {
    const file = serializer('__strong__');
    expect(file).toEqual(getNode(doc(p(strong('strong')))));
  });

  test('should _ parse to emphasis', () => {
    const file = serializer('_emphasis_');
    expect(file).toEqual(getNode(doc(p(em('emphasis')))));
  });

  test('should ` parse to code', () => {
    const file = serializer('`inlineCode`');
    expect(file).toEqual(getNode(doc(p(code('inlineCode')))));
  });

  test('should []() parse to link', () => {
    const file = serializer('[google](http://google.com)');
    expect(file).toEqual(getNode(doc(p(link({ href: 'http://google.com' }, 'google')))));
  });

  test('should parse 1. to a ordered list', () => {
    const file = serializer('1. Ordered List');
    expect(file).toEqual(getNode(doc(ordered_list({}, list_item(p('Ordered List'))))));
  });

  test('should parse * to a bullet list', () => {
    const file = serializer('* Bullet List');
    expect(file).toEqual(getNode(doc(bullet_list({}, list_item(p('Bullet List'))))));
  });

  test('should parse ![]() to an imag', () => {
    const file = serializer('![](http://img.png)');
    expect(file).toEqual(getNode(doc(p(image({ src: 'http://img.png' })))));
  });

  test('should parse ``` to a code block', () => {
    const file = serializer(`
  \`\`\`javascript
  Some code
  \`\`\`
`);
    expect(file).toEqual(getNode(doc(code_block({}, 'Some code'))));
  });

  test('should parse *** to a horizonal rule', () => {
    const file = serializer('***');
    expect(file).toEqual(getNode(doc(horizontal_rule())));
  });
});
