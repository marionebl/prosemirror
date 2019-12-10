import { schema, serialize } from '@marduke182/prosemirror-markdown';
import { Editor } from '@marduke182/prosemirror-react-view';
import React, { FunctionComponent } from 'react';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { inputRules, InputRule, textblockTypeInputRule } from 'prosemirror-inputrules';
import { NodeType } from 'prosemirror-model';
interface Props {
  md: string;
}

function headingRule(nodeType: NodeType, maxLevel: number) {
  return textblockTypeInputRule(new RegExp('^(#{1,' + maxLevel + '})\\s$'), nodeType, match => ({
    level: match[1].length,
  }));
}

const rules = [
  new InputRule(/:\-?\)$/, '😀'),
  new InputRule(/:\-?o$/, '😲'),
  new InputRule(/8\-?\)$/, '😎'),
  new InputRule(/<3$/, '❤️'),
  new InputRule(/atlassian$/, 'Atlassian'),
  new InputRule(/jira|JIRA/, 'Jira'),
  headingRule(schema.nodes.heading, 6),
];

const plugins = [inputRules({ rules }), keymap(baseKeymap)];

export const MarkdownEditor: FunctionComponent<Props> = ({ md }) => {
  return <Editor schema={schema} initialDoc={serialize(md || '')} plugins={plugins} />;
};
