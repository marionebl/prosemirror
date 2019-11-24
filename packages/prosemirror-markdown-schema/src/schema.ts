import { createSchemaBuilder } from '@marduke182/prosemirror-schema-builder';

import code from './marks/code';
import em from './marks/em';
import link from './marks/link';
import strong from './marks/strong';
import bulletList from './nodes/bullet-list';
import codeBlock from './nodes/code-block';
import doc from './nodes/doc';
import hardBreak from './nodes/hard-break';
import heading from './nodes/heading';
import horizontalRule from './nodes/horizontal-rule';
import image from './nodes/image';
import listItem from './nodes/list-item';
import orderedList from './nodes/ordered-list';
import paragraph from './nodes/paragraph';
import text from './nodes/text';

export const schemaBuilder = createSchemaBuilder(
  [
    doc,
    paragraph,
    heading,
    orderedList,
    bulletList,
    listItem,
    text,
    image,
    codeBlock,
    hardBreak,
    horizontalRule,
  ],
  [link, strong, em, code],
);

export const schema = schemaBuilder.build();
