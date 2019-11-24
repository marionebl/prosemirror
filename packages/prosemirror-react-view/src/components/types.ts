import { Node as ProsemirrorNode } from 'prosemirror-model';

export type ApplyPmViewDesc = (dom: NodeWithPMViewDesc | null) => void;

export interface PMViewDesc {
  node: ProsemirrorNode;
  parent?: PMViewDesc;
}

export interface NodeWithPMViewDesc extends Node {
  pmViewDesc?: PMViewDesc;
}
