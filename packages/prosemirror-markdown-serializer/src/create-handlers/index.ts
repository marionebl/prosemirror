import { createTextHandler } from './text';
import { Handlers, Options } from '../types';
import { Schema } from 'prosemirror-model';
import { createMarkHandler, createNodeHandler } from './helpers';
import { createInlineCodeHandler } from './inlineCode';
import { createCodeHandler } from './code';

export const createHandlers = <S extends Schema>(options: Options<S>): Handlers => ({
  root: createNodeHandler(options, 'root'),
  heading: createNodeHandler(options, 'heading'),
  paragraph: createNodeHandler(options, 'paragraph'),
  break: createNodeHandler(options, 'break'),
  blockquote: createNodeHandler(options, 'blockquote'),
  definition: createNodeHandler(options, 'definition'),
  delete: createNodeHandler(options, 'delete'),
  footnote: createNodeHandler(options, 'footnote'),
  footnoteDefinition: createNodeHandler(options, 'footnoteDefinition'),
  footnoteReference: createNodeHandler(options, 'footnoteReference'),
  html: createNodeHandler(options, 'html'),
  image: createNodeHandler(options, 'image'),
  imageReference: createNodeHandler(options, 'imageReference'),
  list: createNodeHandler(options, 'list'),
  listItem: createNodeHandler(options, 'listItem'),
  table: createNodeHandler(options, 'table'),
  yaml: createNodeHandler(options, 'yaml'),
  emphasis: createMarkHandler(options, 'emphasis'),
  link: createMarkHandler(options, 'link'),
  strong: createMarkHandler(options, 'strong'),
  linkReference: createNodeHandler(options, 'link'),
  thematicBreak: createNodeHandler(options, 'thematicBreak'),
  code: createCodeHandler(options),
  inlineCode: createInlineCodeHandler(options),
  text: createTextHandler(options),
});
