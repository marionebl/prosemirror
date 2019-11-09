import { Schema } from 'prosemirror-model';
import { NodeWithTags } from './create-doc-builders';

export function getNode<S extends Schema>({ node }: NodeWithTags<S>) {
  return node;
}
