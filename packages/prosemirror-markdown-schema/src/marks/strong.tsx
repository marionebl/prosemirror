import { createMarkSpecBuilder } from '@marduke182/prosemirror-schema-builder';

export default createMarkSpecBuilder('strong', {
  parseDOM: [
    { tag: 'b' },
    { tag: 'strong' },
    {
      style: 'font-weight',
      getAttrs: value => {
        if (
          typeof value === 'string' &&
          /^(bold(er)?|[5-9]\d{2,})$/.test(value)
        ) {
          return null;
        }
        return false;
      },
    },
  ],
  toDOM() {
    return ['strong'];
  }
});
