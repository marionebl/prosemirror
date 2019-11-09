import { atLeastOne, node, createNodeSpecBuilder } from '@marduke182/prosemirror-schema-builder';
import block from '../groups/block';

const doc = createNodeSpecBuilder('doc', {
  content: atLeastOne(node(block)),
});

export default doc;
