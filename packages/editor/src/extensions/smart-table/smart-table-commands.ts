import { defineCommands } from "prosekit/core";
import type { NodeJSON } from "prosekit/core";

/**
 * Commands for smart table operations
 */
export function defineSmartTableCommands() {
  return defineCommands({
    insertSmartTable: (tableJSON: NodeJSON) => (state, dispatch) => {
      if (dispatch) {
        const { schema } = state;
        const node = schema.nodeFromJSON(tableJSON);
        const tr = state.tr.replaceSelectionWith(node);
        dispatch(tr);
        return true;
      }
      return true;
    },
  });
}
