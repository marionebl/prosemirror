import { HandlerCreator } from '../types';
import { InlineCode } from 'mdast';
import { addMark, createUnknownHandler, getHandlerOptions } from './helpers';

export const createInlineCodeHandler: HandlerCreator = options => {
  const { mark } = getHandlerOptions(options, 'inlineCode');
  if (mark) {
    return (_, node) => {
      const content = options.schema.text((node as InlineCode).value);
      return addMark(options, mark, content);
    };
  }

  return createUnknownHandler(options);
};
