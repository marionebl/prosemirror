import './editor.css';

import { MarkdownEditor } from '@marduke182/react-markdown-editor';
import React from 'react';

import bigDocument from './big_document';
export default {
  title: 'Editor',
};

export const basic = () => <MarkdownEditor md={bigDocument} />;
