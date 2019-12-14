import { Keymap } from '@marduke182/keymaps';
import { Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';

import { Command } from '../type';

export const createKeymapPlugin = <S extends Schema>(keymaps: Keymap<Command<S>>): Plugin => {
  return new Plugin<null, S>({
    props: {
      handleKeyDown: (editorView, event) =>
        keymaps.handle(event, editorView.state, editorView.dispatch),
    },
  });
};
