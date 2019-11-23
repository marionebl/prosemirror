import { createSchemaBuilder } from '@marduke182/prosemirror-schema-builder';

import doc from './nodes/doc';
import paragraph from './nodes/paragraph';
import heading from './nodes/heading';
import orderedList from './nodes/ordered-list';
import bulletList from './nodes/bullet-list';
import listItem from './nodes/list-item';
import text from './nodes/text';
import image from './nodes/image';
import codeBlock from './nodes/code-block';
import hardBreak from './nodes/hard-break';
import horizontalRule from './nodes/horizontal-rule';
import link from './marks/link';
import code from './marks/code';
import em from './marks/em';
import strong from './marks/strong';

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
