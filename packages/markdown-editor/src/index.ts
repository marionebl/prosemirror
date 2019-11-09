import { schema, serialize } from '@marduke182/prosemirror-markdown';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { textFormattingKeymaps } from './text-formatting';
import { createKeymapPlugin } from './plugins/keymaps';

export type SchemaType = typeof schema;
export function mountEditor(element: HTMLElement, md: string = ''): EditorView<SchemaType> {
  return new EditorView(element, {
    state: EditorState.create({
      doc: serialize(md),
      plugins: [createKeymapPlugin(textFormattingKeymaps)],
    }),
  });
}
