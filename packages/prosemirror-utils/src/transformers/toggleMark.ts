import { Transaction } from 'prosemirror-state';
import { MarkType, Schema } from 'prosemirror-model';

export function toggleMark<S extends Schema>(tr: Transaction, markType: MarkType<S>) {
  const { $from, $to } = tr.selection;
  tr.addMark();
  tr.doc.nodesBetween($from.pos, $to.pos, node => {
    if (markType.isInSet(node.marks)) {
      addMark(tr, node, markType);
    }
  });
}
