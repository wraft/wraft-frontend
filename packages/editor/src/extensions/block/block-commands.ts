import type { Extension } from "@prosekit/core";
import { defineCommands } from "@prosekit/core";
import type { Node } from "@prosekit/pm/model";
import type { Selection, Command } from "@prosekit/pm/state";

/**
 * @internal
 */
export type BlockCommandsExtension = Extension<{
  Commands: {
    insertBlock: [content: Node, selection: Selection];
  };
}>;

function insertBlock(content: Node, selection: Selection): Command {
  return (state, dispatch) => {
    const { from, to } = selection;
    const tr = state.tr.replaceRangeWith(from, to, content);
    dispatch?.(tr);
    return true;
  };
}

export function defineBlockCommands(): BlockCommandsExtension {
  return defineCommands({
    insertBlock: (content: Node, selection: Selection) => {
      return insertBlock(content, selection);
    },
  });
}
