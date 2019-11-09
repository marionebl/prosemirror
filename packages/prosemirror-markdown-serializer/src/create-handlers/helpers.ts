import {
  Factory,
  GetAttrs,
  Handler,
  HandlerCreator,
  HandlersOptions,
  MdastNodes,
  Options,
} from '../types';
import { Node as PMNode, Schema } from 'prosemirror-model';
import { all } from '../all';
import { Content, Parent } from 'mdast';
import { ExtractMarks } from '@marduke182/prosemirror-utils';

export const createUnknownHandler: HandlerCreator = ({ schema }) => () => schema.text('UNKNOWN');

export function getHandlerOptions<S extends Schema>(
  options: Options<S>,
  mdastNode: MdastNodes,
): Omit<HandlersOptions<S>, 'node' | 'getAttrs'> & {
  getAttrs: GetAttrs;
} {
  const handlerOptions = options.handlers[mdastNode] || {};
  const { node, getNode: _getNode, getAttrs: _getAttrs } = handlerOptions;
  let getNode = undefined;
  if (_getNode) {
    getNode = _getNode;
  } else if (node) {
    getNode = () => node;
  }

  let getAttrs: GetAttrs = () => ({});
  if (_getAttrs) {
    getAttrs = _getAttrs;
  }

  return {
    getNode,
    getAttrs,
    mark: handlerOptions.mark,
  };
}

export function addMark<S extends Schema, Attr = {}>(
  options: Options<S>,
  markType: ExtractMarks<S>,
  pmNode: PMNode,
  attrs?: Attr,
) {
  const mark = options.schema.marks[markType].create(attrs);
  if (mark.isInSet(pmNode.marks)) {
    return pmNode;
  }
  return pmNode.mark(mark.addToSet(pmNode.marks));
}

export function createNodeHandler<S extends Schema>(
  options: Options<S>,
  mdastNode: MdastNodes,
): Handler {
  const { schema } = options;
  const { getNode, getAttrs } = getHandlerOptions(options, mdastNode);

  if (getNode) {
    return (h: Factory, node: Content) => {
      const content = all(h, node as Parent);
      return schema.nodes[getNode(node)].create(getAttrs(node), content);
    };
  }
  return createUnknownHandler(options);
}

export function createMarkHandler<S extends Schema>(
  options: Options<S>,
  mdastNode: MdastNodes,
): Handler {
  const { mark: pmMark, getAttrs } = getHandlerOptions(options, mdastNode);
  if (pmMark) {
    return (h: Factory, node: Content) => {
      return all(h, node as Parent).map(pmNode => addMark(options, pmMark, pmNode, getAttrs(node)));
    };
  }
  return createUnknownHandler(options);
}
