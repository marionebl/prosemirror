import { BuilderMarkSpec, createMarkSpecBuilder } from '../mark-spec-builder';

const boldMark = 'bold';
const linkMark = 'link';
const linkSpec: BuilderMarkSpec = {
  attrs: {
    href: {},
    title: { default: null },
  },
  inclusive: false,
  parseDOM: [
    {
      tag: 'a[href]',
      getAttrs(dom) {
        if (dom instanceof HTMLAnchorElement) {
          return {
            href: dom.getAttribute('href'),
            title: dom.getAttribute('title'),
          };
        }
      },
    },
  ],
  toDOM(node) {
    return ['a', node.attrs];
  },
};

describe('MarkSpecBuilder', () => {
  test('should stored the name', () => {
    const markSpecBuilder = createMarkSpecBuilder(linkMark);
    expect(markSpecBuilder.getName()).toEqual(linkMark);
  });

  test('should keep the passed spec after build', () => {
    const markSpecBuilder = createMarkSpecBuilder(linkMark, linkSpec);
    expect(markSpecBuilder.build()).toEqual(linkSpec);
  });

  test('should add bold to excluded mark', () => {
    const markSpecBuilder = createMarkSpecBuilder(linkMark, {
      ...linkSpec,
      excludes: [boldMark],
    });

    expect(markSpecBuilder.build()).toEqual({
      ...linkSpec,
      excludes: 'bold',
    });
  });

  test('should remove bold from excluded mark when bold is excluded in build', () => {
    const markSpecBuilder = createMarkSpecBuilder(linkMark, {
      ...linkSpec,
      excludes: [boldMark],
    });

    expect(markSpecBuilder.build({ marks: [boldMark] })).toEqual(linkSpec);
  });

  test('should return null when mark is excluded', () => {
    const markSpecBuilder = createMarkSpecBuilder(linkMark, linkSpec);
    expect(markSpecBuilder.build({ marks: [linkMark] })).toBeNull();
  });
});
