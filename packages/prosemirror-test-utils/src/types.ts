import { MarkType as PMMarkType, NodeType as PMNodeType } from 'prosemirror-model';
import { MarkSpec, NodeSpec } from '@marduke182/prosemirror-utils';

export interface NodeType<Attrs = {}> extends PMNodeType {
  spec: NodeSpec<Attrs>;
}

export type ExtractNodeAttrs<K> = K extends NodeType<infer Attrs> ? Attrs : Record<string, any>;

export interface MarkType<Attrs = {}> extends PMMarkType {
  spec: MarkSpec<Attrs>;
}

export type ExtractMarkAttrs<K> = K extends MarkType<infer Attrs> ? Attrs : Record<string, any>;
