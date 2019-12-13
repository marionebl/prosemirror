import { ExtractMarks, ExtractNodes } from '@marduke182/prosemirror-utils';
import { Node, Schema } from 'prosemirror-model';
interface Tag {
    name: string;
    pos: number;
}
export interface NodeWithTags<S extends Schema> {
    node: Node<S>;
    tags: Tag[];
}
declare type Content<S extends Schema> = NodeWithTags<S> | string;
declare type NodeBuilderWithAttrs<S extends Schema, Attrs = {}> = (maybeContent?: Content<S> | Attrs, ...contents: Content<S>[]) => NodeWithTags<S>;
declare type MarkBuilderWithAttrs<S extends Schema, Attrs = {}> = (maybeContent: Content<S> | Attrs, content?: Content<S>) => NodeWithTags<S>;
export declare type DocBuilders<S extends Schema, AN extends string, AM extends string> = {
    [key in ExtractNodes<S> | AN]: NodeBuilderWithAttrs<S>;
} & {
    [key in ExtractMarks<S> | AM]: MarkBuilderWithAttrs<S>;
};
export declare type Alias<K extends string, P extends string> = {
    [key in P]?: {
        type: K;
        attrs?: any;
    };
};
export interface CreateDocBuildersOptions<N extends string, M extends string, AN extends string, AM extends string> {
    aliases?: {
        marks?: Alias<M, AM>;
        nodes?: Alias<N, AN>;
    };
}
export declare const createDocBuilders: <S extends Schema<any, any>, AN extends string, AM extends string, NS extends ExtractNodes<S>, MS extends ExtractMarks<S>>(schema: S, options?: CreateDocBuildersOptions<NS, MS, AN, AM> | undefined) => DocBuilders<S, AN, AM>;
export {};
