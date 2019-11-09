import { Schema } from 'prosemirror-model';
import { createDocBuilders } from '../create-doc-builders';

const baseSchema = new Schema({
  nodes: {
    doc: {
      content: 'paragraph+',
    },
    paragraph: {
      content: 'text*',
    },
    heading: {
      attrs: {
        level: {
          default: 1,
        },
      },
      content: 'text*',
    },
    text: { inline: true },
  },
  marks: {
    bold: {},
    link: {
      attrs: {
        src: {
          default: '',
        },
      },
    },
  },
});

describe('createDocBuilders', () => {
  test('should create basic builders for each node and mark in markdown-schema', () => {
    const builder = createDocBuilders(baseSchema);

    expect(builder).toEqual({
      doc: expect.any(Function),
      paragraph: expect.any(Function),
      heading: expect.any(Function),
      text: expect.any(Function),
      bold: expect.any(Function),
      link: expect.any(Function),
    });
  });

  test('should create valid basic document', () => {
    const { doc, paragraph } = createDocBuilders(baseSchema);

    expect(doc(paragraph('Hello World')).node).toEqual(
      baseSchema.nodes.doc.create(
        null,
        baseSchema.nodes.paragraph.create(null, baseSchema.text('Hello World')),
      ),
    );
  });

  test('should accept multiple content', () => {
    const { doc, paragraph, heading } = createDocBuilders(baseSchema);

    expect(doc(heading({ level: 1 }, 'Hello'), paragraph('World')).node).toEqual(
      baseSchema.nodes.doc.create(null, [
        baseSchema.nodes.heading.create({ level: 1 }, baseSchema.text('Hello')),
        baseSchema.nodes.paragraph.create(null, baseSchema.text('World')),
      ]),
    );
  });

  test('should create node aliases', () => {
    const { h1 } = createDocBuilders(baseSchema, {
      aliases: {
        nodes: {
          h1: { type: 'heading', attrs: { level: 1 } },
        },
      },
    });

    expect(h1('Hello World').node).toEqual(
      baseSchema.nodes.heading.create({ level: 1 }, baseSchema.text('Hello World')),
    );
  });

  test('should create mark aliases', () => {
    const { google } = createDocBuilders(baseSchema, {
      aliases: {
        marks: {
          google: { type: 'link', attrs: { src: 'http://google.com' } },
        },
      },
    });

    const node = baseSchema.text('Hello World');
    const googleMark = baseSchema.marks.link.create({
      src: 'http://google.com',
    });

    expect(google('Hello World').node).toEqual(node.mark(googleMark.addToSet(node.marks)));
  });
});
