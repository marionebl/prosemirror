import { Literal } from 'unist';
import { HandlerCreator } from '../types';

export const createTextHandler: HandlerCreator = ({ schema }) => (_, node) => {
  const { value } = node as Literal;
  if (typeof value === 'string') {
    return schema.text(value);
  }
  throw new Error('Text hast no string value');
};
