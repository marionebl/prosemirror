import { Node as ProsemirrorNode, Schema } from 'prosemirror-model';
import { EditorState, Plugin, Transaction } from 'prosemirror-state';
import React, { memo, NamedExoticComponent, SyntheticEvent } from 'react';

import { DOMSerializerProvider } from '../dom-serializer/context';
import { useEditorState } from '../hooks/useEditor';
import { map } from '../utils';
import { EditorNode } from './editor-node';

type Command = (tr: Transaction) => void;

interface PartialEditorView<S extends Schema = any> {
  state: EditorState<S>;
  dispatch: Command;
}

export interface PMEditorProps<S extends Schema = any> {
  handleKeyDown?: ((view: PartialEditorView<S>, event: KeyboardEvent) => boolean) | null;
  /**
   * Handler for `keypress` events.
   */
  handleKeyPress?: ((view: PartialEditorView<S>, event: KeyboardEvent) => boolean) | null;
}

export interface EditorProps {
  schema: Schema;
  initialDoc?: ProsemirrorNode;
  plugins?: Plugin[];
}

const preventDefault = (e: SyntheticEvent) => {
  e.preventDefault();
};

function someProp(editorState: EditorState, propName: keyof PMEditorProps, cb: Function) {
  const plugins = editorState.plugins;
  if (plugins) {
    for (let i = 0; i < plugins.length; i++) {
      const plugin = plugins[i];
      const prop = plugin.props[propName] as PMEditorProps[typeof propName];
      if (prop != null) {
        const value = cb ? cb(prop) : prop;
        if (value) {
          return value;
        }
      }
    }
  }
}

export const Editor: NamedExoticComponent<EditorProps> = memo(({ schema, initialDoc, plugins }) => {
  const [editorState, apply] = useEditorState(schema, initialDoc, plugins);
  if (!editorState) {
    return null;
  }
  let index = 0;
  return (
    <DOMSerializerProvider schema={schema}>
      <div
        data-testid="prosemirror-react-view"
        contentEditable={true}
        // TODO: Intercept this and insert text instead
        onKeyDown={event => {
          if (
            someProp(editorState, 'handleKeyDown', (f: Function) =>
              f({ state: editorState, dispatch: apply, endOfTextblock: () => false }, event),
            )
          ) {
            event.preventDefault();
          }
        }}
        onKeyPress={event => {
          const handled = someProp(editorState, 'handleKeyPress', (f: Function) =>
            f({ state: editorState, dispatch: apply, endOfTextblock: () => false }, event),
          );

          if (!handled) {
            const { $from, $to } = editorState.selection;
            const text = event.key;
            const tr = editorState.tr.insertText(text, $from.pos, $to.pos).scrollIntoView();

            apply(tr);
          }

          event.preventDefault();
        }}
        onKeyUp={preventDefault}
        onSelect={preventDefault}
        suppressContentEditableWarning
      >
        {/* We dont render root doc because doesnt contain toDOM */}
        {map(editorState.doc, child => (
          <EditorNode node={child} key={index++} />
        ))}
      </div>
    </DOMSerializerProvider>
  );
});

Editor.displayName = 'Editor';
