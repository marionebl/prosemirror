import { MarkType, Node, Schema } from 'prosemirror-model';
import { ExtractMarkAttrs, ExtractNodeAttrs, NodeType } from './types';
import { ExtractMarks, ExtractNodes } from '@marduke182/prosemirror-utils';

interface Tag {
  name: string;
  pos: number;
}

export interface NodeWithTags<S extends Schema> {
  node: Node<S>;
  tags: Tag[];
}

type Content<S extends Schema> = NodeWithTags<S> | string;

type NodeBuilderWithAttrs<S extends Schema, Attrs = {}> = (
  maybeContent?: Content<S> | Attrs,
  ...contents: Content<S>[]
) => NodeWithTags<S>;

type MarkBuilderWithAttrs<S extends Schema, Attrs = {}> = (
  maybeContent: Content<S> | Attrs,
  content?: Content<S>,
) => NodeWithTags<S>;

function isContent<S extends Schema>(content: any): content is Content<S> {
  return (
    Boolean(content) &&
    (typeof content === 'string' || (content.node && content.node instanceof Node))
  );
}

function isAttribute(content: any): content is object {
  return typeof content === 'object' && !isContent(content);
}

function getTagsFromTextNode(text: string, initialPos = 0) {
  const tags: Tag[] = [];
  const regex = /<(\w+)>/g;
  let pos = initialPos;
  let at = 0;
  let finalText = '';
  let match = regex.exec(text);
  while (match) {
    finalText += text.slice(at, match.index);
    pos += match.index - at;
    at = match.index + match[0].length;
    tags.push({
      pos,
      name: match[1],
    });
    match = regex.exec(text);
  }
  finalText += text.slice(at);
  pos += text.length - at;
  return {
    tags,
    pos,
    text: finalText,
  };
}

function createNodeBuilder<S extends Schema, K extends NodeType>(
  nodeType: K,
  schema: S,
): NodeBuilderWithAttrs<S, ExtractNodeAttrs<K>> {
  return (maybeChild?: ExtractNodeAttrs<K> | Content<S>, ..._children: Content<S>[]) => {
    const children: Content<S>[] = [..._children];
    let attrs: ExtractNodeAttrs<K> | undefined | Content<S> = undefined;

    if (isContent(maybeChild)) {
      // Rethink this validation (Fails when all the attributes are optionalss)
      // Add at the beginning
      children.unshift(maybeChild);
    } else if (isAttribute(maybeChild)) {
      attrs = maybeChild;
    }

    let pos = 0;
    const tags: Tag[] = [];
    const content: Node[] = [];
    for (const child of children) {
      // When a child is a string we try to look for new tags
      if (typeof child === 'string') {
        const { text, pos: newPos, tags: newTags } = getTagsFromTextNode(child, pos);
        pos = newPos; // update with new pos
        tags.push(...newTags);
        if (text) {
          content.push(schema.text(text));
        }
        continue;
      }

      // If not is because is already a node
      const { node, tags: childTags } = child;
      // Need to remap tags position based on current pos
      const updatedTags = childTags.map(tag => ({
        name: tag.name,
        pos: tag.pos + pos + 1,
      }));
      tags.push(...updatedTags);

      content.push(node);
      // Update position with current one.
      pos = pos + node.nodeSize;
    }

    return {
      tags,
      node: nodeType.create(attrs, content),
    };
  };
}

function getNodeBuilders<S extends Schema, AN extends string>(
  schema: S,
  aliases?: Alias<ExtractNodes<S>, AN>,
): Record<ExtractNodes<S> | AN, NodeBuilderWithAttrs<S>> {
  const result = {} as Record<ExtractNodes<S> | AN, NodeBuilderWithAttrs<S>>;
  for (const name in schema.nodes) {
    if (schema.nodes[name]) {
      const nodeType = schema.nodes[name] as NodeType;
      result[name as ExtractNodes<S>] = createNodeBuilder(nodeType, schema);
    }
  }

  if (aliases) {
    for (const name in aliases) {
      if (aliases.hasOwnProperty(name)) {
        const { type, attrs } = aliases[name]!;
        const builder = result[type];
        result[name] = (maybeContent, ...content) => {
          if (attrs) {
            if (isContent(maybeContent)) {
              return builder(attrs, maybeContent, ...content);
            }
            if (isAttribute(maybeContent)) {
              return builder({ ...maybeContent, ...attrs }, ...content);
            }
            return builder(attrs, ...content);
          }
          return builder(maybeContent, ...content);
        };
      }
    }
  }

  return result;
}

