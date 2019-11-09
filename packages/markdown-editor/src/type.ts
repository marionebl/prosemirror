import { EditorState, Transaction } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';

export type CommandDispatch = (tr: Transaction) => void;
export type Command<S extends Schema> = (
  state: EditorState<S>,
  dispatch: CommandDispatch,
) => boolean;
