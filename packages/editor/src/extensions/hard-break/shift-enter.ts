import { defineKeymap, union, type Extension } from "@prosekit/core";
import type { EditorState } from "@prosekit/pm/state";
import { defineHardBreakSpec } from "./hard-break-spec";

export type ShiftEnterHardBreakExtension = Extension;

export function defineShiftEnterHardBreak(): ShiftEnterHardBreakExtension {
  const keymap = defineKeymap({
    "Shift-Enter": (state: EditorState, dispatch) => {
      const { hardBreak } = state.schema.nodes;
      if (dispatch) {
        dispatch(state.tr.replaceSelectionWith(hardBreak.create()));
      }
      return true;
    },
  });

  return union(defineHardBreakSpec(), keymap);
}
