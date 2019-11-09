import { Node as PMNode, Schema } from 'prosemirror-model';
import { one } from './one';
import { Factory, Options } from './types';
import { createHandlers } from './create-handlers';
import { Content } from 'mdast';

function factory(options: Options<Schema>): Factory {
  return {
    handlers: createHandlers(options),
  };
}

const toPMDoc = <S extends Schema>(tree: Content, options: Options<S>): PMNode<S> => {
  const h = factory(options);
  const doc = one(h, tree);
  if (doc && !Array.isArray(doc)) {
    return doc;
  }
  throw new Error('Mdast should start with a single root document');
};

export default toPMDoc;
