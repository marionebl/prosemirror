import { Schema } from 'prosemirror-model';
import { NodeWithTags } from './create-doc-builders';
export declare function getNode<S extends Schema>({ node }: NodeWithTags<S>): import("prosemirror-model").Node<S>;
