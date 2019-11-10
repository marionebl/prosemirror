import unified from 'unified';
import { Schema } from 'prosemirror-model';
import toPMDoc from './toPMDoc';
import markdown from 'remark-parse';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import breaks from 'remark-breaks';
import { Options, Serializer } from './types';
import { Content } from 'mdast';

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
