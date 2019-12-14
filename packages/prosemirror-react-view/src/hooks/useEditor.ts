import { Node as ProsemirrorNode, Schema } from 'prosemirror-model';
import { EditorState, Plugin, Transaction } from 'prosemirror-state';
import { useEffect, useState } from 'react';

export type Dispatch = (tr: Transaction) => void;

export interface ReactEditorView<S extends Schema = any> {
  state: EditorState<S>;
  dispatch: Dispatch;
  subscribe: (sb: StateSubscription) => StateUnsubscribe;
}

export interface ReactEditorViewNullable {
  state: EditorState | null;
  dispatch: Dispatch;
}

export type StateSubscription = <S extends Schema = any>(state: EditorState<S>) => void;
type StateUnsubscribe = () => void;

export class EditorView<S extends Schema = any> implements ReactEditorView<S> {
  private listeners = new Set<StateSubscription>();
  state: EditorState;

  constructor(state: EditorState) {
    this.state = state;
  }

  dispatch = (tr: Transaction) => {
    if (this.state) {
      this.state = this.state.apply(tr);
      this.notifySubscribers();
    }
  };

  private notifySubscribers() {
    this.listeners.forEach(cb => cb(this.state));
  }

  subscribe(cb: StateSubscription) {
    cb(this.state);
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }
}

export const useEditor = <S extends Schema>(
  schema: S,
  initialDoc?: ProsemirrorNode<S>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins?: Plugin<any, S>[],
): ReactEditorView | null => {
  const [editorView, setEditorView] = useState<EditorView<S> | null>(null);

  useEffect(() => {
    setEditorView(new EditorView(EditorState.create({ schema, plugins, doc: initialDoc })));
  }, [schema, plugins, initialDoc]);

  return editorView;
};
