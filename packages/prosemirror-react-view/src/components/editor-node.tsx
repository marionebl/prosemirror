import { Node as ProsemirrorNode } from 'prosemirror-model';
import React, { FunctionComponent, useEffect, useState } from 'react';

import { useDOMSerializer } from '../dom-serializer/context';
import { map } from '../utils';

type Props = {
  node: ProsemirrorNode;
  offset: number;
};

function useReactNode(node: ProsemirrorNode, offset: number): React.ReactElement | null {
  const domSerializer = useDOMSerializer();
  const [Element, setElement] = useState<React.ReactElement | null>(null);

  useEffect(() => {
    const Component = domSerializer.serializeNode(node);

    // Create children nodes
    const children = map(node, (child, childOffset, index) => {
      return <EditorNode node={child} offset={offset + childOffset} key={index} />;
    });

    // Create wrapper based on node component
    let Wrapper = <Component>{children}</Component>;

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

export const EditorNode: FunctionComponent<Props> = ({ node, offset }) => {
  return useReactNode(node, offset);
};
