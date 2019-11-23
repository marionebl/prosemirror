import { Plugin } from 'prosemirror-state';
import { Node as ProsemirrorNode, Schema } from 'prosemirror-model';
import React, { FunctionComponent, SyntheticEvent } from 'react';

import { useEditorState } from '../hooks/useEditor';
import { EditorNode } from './editor-node';
import { map } from '../utils';
import { DOMSerializerProvider } from '../dom-serializer/context';

export interface EditorProps {
  schema: Schema;
  initialDoc?: ProsemirrorNode;
  plugins?: Plugin[];
}

const preventDefault = (e: SyntheticEvent) => {
  e.preventDefault();
};

export const Editor: FunctionComponent<EditorProps> = ({ schema, initialDoc, plugins }) => {
  const [editorState] = useEditorState(schema, initialDoc, plugins);
  if (!editorState) {
    return null;
  }
  return (
    <DOMSerializerProvider schema={schema}>
      <div
        data-testid="prosemirror-react-view"
        contentEditable={true}
        // TODO: Intercept this and insert text instead
        onKeyDown={preventDefault}
        onKeyPress={preventDefault}
        onKeyUp={preventDefault}
        onSelect={preventDefault}
        suppressContentEditableWarning
      >
        {/* We dont render root doc because doesnt contain toDOM */}
        {map(editorState.doc, (child, offset, index) => (
          <EditorNode node={child} offset={offset} key={index} />
        ))}
      </div>
    </DOMSerializerProvider>
  );
};
