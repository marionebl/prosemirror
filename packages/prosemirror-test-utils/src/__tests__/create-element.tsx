import { Schema } from 'prosemirror-model';

import { createElementFactory } from '../create-element';
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

/* @jsx createElement */
const docBuilder = createDocBuilders(baseSchema);
const createElement = createElementFactory(docBuilder);

describe('JSX', () => {
  test('should create a document with jsx', () => {
    expect(createElement('doc', null, createElement('paragraph', null, 'Hello World'))).toEqual(
      docBuilder.doc(docBuilder.paragraph('Hello World')),
    );
  });
});