function createMarkBuilder<S extends Schema, K extends MarkType>(
  markType: K,
  schema: S,
): MarkBuilderWithAttrs<S, ExtractMarkAttrs<K>> {
  return (maybeContent?: ExtractMarkAttrs<K> | Content<S>, content?: Content<S>) => {
    let realContent: Content<S>;
    let attrs: ExtractMarkAttrs<K> | undefined = undefined;

    if (isContent(maybeContent)) {
      // Rethink this validation (Fails when all the attributes are optionalss)
      // if (markType.spec.attrs) {
      //   throw new Error(
      //     `The mark: ${markType.name} requires attributes, you might be passing a node as first argument instead`,
      //   );
      // }
      realContent = maybeContent;
    } else {
      if (isAttribute(maybeContent)) {
        attrs = maybeContent;
      }

      if (!isContent(content)) {
        throw new Error(
          `The mark: ${markType.name} requires content, you might be passing attributes as first argument but forgot to pass the content`,
        );
      }
      realContent = content;
    }

    const mark = markType.create(attrs);

    let node: Node;
    let tags: Tag[];
    if (typeof realContent === 'string') {
      const { text, tags: newTags } = getTagsFromTextNode(realContent);
      if (!text) {
        throw new Error('You are trying to apply a mark to an string with only a tag');
      }
      tags = newTags;
      node = schema.text(realContent);
    } else {
      ({ node, tags } = realContent);
    }

    if (mark.type.isInSet(node.marks)) {
      return {
        tags,
        node,
      };
    }

    return {
      tags,
      node: node.mark(mark.addToSet(node.marks)),
    };
  };
}

function getMarkBuilders<S extends Schema, AM extends string>(
  schema: S,
  aliases?: Alias<ExtractMarks<S>, AM>,
): Record<ExtractMarks<S> | AM, MarkBuilderWithAttrs<S>> {
  const result = {} as Record<ExtractMarks<S> | AM, MarkBuilderWithAttrs<S>>;
  for (const name in schema.marks) {
    if (schema.marks[name]) {
      const markType = schema.marks[name];
      result[name as ExtractMarks<S>] = createMarkBuilder(markType, schema);
    }
  }
  if (aliases) {
    for (const name in aliases) {
      if (aliases.hasOwnProperty(name)) {
        const { type, attrs } = aliases[name]!;
        const builder = result[type];
        result[name] = (maybeContent, content) => {
          if (attrs) {
            if (isContent(maybeContent)) {
              return builder(attrs, maybeContent);
            }
            if (isAttribute(maybeContent)) {
              return builder({ ...maybeContent, ...attrs }, content);
            }
          }
          return builder(maybeContent, content);
        };
      }
    }
  }

  return result;
}

export type DocBuilders<S extends Schema, AN extends string, AM extends string> = {
  [key in ExtractNodes<S> | AN]: NodeBuilderWithAttrs<S>;
} &
  {
    [key in ExtractMarks<S> | AM]: MarkBuilderWithAttrs<S>;
  };

export type Alias<K extends string, P extends string> = {
  [key in P]?: { type: K; attrs?: any };
};

export interface CreateDocBuildersOptions<
  N extends string,
  M extends string,
  AN extends string,
  AM extends string
> {
  aliases?: {
    marks?: Alias<M, AM>;
    nodes?: Alias<N, AN>;
  };
}

export const createDocBuilders = <
  S extends Schema,
  AN extends string,
  AM extends string,
  NS extends ExtractNodes<S>,
  MS extends ExtractMarks<S>
>(
  schema: S,
  options?: CreateDocBuildersOptions<NS, MS, AN, AM>,
): DocBuilders<S, AN, AM> => {
  return {
    ...getNodeBuilders<S, AN>(
      schema,
      options && options.aliases && options.aliases.nodes ? options.aliases.nodes : undefined,
    ),
    ...getMarkBuilders<S, AM>(
      schema,
      options && options.aliases && options.aliases.marks ? options.aliases.marks : undefined,
    ),
  };
};
