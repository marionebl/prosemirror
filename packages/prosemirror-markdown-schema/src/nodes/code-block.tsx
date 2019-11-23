import { createNodeSpecBuilder, maybeA, node } from '@marduke182/prosemirror-schema-builder';

import block from '../groups/block';
import text from './text';

export interface CodeBlockAttributes {
  params: string;
}

export default createNodeSpecBuilder<'code_block', CodeBlockAttributes>('code_block', {
  content: maybeA(node(text.getName())),
  group: block,
  code: true,
  defining: true,
  attrs: { params: { default: '' } },
  parseDOM: [
    {
      tag: 'pre',
      preserveWhitespace: true,
      getAttrs: codeBlockNode => ({
        params: (codeBlockNode as HTMLPreElement).getAttribute('data-params') || '',
      }),
    },
  ],
  toDOM(pmNode) {
    return ['pre', { 'data-params': pmNode.attrs.params || '' }, ['code', 0]];
  },
});
