import { schema, serialize } from '@marduke182/prosemirror-markdown';
import React, { FunctionComponent } from 'react';
import { Editor } from '@marduke182/prosemirror-react-view';

interface Props {
  md: string;
}

export const MarkdownEditor: FunctionComponent<Props> = ({ md }) => {
  return <Editor schema={schema} initialDoc={serialize(md || '')} />;
};
