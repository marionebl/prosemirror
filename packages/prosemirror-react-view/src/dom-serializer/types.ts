import { Mark, Node as ProsemirrorNode, Schema } from 'prosemirror-model';
import { FunctionComponent } from 'react';

export interface NodeComponentProps<S extends Schema = any> {
  node: ProsemirrorNode<S>;
}

export interface MarkComponentProps<S extends Schema = any> {
  mark: Mark<S>;
  inline: boolean;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DOMSerializer<S extends Schema = any> {
  getNodeComponent(node: ProsemirrorNode<S>): FunctionComponent<NodeComponentProps<S>>;

  getMarkComponent(mark: Mark<S>): FunctionComponent<MarkComponentProps<S>>;
}
