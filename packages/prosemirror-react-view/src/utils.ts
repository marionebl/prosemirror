import { Node as ProsemirrorNode } from 'prosemirror-model';

export function map<T>(
  node: ProsemirrorNode,
  fn: (node: ProsemirrorNode, offset: number, index: number) => T,
): T[] {
  const mappedContent: T[] = [];
  node.forEach((node1, offset, index) => mappedContent.push(fn(node1, offset, index)));
  return mappedContent;
}
