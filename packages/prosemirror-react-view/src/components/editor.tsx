import { Node as ProsemirrorNode, Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import React, { memo, NamedExoticComponent } from 'react';

import { DOMSerializerProvider } from '../dom-serializer/context';
import { useEditorState } from '../hooks/useEditor';
import { map } from '../utils';
import { EditorNode } from './editor-node';

export interface EditorProps {
  schema: Schema;
  initialDoc?: ProsemirrorNode;
  plugins?: Plugin[];
}

// const preventDefault = (e: SyntheticEvent) => {
//   e.preventDefault();
// };

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
        // onKeyDown={preventDefault}
        onKeyPress={e => {
          if (!editorState) {
            return;
          }

          const { $from, $to } = editorState.selection;
          const text = e.key;
          const tr = editorState.tr.insertText(text, $from.pos, $to.pos).scrollIntoView();

          apply(tr);

          e.preventDefault();
        }}
        // onKeyUp={preventDefault}
        // onSelect={preventDefault}
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
