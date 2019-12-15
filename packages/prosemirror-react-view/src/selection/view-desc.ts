import { Node as ProseMirrorNode } from 'prosemirror-model';
import ReactDOM from 'react-dom';

import { ViewDesc } from './types';

export function createViewDesc(node: ProseMirrorNode, parent?: ViewDesc): ViewDesc {
  const viewDesc: ViewDesc = {
    node,
    parent: parent,
    children: new WeakMap<ProseMirrorNode, ViewDesc>(),
  };

  if (parent) {
    parent.children.set(node, viewDesc);
  }

  return viewDesc;
}

export function updateViewDesc(viewDesc: ViewDesc, newNode: ProseMirrorNode) {
  viewDesc.node = newNode;
  return viewDesc;
}

export const assignDomToPmViewDesc = (viewDesc: ViewDesc) => (ref: any) => {
  // https://reactjs.org/docs/refs-and-the-dom.html#exposing-dom-refs-to-parent-components
  // eslint-disable-next-line react/no-find-dom-node
  const dom = ReactDOM.findDOMNode(ref);
  if (dom) {
    viewDesc.dom = dom;
    // TODO: Clean up during componentWillUnmount otherwise will create memory leaks
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    dom.viewDesc = viewDesc;
  }
};
