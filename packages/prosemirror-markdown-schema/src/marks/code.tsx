import { createMarkSpecBuilder } from '@marduke182/prosemirror-schema-builder';

export default createMarkSpecBuilder('code', {
  parseDOM: [{ tag: 'code' }],
  toDOM() {
    return ['code'];
  }
});
