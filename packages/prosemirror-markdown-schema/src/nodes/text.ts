import { createNodeSpecBuilder } from '@marduke182/prosemirror-schema-builder';

import inline from '../groups/inline';

const text = createNodeSpecBuilder('text', {
  group: inline,
});

export default text;
