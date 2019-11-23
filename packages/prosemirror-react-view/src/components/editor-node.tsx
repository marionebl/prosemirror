import { Node as ProsemirrorNode } from 'prosemirror-model';
import React, { forwardRef, Ref, useEffect, useState } from 'react';

import { map } from '../utils';
import { useDOMSerializer } from '../dom-serializer/context';

type Props = {
  node: ProsemirrorNode;
  offset: number;
};

type PMViewDesc = any;

interface NodeWithPMViewDesc extends Node {
  pmViewDesc?: PMViewDesc;
}

function applyPMViewDesc(pmViewDesc: PMViewDesc) {
  return (dom?: NodeWithPMViewDesc) => {
    if (dom) {
      dom.pmViewDesc = pmViewDesc;
    }
  };
}

function useReactNode(
  node: ProsemirrorNode,
  offset: number,
  ref: Ref<any>,
): React.ReactElement | null {
  const domSerializer = useDOMSerializer();
  const [Element, setElement] = useState<React.ReactElement | null>(null);

  useEffect(() => {
    const Component = domSerializer.serializeNode(node);

    const pmViewDesc = {
      parent: node,
    };
    // Create children nodes
    const children = map(node, (child, childOffset, index) => {
      return (
        <EditorNode
          node={child}
          offset={offset + childOffset}
          key={index}
          ref={applyPMViewDesc(pmViewDesc)}
        />
      );
    });

    // Create wrapper based on node component
    let Wrapper = <Component ref={ref}>{children}</Component>;

    // Wrap node component with the marks
    for (let i = node.marks.length - 1; i >= 0; i--) {
      const Mark = domSerializer.serializeMark(node.marks[i], node.isInline);
      Wrapper = <Mark>{Wrapper}</Mark>;
    }

    // Set final element
    setElement(Wrapper);
  }, [node, offset, domSerializer]);

  return Element;
}

// eslint-disable-next-line react/display-name
export const EditorNode = forwardRef<any, Props>(({ node, offset }, ref) => {
  return useReactNode(node, offset, ref);
});
