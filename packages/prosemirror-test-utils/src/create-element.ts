/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema } from 'prosemirror-model';
import { DocBuilders, NodeWithTags } from './create-doc-builders';

type SelectionElement = 'select-text' | 'cursor';

function isSelectionElement(type: string): type is SelectionElement {
  return ['select-text', 'cursor'].indexOf(type) !== -1;
}

function handleSelectionElement<S extends Schema>(
  type: SelectionElement,
  _: Record<string, any> | null,
  ...children: (NodeWithTags<S> | string)[]
) {
  switch (type) {
    case 'select-text': {
      if (children.length !== 1 || typeof children[0] !== 'string') {
        throw new Error(`'select-text' expect a text child but it got ${children}`);
      }
      return `<start>${children[0]}<end>`;
    }
    case 'cursor': {
      return '<cursor>';
    }
    default: {
      throw new Error(`Missing type implementation ${type} for selection`);
    }
  }
}

export const createElementFactory = <S extends Schema>(docBuilder: DocBuilders<S, any, any>) => {
  return (
    type: keyof DocBuilders<S, any, any>,
    attrs: Record<string, any> | null,
    ...children: (NodeWithTags<S> | string)[]
  ): NodeWithTags<S> | string => {
    if (isSelectionElement(type)) {
      return handleSelectionElement(type, attrs, ...children);
    }

    const builder = docBuilder[type];
    if (!builder) {
      throw new Error(`Builder '${type}' doesnt exist. You might be using a wrong node.`);
    }
    return builder(attrs ? attrs : {}, ...children);
  };
};
