import React from 'react';
import { docBuilders, schema } from '@marduke182/prosemirror-markdown';
import { render } from '@testing-library/react';
import { NodeWithTags } from '@marduke182/prosemirror-test-utils/src/create-doc-builders';
import { Schema } from 'prosemirror-model';

import { findStartPosition } from '../find-dom-pos';
import { Editor } from '../../components/editor';
import { NodeWithPMViewDesc } from '../../components/types';

function createEditor<S extends Schema>(docBuilded: NodeWithTags<S>) {
  return render(<Editor schema={schema} initialDoc={docBuilded.node} />);
}

function getPos<S extends Schema>({ tags }: NodeWithTags<S>, name: string): number | null {
  const tag = tags.find(tag => tag.name === name);
  if (tag) {
    return tag.pos;
  }
  return null;
}

const { doc, p, strong } = docBuilders;

describe('findStartPos', () => {
  test('should find position', async () => {
    const docBuild = doc(p('foo', strong('<start>strong'), 'bar'));
    const { findByText } = createEditor(docBuild);

    const element = (await findByText(/strong/i)) as NodeWithPMViewDesc;
    expect(findStartPosition(element.pmViewDesc!)).toBe(getPos(docBuild, 'start'));
  });
});
