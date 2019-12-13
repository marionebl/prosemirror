import { MarkSpec, NodeSpec } from '@marduke182/prosemirror-utils';
import { MarkType as PMMarkType, NodeType as PMNodeType } from 'prosemirror-model';
export interface NodeType<Attrs = {}> extends PMNodeType {
    spec: NodeSpec<Attrs>;
}
export declare type ExtractNodeAttrs<K> = K extends NodeType<infer Attrs> ? Attrs : Record<string, any>;
export interface MarkType<Attrs = {}> extends PMMarkType {
    spec: MarkSpec<Attrs>;
}
export declare type ExtractMarkAttrs<K> = K extends MarkType<infer Attrs> ? Attrs : Record<string, any>;
