import { Mark, Node as ProsemirrorNode, Schema } from 'prosemirror-model';
import { FunctionComponent } from 'react';

export interface DOMSerializer<S extends Schema = any> {
  serializeNode(node: ProsemirrorNode<S>): FunctionComponent;

  serializeMark(mark: Mark<S>, inline: boolean): FunctionComponent;
}
