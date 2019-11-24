import { Node as ProsemirrorNode } from 'prosemirror-model';
import React, { FunctionComponent, useEffect, useState } from 'react';

import { map } from '../utils';
import { useDOMSerializer } from '../dom-serializer/context';
import { PMViewDesc } from './types';
import { usePMViewDesc } from './hooks/usePMViewDesc';

type Props = {
  node: ProsemirrorNode;
  parent?: PMViewDesc;
  offset: number;
};

function useReactNode(
  node: ProsemirrorNode,
  offset: number,
  parent?: PMViewDesc,
): React.ReactElement | null {
  const domSerializer = useDOMSerializer();
  const [Element, setElement] = useState<React.ReactElement | null>(null);
  const [pmViewDesc, applyPMViewDesc] = usePMViewDesc(node, parent);

  // Create react element
  useEffect(() => {
    const Component = domSerializer.serializeNode(node);
    // Create children nodes
    const children = map(node, (child, childOffset, index) => {
      return (
        <EditorNode node={child} offset={offset + childOffset} key={index} parent={pmViewDesc} />
      );
    });

    // Create wrapper based on node component
    let Wrapper = <Component ref={applyPMViewDesc}>{children}</Component>;

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
export const EditorNode: FunctionComponent<Props> = ({ node, parent, offset }) => {
  return useReactNode(node, offset, parent);
};
