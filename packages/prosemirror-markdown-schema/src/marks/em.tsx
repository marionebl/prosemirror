import { createMarkSpecBuilder } from '@marduke182/prosemirror-schema-builder';

export default createMarkSpecBuilder('em', {
  parseDOM: [
    { tag: 'i' },
    { tag: 'em' },
    { style: 'font-style', getAttrs: value => value === 'italic' && null },
  ],
  toDOM() {
    return ['em'];
  },
});
