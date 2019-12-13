import { Node as ProsemirrorNode, Schema } from 'prosemirror-model';
import { EditorState, Plugin, Transaction } from 'prosemirror-state';
import { useEffect, useState } from 'react';

export type Dispatch = (tr: Transaction) => void;

export interface ReactEditorView {
  state: EditorState;
  dispatch: Dispatch;
}

export interface ReactEditorViewNullable {
  state: EditorState | null;
  dispatch: Dispatch;
}

export const EmptyEditorView: ReactEditorView = {
  state: {} as EditorState,
  dispatch: () => {},
};

export const useEditorState = <S extends Schema>(
  schema: S,
  initialDoc?: ProsemirrorNode<S>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins?: Plugin<any, S>[],
): ReactEditorViewNullable => {
  const [editorState, setEditorState] = useState<EditorState<S> | null>(null);

  useEffect(() => {
    setEditorState(EditorState.create({ schema, plugins, doc: initialDoc }));
  }, [schema, plugins, initialDoc]);

  const apply: Dispatch = (tr: Transaction) => {
    if (editorState) {
      const newState = editorState.apply(tr);
      setEditorState(newState);
    }
  };

  return {
    state: editorState,
    dispatch: apply,
  };
};
