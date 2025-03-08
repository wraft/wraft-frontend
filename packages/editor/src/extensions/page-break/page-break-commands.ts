import { defineCommands, getNodeType, type Extension } from "@prosekit/core";
import { Fragment, Slice } from "@prosekit/pm/model";
import { type Command } from "@prosekit/pm/state";

export type PageBreakCommandsExtension = Extension<{
  Commands: {
    insertPageBreak: [];
  };
}>;

/**
 * Returns a command that inserts a horizontal rule at the current selection.
 */
export function insertPageBreak(): Command {
  return (state, dispatch) => {
    if (!dispatch) return true;

    const { schema, tr } = state;
    const type = getNodeType(schema, "pageBreak");
    const node = type.createChecked();
    const pos = tr.selection.anchor;
    tr.replaceRange(pos, pos, new Slice(Fragment.from(node), 0, 0));
    dispatch(tr);
    return true;
  };
}

export function definePageBreakCommands(): PageBreakCommandsExtension {
  return defineCommands({ insertPageBreak });
}
