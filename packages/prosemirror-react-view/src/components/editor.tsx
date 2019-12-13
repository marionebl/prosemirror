import { Node as ProsemirrorNode, Schema } from 'prosemirror-model';
import { EditorState, Plugin } from 'prosemirror-state';
import React, {
  createContext,
  FunctionComponent,
  memo,
  NamedExoticComponent,
  PropsWithChildren,
  SyntheticEvent,
  useContext,
} from 'react';

import { DOMSerializerProvider } from '../dom-serializer/context';
import {
  EmptyEditorView,
  ReactEditorView,
  ReactEditorViewNullable,
  useEditorState,
} from '../hooks/useEditor';
import { PMEditorProps } from '../types';
import { getNodeKey, map } from '../utils';
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

const ReactEditorViewContext = createContext<ReactEditorView>(EmptyEditorView);

export const useEditorView = (): ReactEditorView => {
  return useContext(ReactEditorViewContext);
};

export const EditorContent: FunctionComponent = () => {
  const { state: editorState, dispatch } = useEditorView();
  if (!editorState) {
    return null;
  }
  return (
    <div
      className="ProseMirror"
      data-testid="prosemirror-react-view"
      contentEditable={true}
      // TODO: Intercept this and insert text instead
      onKeyDown={event => {
        if (
          someProp(editorState, 'handleKeyDown', f =>
            f({ state: editorState, dispatch, endOfTextblock: () => false }, event),
          )
        ) {
          event.preventDefault();
        }
      }}
      onKeyPress={event => {
        const { $from, $to } = editorState.selection;
        const text = event.key;
        const handled = someProp(editorState, 'handleTextInput', f =>
          f(
            { state: editorState, dispatch, endOfTextblock: () => false },
            $from.pos,
            $to.pos,
            text,
          ),
        );

        if (!handled) {
          const tr = editorState.tr.insertText(text, $from.pos, $to.pos).scrollIntoView();

          dispatch(tr);
        }

        event.preventDefault();
      }}
      onKeyUp={preventDefault}
      onSelect={preventDefault}
      suppressContentEditableWarning
    >
      {/* We dont render root doc because doesn't contain toDOM */}
      {map(editorState.doc, child => (
        <EditorNode node={child} key={getNodeKey(child)} />
      ))}
    </div>
  );
};

function isReactEditorView(
  elem: ReactEditorView | ReactEditorViewNullable,
): elem is ReactEditorView {
  return Boolean(elem.state);
}

export const Editor: NamedExoticComponent<PropsWithChildren<EditorProps>> = memo(
  ({ schema, initialDoc, plugins, children }) => {
    const editorView = useEditorState(schema, initialDoc, plugins);
    if (!isReactEditorView(editorView)) {
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
