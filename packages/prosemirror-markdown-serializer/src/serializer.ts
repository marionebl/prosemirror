import { Content } from 'mdast';
import { Schema } from 'prosemirror-model';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import breaks from 'remark-breaks';
import markdown from 'remark-parse';
import unified from 'unified';

import toPMDoc from './toPMDoc';
import { Options, Serializer } from './types';

export const createSerializer = <S extends Schema>(options: Options<S>): Serializer => (
  md = '',
) => {
  if (!Boolean(md) && options.emptyDoc) {
    return options.emptyDoc;
  }
  const mdastTree = unified()
    .use(markdown)
    .use(breaks)
    .parse(md);
  return toPMDoc(mdastTree as Content, options);
};
