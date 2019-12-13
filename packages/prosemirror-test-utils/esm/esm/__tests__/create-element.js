import { Schema } from 'prosemirror-model';
import { createDocBuilders } from '../create-doc-builders';
import { createElementFactory } from '../create-element';
var baseSchema = new Schema({
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
var docBuilder = createDocBuilders(baseSchema);
var createElement = createElementFactory(docBuilder);
describe('JSX', function () {
    test('should create a document with jsx', function () {
        expect(createElement('doc', null, createElement('paragraph', null, 'Hello World'))).toEqual(docBuilder.doc(docBuilder.paragraph('Hello World')));
    });
});
