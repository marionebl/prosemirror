import { BuilderNodeSpec, createNodeSpecBuilder } from '../node-spec-builder';
import { ExpressionBuilder } from '../content-builder';

const paragraphNode = 'paragraph';
const paragraphSpec: BuilderNodeSpec = {
  group: 'block',
  parseDOM: [{ tag: 'p' }],
  toDOM() {
    return ['p', 0];
  },
};
const boldMark = 'bold';

describe('NodeSpecBuilder', () => {
  test('should stored node name', () => {
    const nodeSpecBuilder = createNodeSpecBuilder(paragraphNode);
    expect(nodeSpecBuilder.getName()).toEqual(paragraphNode);
  });

  test('should get the spec on build', () => {
    const nodeSpecBuilder = createNodeSpecBuilder(paragraphNode, paragraphSpec);

    expect(nodeSpecBuilder.build()).toEqual(paragraphSpec);
  });

  test('should add mark to spec', () => {
    const nodeSpecBuilder = createNodeSpecBuilder(paragraphNode, {
      ...paragraphSpec,
      marks: [boldMark],
    });

    expect(nodeSpecBuilder.build()).toEqual({
      ...paragraphSpec,
      marks: `${boldMark}`,
    });
  });

  test('should call content builder with excludes nodes', () => {
    const contentBuilderMock = {
      build: jest.fn(() => ''),
    } as ExpressionBuilder;
    const nodeSpecBuilder = createNodeSpecBuilder(paragraphNode, {
      ...paragraphSpec,
      content: contentBuilderMock,
    });
    const excludeNodes = ['foo', 'bar'];

    nodeSpecBuilder.build({ nodes: excludeNodes });

    expect(contentBuilderMock.build).toHaveBeenCalledWith(excludeNodes);
  });

  test('should return null when the node es excluded', () => {
    const nodeSpecBuilder = createNodeSpecBuilder(paragraphNode, paragraphSpec);
    expect(nodeSpecBuilder.build({ nodes: [paragraphNode] })).toBeNull();
  });
});
