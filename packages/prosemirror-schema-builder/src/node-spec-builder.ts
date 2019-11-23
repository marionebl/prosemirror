import { NodeSpec } from '@marduke182/prosemirror-utils';

import { ExpressionBuilder } from './content-builder';
import { BuilderBase, ExcludesFromSchema } from './types';
import { isMarkExcluded, isNodeExcluded } from './helpers';

type BaseNodeSpec<Attrs> = Omit<NodeSpec<Attrs>, 'content' | 'marks'>;
export type BuilderNodeSpec<Attrs = {}> = BaseNodeSpec<Attrs> & {
  content?: ExpressionBuilder;
  marks?: string[];
};

export function createNodeSpecBuilder<Name extends string, Attrs = {}>(
  name: Name,
  spec: BuilderNodeSpec<Attrs> = {},
): BuilderBase<Name, NodeSpec<Attrs>> {
  return {
    getName: () => name,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    build(excludes?: ExcludesFromSchema<any, any>): NodeSpec<Attrs> | null {
      if (isNodeExcluded(name, excludes)) {
        return null;
      }

      return {
        ...spec,
        content: spec.content ? spec.content.build(excludes && excludes.nodes) : undefined,
        marks:
          spec.marks && spec.marks.length > 0
            ? spec.marks.filter(mark => !isMarkExcluded(mark, excludes)).join(' ')
            : undefined,
      };
    },
  };
}
