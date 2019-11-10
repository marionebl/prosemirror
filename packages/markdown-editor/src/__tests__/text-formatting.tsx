/* @jsx createElement */
import { createElement } from '@marduke182/prosemirror-markdown';
import { EditorState, TextSelection } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';
import { toggleMark } from '../text-formatting';
import { NodeWithTags } from '@marduke182/prosemirror-test-utils/src/create-doc-builders';
import { getNode } from '@marduke182/prosemirror-test-utils';

function setupState<S extends Schema>({ node, tags }: NodeWithTags<S>): EditorState<S> {
  let state = EditorState.create({ doc: node });
  const start = tags.find(tag => tag.name === 'start');
  const end = tags.find(tag => tag.name === 'end');
  const cursor = tags.find(tag => tag.name === 'cursor');

  if (start && end) {
    state = state.apply(state.tr.setSelection(TextSelection.create(state.doc, start.pos, end.pos)));
  } else if (cursor) {
    state = state.apply(state.tr.setSelection(TextSelection.create(state.doc, cursor.pos)));
  }
  return state;
}

describe('toggle mark', () => {
  test('should toggle mark', () => {
    let state = setupState(
      <doc>
        <paragraph>
          Foo <select-text>Bar</select-text>
        </paragraph>
      </doc>,
    );

    state = state.apply(toggleMark(state.schema.marks.strong, {})(state.tr));

    expect(state.doc).toEqual(
      getNode(
        <doc>
          <paragraph>
            Foo <strong>Bar</strong>
          </paragraph>
        </doc>,
      ),
    );
  });

  test('should stored mark for cursor', () => {
    let state = setupState(
      <doc>
        <paragraph>
          Foo <cursor />
        </paragraph>
      </doc>,
    );

    state = state.apply(toggleMark(state.schema.marks.strong, {})(state.tr));
    state = state.apply(state.tr.insertText('Bar'));

    expect(state.doc).toEqual(
      getNode(
        <doc>
          <paragraph>
            Foo <strong>Bar</strong>
          </paragraph>
        </doc>,
      ),
    );
  });
});
