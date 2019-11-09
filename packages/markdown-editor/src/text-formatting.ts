import { TextSelection, Transaction } from 'prosemirror-state';
import { MarkType, Schema } from 'prosemirror-model';

import { KeyCode, Keymap, Mod } from '../../keymaps';
import { Command } from './type';
import { MarkdownSchema } from '@marduke182/prosemirror-markdown';
import { ExtractMarks } from '@marduke182/prosemirror-utils';

export const canApplyMark = <S extends Schema>(
  markType: MarkType<S>,
  tr: Transaction<S>,
): boolean => {
  const { ranges } = tr.selection;
  let canApply = true;
  const iter = ranges.values();
  let next = iter.next();

  // Iterate while I have no more ranges or until canApply is false
  while (!next.done && canApply) {
    const { $from, $to } = next.value;
    // check if valid in range
    let rangeCanApply = false;
    tr.doc.nodesBetween($from.pos, $to.pos, node => {
      if (rangeCanApply) {
        return false; // no iterate on children
      }
      rangeCanApply = node.type.allowsMarkType(markType);
    });
    canApply = rangeCanApply;
    next = iter.next();
  }

  return canApply;
};

export const toggleMark = <S extends Schema, Attrs extends {}>(
  markType: MarkType<S>,
  attrs?: Attrs,
) => (tr: Transaction<S>): Transaction<S> => {
  const { $cursor, ranges } = tr.selection as TextSelection;
  if (!canApplyMark(markType, tr)) {
    return tr;
  }

  // When there is not selection only a cursor we toggle in stored marks
  if ($cursor) {
    if (markType.isInSet(tr.storedMarks || $cursor.marks())) {
      tr.removeStoredMark(markType);
    } else {
      tr.addStoredMark(markType.create(attrs));
    }
  } else {
    for (const { $from, $to } of ranges) {
      if (tr.doc.rangeHasMark($from.pos, $to.pos, markType)) {
        tr.removeMark($from.pos, $to.pos, markType);
      } else {
        tr.addMark($from.pos, $to.pos, markType.create(attrs));
      }
    }
  }

  return tr;
};

const createToggleMarkCommand = (
  markName: ExtractMarks<MarkdownSchema>,
): Command<MarkdownSchema> => {
  return (state, dispatch) => {
    const markType = state.schema.marks[markName];

    if (!canApplyMark(markType, state.tr)) {
      return false;
    }
    if (dispatch) {
      dispatch(toggleMark(markType)(state.tr));
    }
    return true;
  };
};

export const textFormattingKeymaps = new Keymap<Command<MarkdownSchema>>();

textFormattingKeymaps
  .add([Mod.Meta, KeyCode.KeyB], {
    id: 'text-formatting.bold',
    handler: createToggleMarkCommand('strong'),
  })
  .add([Mod.Meta, KeyCode.KeyI], {
    id: 'text-formatting.italic',
    handler: createToggleMarkCommand('em'),
  })
  .add([Mod.Meta, KeyCode.KeyK], {
    id: 'text-formatting.code',
    handler: createToggleMarkCommand('code'),
  });
