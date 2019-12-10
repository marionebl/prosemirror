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
    const NodeComponent = domSerializer.getNodeComponent(node);

    // Create children nodes
    const children = map(node, (child, index) => {
      return <EditorNode node={child} key={index} />;
    });

    // Create wrapper based on node component
    let Wrapper = <NodeComponent node={node}>{children}</NodeComponent>;

    // Wrap node component with the marks
    for (let i = node.marks.length - 1; i >= 0; i--) {
      const mark = node.marks[i];
      const Mark = domSerializer.getMarkComponent(node.marks[i]);
      Wrapper = (
        <Mark mark={mark} inline={node.isInline}>
          {Wrapper}
        </Mark>
      );
    }

    // Set final element
    return Wrapper;
  }, [node, domSerializer]);
});

EditorNode.displayName = 'EditorNode';
