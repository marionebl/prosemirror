import { Node as ProsemirrorNode } from 'prosemirror-model';
import React, { useMemo, memo, NamedExoticComponent } from 'react';

import { useDOMSerializer } from '../dom-serializer/context';
import { map } from '../utils';

type Props = {
  node: ProsemirrorNode;
};

export const EditorNode: NamedExoticComponent<Props> = memo(({ node }) => {
  const domSerializer = useDOMSerializer();

  return useMemo(() => {
    const Component = domSerializer.serializeNode(node);

    // Create children nodes
    const children = map(node, (child, index) => {
      return <EditorNode node={child} key={index} />;
    });

    // Create wrapper based on node component
    Component.displayName = node.type.name;
    let Wrapper = <Component>{children}</Component>;

    // Wrap node component with the marks
    for (let i = node.marks.length - 1; i >= 0; i--) {
      const mark = node.marks[i];
      const Mark = domSerializer.serializeMark(node.marks[i], node.isInline);
      Mark.displayName = mark.type.name;
      Wrapper = <Mark>{Wrapper}</Mark>;
    }

    // Set final element
    return Wrapper;
  }, [node, domSerializer]);
});

EditorNode.displayName = 'EditorNode';
