import { NodeWithPMViewDesc, PMViewDesc } from '../components/types';

function getClosestPMViewDesc(dom: NodeWithPMViewDesc): PMViewDesc | undefined {
  let target: NodeWithPMViewDesc | null = dom;
  while (target && !target.pmViewDesc) {
    target = dom.parentElement;
  }
  if (!target) {
    return;
  }
  return target.pmViewDesc;
}

// The algorithm need to go for each node, each time. Once we implement reference transparency we might want to cache node size calculation
export function findStartPosition(pmViewDesc: PMViewDesc) {
  let pos = 0;
  let current: PMViewDesc = pmViewDesc;

  while (current.parent) {
    const {
      node,
      parent: { node: parentNode },
    } = current;
    let i = 0;
    let sibling = parentNode.child(i++);
    while (sibling !== node) {
      pos = pos + sibling.nodeSize;
      sibling = parentNode.child(i++);
    }

    current = current.parent;
  }

  return pos;
}

export function findDomPos(dom: NodeWithPMViewDesc, offset = 0) {
  const pmViewDesc = getClosestPMViewDesc(dom);

  if (!pmViewDesc) {
    throw new Error('Node is not inside a prosemirror react view');
  }

  const startPos = findStartPosition(pmViewDesc);

  return startPos + offset;
}
