import { ExtractMarks, ExtractNodes } from '@marduke182/prosemirror-utils';
import { Node as PMNode, Schema } from 'prosemirror-model';
import {
  Blockquote,
  Break,
  Code,
  Content,
  Definition,
  Delete,
  Emphasis,
  Footnote,
  FootnoteDefinition,
  FootnoteReference,
  Heading,
  HTML,
  Image,
  ImageReference,
  InlineCode,
  Link,
  LinkReference,
  List,
  ListItem,
  Paragraph,
  Root,
  Strong,
  Table,
  Text,
  ThematicBreak,
  YAML,
} from 'mdast';

interface MdastNodesTypes {
  root: Root;
  paragraph: Paragraph;
  break: Break;
  heading: Heading;
  text: Text;

  blockquote: Blockquote;
  code: Code;
  delete: Delete;
  emphasis: Emphasis;
  footnoteReference: FootnoteReference;
  footnote: Footnote;
  html: HTML;
  imageReference: ImageReference;
  image: Image;
  inlineCode: InlineCode;
  linkReference: LinkReference;
  link: Link;
  listItem: ListItem;
  list: List;
  strong: Strong;
  table: Table;
  thematicBreak: ThematicBreak;
  yaml: YAML;
  definition: Definition;
  footnoteDefinition: FootnoteDefinition;
}

export type MdastNodes = keyof MdastNodesTypes;
export type GetAttrs<Attrs = {}> = (node: Content) => Attrs | undefined;

export interface HandlersOptions<S extends Schema, Attrs = {}> {
  node?: ExtractNodes<S>;
  mark?: ExtractMarks<S>;
  getNode?: (node: Content) => ExtractNodes<S>;
  getAttrs?: GetAttrs<Attrs>;
}

export interface Options<S extends Schema> {
  schema: S;
  emptyDoc?: PMNode<S>;
  handlers: {
    [key in MdastNodes]?: HandlersOptions<S>;
  };
}

export type Handler = (h: Factory, node: Content) => PMNode | PMNode[];

export type HandlerCreator = <S extends Schema>(options: Options<S>) => Handler;

export type Handlers = {
  [key in MdastNodes]: Handler;
};

export interface Factory {
  handlers: Handlers;
}

type DefaultNodes = 'text' | 'unknown';
export type DefaultHandlers = { [key in DefaultNodes]: Handler };

export type Serializer = (md: string) => PMNode;
