import { Node as ProsemirrorNode } from 'prosemirror-model';
import React, { memo, NamedExoticComponent, useMemo } from 'react';

import { useDOMSerializer } from '../dom-serializer/context';
import { ViewDesc } from '../selection/types';
import { assignDomToPmViewDesc } from '../selection/view-desc';
import { map } from '../utils';
import { useViewDesc } from './editor';

type Props = {
  node: ProsemirrorNode;
  viewDesc?: ViewDesc;
};

export const EditorNode: NamedExoticComponent<Props> = memo(
  ({ node, viewDesc: parentViewDesc }) => {
    const domSerializer = useDOMSerializer();
    const viewDesc = useViewDesc(node, parentViewDesc);
    return useMemo(() => {
      let index = 0;
      const NodeComponent = domSerializer.getNodeComponent(node);

      // Create children nodes
      const children = map(node, child => {
        return <EditorNode node={child} key={index++} viewDesc={viewDesc.current} />;
      });

      // Create wrapper based on node component
      let Wrapper = (
        <NodeComponent node={node} ref={assignDomToPmViewDesc(viewDesc.current)}>
          {children}
        </NodeComponent>
      );

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
    }, [node]);
  },
  (prevProps, nextProps) => prevProps.node === nextProps.node,
);

EditorNode.displayName = 'EditorNode';
