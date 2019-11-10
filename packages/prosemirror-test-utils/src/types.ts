import { MarkType as PMMarkType, NodeType as PMNodeType } from 'prosemirror-model';
import { MarkSpec, NodeSpec } from '@marduke182/prosemirror-utils';

export interface NodeType<Attrs = {}> extends PMNodeType {
  spec: NodeSpec<Attrs>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtractNodeAttrs<K> = K extends NodeType<infer Attrs> ? Attrs : Record<string, any>;

export interface MarkType<Attrs = {}> extends PMMarkType {
  spec: MarkSpec<Attrs>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtractMarkAttrs<K> = K extends MarkType<infer Attrs> ? Attrs : Record<string, any>;
