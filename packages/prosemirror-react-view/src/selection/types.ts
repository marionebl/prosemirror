import { Node as ProseMirrorNode } from 'prosemirror-model';

export interface ViewDesc {
  node: ProseMirrorNode;
  parent?: ViewDesc;
  dom?: Element | Text;
  children: WeakMap<ProseMirrorNode, ViewDesc>;
}
