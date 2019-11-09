import { document } from 'global';

import 'prosemirror-view/style/prosemirror.css';
import 'prosemirror-example-setup/style/style.css';
import 'prosemirror-menu/style/menu.css';
import { mountEditor } from '@marduke182/editor-markdown';

export default {
  title: 'Editor',
};

export const editorStories = () => {
  // Mix the nodes from prosemirror-markdown-schema-list into the basic markdown-schema to
  // create a markdown-schema with list support.
  const content = document.createElement('div');

  mountEditor(content);

  return content;
};
