import { schema, serialize } from '@marduke182/prosemirror-markdown';
import { Editor } from '@marduke182/prosemirror-react-view';
// @ts-ignore
import { exampleSetup } from 'prosemirror-example-setup';
import { InputRule, inputRules, textblockTypeInputRule } from 'prosemirror-inputrules';
import { NodeType } from 'prosemirror-model';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import React, { FunctionComponent } from 'react';

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

const CustomPragraph: FunctionComponent<{ node: ProsemirrorNode }> = ({ children }) => {
  return <p className="custom-paragraph">{children}</p>;
};

const plugins = [
  ...exampleSetup({ menuBar: false, schema }),
  inputRules({ rules }),
  new Plugin({
    props: {
      // @ts-ignore
      toReact: {
        paragraph: CustomPragraph,
      },
    },
  }),
];

export const MarkdownEditor: FunctionComponent<Props> = ({ md }) => {
  return <Editor schema={schema} initialDoc={serialize(md || '')} plugins={plugins} />;
};
