import { BuilderBase, ExcludesFromSchema } from './types';
import { Schema } from 'prosemirror-model';
import { MarkSpec, NodeSpec } from '@marduke182/prosemirror-utils';

type CustomExclude<K, P> = P extends string ? Exclude<K, P> : K;

export const createSchemaBuilder = <N extends string, M extends string>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nodes: BuilderBase<N, NodeSpec<any>>[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  marks: BuilderBase<M, MarkSpec<any>>[],
) => {
  return {
    build: <EN, EM>(
      excludes?: ExcludesFromSchema<EN, EM>,
    ): Schema<CustomExclude<N, EN>, CustomExclude<M, EM>> => {
      const nodesMap = nodes.reduce<Record<N, NodeSpec>>((acc, node) => {
        const spec = node.build(excludes);
        if (!spec) {
          return acc;
        }
        return {
          ...acc,
          [node.getName()]: spec,
        };
      }, {} as Record<N, NodeSpec>);

      const markMap = marks.reduce<Record<M, MarkSpec>>((acc, mark) => {
        const spec = mark.build(excludes);
        if (spec === null) {
          return acc;
        }
        return {
          ...acc,
          [mark.getName()]: spec,
        };
      }, {} as Record<M, MarkSpec>);

      return new Schema<N, M>({
        nodes: nodesMap,
        marks: markMap,
      });
    },
  };
};
