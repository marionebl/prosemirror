import { Schema } from 'prosemirror-model';
import { DocBuilders, NodeWithTags } from './create-doc-builders';
export declare const createElementFactory: <S extends Schema<any, any>>(docBuilder: DocBuilders<S, any, any>) => (type: any, attrs: Record<string, any> | null, ...children: (string | NodeWithTags<S>)[]) => string | NodeWithTags<S>;
