import { atLeast, atLeastOne, group, maybeA, node, sequence } from '../content-builder';

describe('Expression Builder', () => {
  const heading = 'heading';
  const paragraph = 'paragraph';
  const blockquote = 'blockquote';

  test('should add a simple name', () => {
    expect(node(paragraph).build()).toBe('paragraph');
  });

  test('should exclude the paragraph', () => {
    expect(node(paragraph).build([paragraph])).toBe('');
  });

  test('should require at least one paragraph', () => {
    expect(atLeastOne(node(paragraph)).build()).toBe('paragraph+');
  });

  test('should exclude the paragraph if has a modifier', () => {
    expect(atLeastOne(node(paragraph)).build([paragraph])).toBe('');
  });

  test('should require 2 or more paragraphs', () => {
    expect(atLeast(2, node(paragraph)).build()).toBe('paragraph{2,}');
  });

  test('should require none or more paragraphs', () => {
    expect(maybeA(node(paragraph)).build()).toBe('paragraph*');
  });

  test('should pipe multiple nodes', () => {
    expect(group(paragraph, blockquote).build()).toBe('(paragraph|blockquote)');
  });

  test('should pipe multiple nodes', () => {
    expect(maybeA(group(paragraph, blockquote)).build()).toBe('(paragraph|blockquote)*');
  });

  test('should create a sequence of hading and paragraph', () => {
    expect(sequence(node(heading), atLeastOne(node(paragraph))).build()).toBe('heading paragraph+');
  });

  test('should remove heading from the sequence', () => {
    expect(sequence(node(heading), atLeastOne(node(paragraph))).build([heading])).toBe(
      'paragraph+',
    );
  });
});
