import { schemaBuilder } from '../schema';

describe('Schema Builder', () => {
  test('should create all nodes', () => {
    const schema = schemaBuilder.build();

    expect(schema.nodes).toEqual(
      expect.objectContaining({
        doc: expect.any(Object),
        heading: expect.any(Object),
        image: expect.any(Object),
        bullet_list: expect.any(Object),
        ordered_list: expect.any(Object),
        paragraph: expect.any(Object),
        text: expect.any(Object),
        hard_break: expect.any(Object),
        code_block: expect.any(Object),
        horizontal_rule: expect.any(Object),
      }),
    );
  });

  test('should create all marks', () => {
    const schema = schemaBuilder.build();

    expect(schema.marks).toEqual(
      expect.objectContaining({
        link: expect.any(Object),
        em: expect.any(Object),
        strong: expect.any(Object),
        code: expect.any(Object),
      }),
    );
  });
});
