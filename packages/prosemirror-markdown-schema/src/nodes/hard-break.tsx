import { createNodeSpecBuilder } from '@marduke182/prosemirror-schema-builder';
import inline from '../groups/inline';


export default createNodeSpecBuilder('hard_break', {
  inline: true,
  group: inline,
  selectable: false,
  parseDOM: [{ tag: 'br' }],
  toDOM() {
    return ['br'];
  }
});
