// Schema is based on any we need to skip this rule
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MarkSpec as PMMarkSpec, NodeSpec as PMNodeSpec, Schema } from 'prosemirror-model';

type NodeSpecKnownAttributes =
  | 'content'
  | 'marks'
  | 'group'
  | 'inline'
  | 'atom'
  | 'attrs'
  | 'selectable'
  | 'draggable'
  | 'code'
  | 'defining'
  | 'isolating'
  | 'toDOM'
  | 'parseDOM'
  | 'toDebugString';

type CreateAttributesSpec<Attrs> = {
  [key in keyof Attrs]: {
    default?: Attrs[key];
  };
};

type MarkSpecKnownAttributes =
  | 'attrs'
  | 'inclusive'
  | 'excludes'
  | 'group'
  | 'spanning'
  | 'toDOM'
  | 'parseDOM';

export interface NodeSpec<Attrs = {}> extends Pick<PMNodeSpec, NodeSpecKnownAttributes> {
  attrs?: CreateAttributesSpec<Attrs>;
}

export interface MarkSpec<Attrs = {}> extends Pick<PMMarkSpec, MarkSpecKnownAttributes> {
  attrs?: CreateAttributesSpec<Attrs>;
}

export type ExtractNodes<S> = S extends Schema<infer N, any> ? N : never;
export type ExtractMarks<S> = S extends Schema<any, infer M> ? M : never;
