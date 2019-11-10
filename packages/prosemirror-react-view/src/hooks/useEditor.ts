import { useEffect, useState } from 'react';
import { EditorState, Plugin, Transaction } from 'prosemirror-state';
import { Node as ProsemirrorNode, Schema } from 'prosemirror-model';

type ApplyFunction = (tr: Transaction) => void;

export const useEditorState = <S extends Schema>(
  schema: S,
  initialDoc?: ProsemirrorNode<S>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins?: Plugin<any, S>[],
): [EditorState<S> | null, ApplyFunction] => {
  const [editorState, setEditorState] = useState<EditorState<S> | null>(null);

  useEffect(() => {
    setEditorState(EditorState.create({ schema, plugins, doc: initialDoc }));
  }, [schema, plugins, initialDoc]);

  const apply: ApplyFunction = (tr: Transaction) => {
    if (editorState) {
      const newState = editorState.apply(tr);
      setEditorState(newState);
    }
  };

  return [editorState, apply];
};
