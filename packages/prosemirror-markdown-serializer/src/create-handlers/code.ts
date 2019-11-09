import { HandlerCreator } from '../types';
import { Code } from 'mdast';
import { createUnknownHandler, getHandlerOptions } from './helpers';

export const createCodeHandler: HandlerCreator = options => {
  const { getNode, getAttrs } = getHandlerOptions(options, 'code');
  if (getNode) {
    return (_, node) => {
      const content = options.schema.text((node as Code).value);
      return options.schema.nodes[getNode(node)].create(getAttrs(node), content);
    };
  }

  return createUnknownHandler(options);
};
