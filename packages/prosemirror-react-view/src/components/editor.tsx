import { Node as ProsemirrorNode, Schema } from 'prosemirror-model';
import { EditorState, Plugin } from 'prosemirror-state';
import React, {
  ComponentType,
  createContext,
  FunctionComponent,
  KeyboardEvent,
  memo,
  NamedExoticComponent,
  PropsWithChildren,
  SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { DOMSerializerProvider } from '../dom-serializer/context';
import { ReactEditorView, useEditor } from '../hooks/useEditor';
import { ViewDesc } from '../selection/types';
import { createViewDesc, updateViewDesc } from '../selection/view-desc';
import { PMEditorProps } from '../types';
import { map } from '../utils';
import { EditorNode } from './editor-node';

export interface EditorProps {
  schema: Schema;
  initialDoc?: ProsemirrorNode;
  plugins?: Plugin[];
}

const preventDefault = (e: SyntheticEvent) => {
  e.preventDefault();
};

function someProp<T extends keyof PMEditorProps>(
  editorState: EditorState,
  propName: T,
  cb: (prop: Exclude<PMEditorProps[T], null | undefined>) => any,
) {
  const plugins = editorState.plugins;
  if (plugins) {
    for (let i = 0; i < plugins.length; i++) {
      const plugin = plugins[i];
      const prop = (plugin.props as PMEditorProps)[propName];
      if (prop !== null && prop !== undefined) {
        const value = cb ? cb(prop!) : prop;
        if (value) {
          return value;
        }
      }
    }
  }
}

const ReactEditorViewContext = createContext<ReactEditorView | null>(null);

export const useEditorView = (): ReactEditorView | null => {
  return useContext(ReactEditorViewContext);
};

export const useEditorState = (): EditorState | null => {
  const editorView = useEditorView();
  const [state, setState] = useState<EditorState | null>(null);

  useEffect(() => {
    function subscribeToEditorView(newState: EditorState) {
      setState(newState);
    }
    let unsubscribe = () => {};
    if (editorView) {
      unsubscribe = editorView.subscribe(subscribeToEditorView);
    }

    return () => unsubscribe();
  }, [editorView]);

  return state;
};

export function useViewDesc(node: ProsemirrorNode, parent?: ViewDesc) {
  const viewDesc = useRef(createViewDesc(node, parent));

  useMemo(() => {
    viewDesc.current = updateViewDesc(viewDesc.current, node);
  }, [node]);

  return viewDesc;
}

const Renderer: FunctionComponent<{ doc: ProsemirrorNode }> = memo(({ doc }) => {
  const viewDesc = useViewDesc(doc);
  
  let index = 0;
  return (
    <>
      {/* We dont render root doc because doesn't contain toDOM */}
      {map(doc, child => (
        <EditorNode node={child} viewDesc={viewDesc.current} key={index++} />
      ))}
    </>
  );
});

Renderer.displayName = 'Renderer';

function withStateDoc(WrapperComponent: ComponentType<{ doc: ProsemirrorNode }>) {
  const WithStateDoc: FunctionComponent = memo(() => {
    const state = useEditorState();

    if (!state || !state.doc) {
      return null;
    }

    return <WrapperComponent doc={state.doc} />;
  });

  WithStateDoc.displayName = `withStateDoc(${WrapperComponent.displayName})`;

  return WithStateDoc;
}

const RendererWithDoc = withStateDoc(Renderer);

export const EditorContent: FunctionComponent = memo(() => {
  const editorView = useEditorView();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!editorView) {
        return;
      }
      if (
        someProp(editorView.state, 'handleKeyDown', f =>
          f(
            {
              state: editorView.state,
              dispatch: editorView.dispatch,
              endOfTextblock: () => false,
            },
            event,
          ),
        )
      ) {
        event.preventDefault();
      }
    },
    [editorView],
  );

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!editorView) {
        return;
      }
      const { $from, $to } = editorView.state.selection;
      const text = event.key;
      const handled = someProp(editorView.state, 'handleTextInput', f =>
        f(
          { state: editorView.state, dispatch: editorView.dispatch, endOfTextblock: () => false },
          $from.pos,
          $to.pos,
          text,
        ),
      );

      if (!handled) {
        const tr = editorView.state.tr.insertText(text, $from.pos, $to.pos).scrollIntoView();

        editorView.dispatch(tr);
      }

      event.preventDefault();
    },
    [editorView],
  );

  if (!editorView) {
    return null;
  }

  return (
    <div
      className="ProseMirror"
      data-testid="prosemirror-react-view"
      contentEditable={true}
      onKeyDown={handleKeyDown}
      onKeyPress={handleKeyPress}
      onKeyUp={preventDefault}
      onSelect={preventDefault}
      suppressContentEditableWarning
    >
      <RendererWithDoc />
    </div>
  );
});

EditorContent.displayName = 'EditorContent';

export const Editor: NamedExoticComponent<PropsWithChildren<EditorProps>> = memo(
  ({ schema, initialDoc, plugins, children }) => {
    const editorView = useEditor(schema, initialDoc, plugins);
    if (!editorView) {
      return null;
    }

    return (
      <ReactEditorViewContext.Provider value={editorView}>
        <DOMSerializerProvider schema={schema} plugins={plugins}>
          {children}
        </DOMSerializerProvider>
      </ReactEditorViewContext.Provider>
    );
  },
);

Editor.displayName = 'Editor';
