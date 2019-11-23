import { Literal } from 'mdast';

import { HandlerCreator } from '../types';

export const createTextHandler: HandlerCreator = ({ schema }) => (_, node) => {
  const { value } = node as Literal;
  return schema.text(value);
};
