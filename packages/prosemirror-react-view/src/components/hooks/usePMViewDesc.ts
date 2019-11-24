import { Node as ProsemirrorNode } from 'prosemirror-model';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ApplyPmViewDesc, NodeWithPMViewDesc, PMViewDesc } from '../types';

export function usePMViewDesc(
  node?: ProsemirrorNode,
  parent?: PMViewDesc,
): [PMViewDesc | undefined, ApplyPmViewDesc] {
  const [pmViewDesc, setPMViewDesc] = useState<PMViewDesc | undefined>(node ? { node } : undefined);
  const domRef = useRef<NodeWithPMViewDesc>();

  // Create pmDescView when parent or node change
  useEffect(() => {
    if (node) {
      setPMViewDesc({
        node,
        parent,
      });
    } else {
      setPMViewDesc(undefined);
    }
  }, [parent, node]);

  // Set in Dom node if available
  useEffect(() => {
    if (domRef.current) {
      domRef.current.pmViewDesc = pmViewDesc;
    }
  }, [pmViewDesc]);

  const applyPMViewDesc: ApplyPmViewDesc = useCallback(
    (dom: NodeWithPMViewDesc | null) => {
      if (dom) {
        domRef.current = dom;
        // Set the current pmViewDesc the first time
        dom.pmViewDesc = pmViewDesc;
      }
    },
    [pmViewDesc],
  );

  return [pmViewDesc, applyPMViewDesc];
}
