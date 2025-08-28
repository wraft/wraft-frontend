import { defineCommands, type Extension } from "@prosekit/core";
import type { Command } from "@prosekit/pm/state";

/**
 * @internal
 */
export type ListItemCommandsExtension = Extension<{
  Commands: {
    toggleMultilevelList: [];
  };
}>;

/**
 * Command that toggles a list with multilevel numbering
 */
function toggleMultilevelList(): Command {
  return (state, dispatch) => {
    const { selection, schema } = state;

    let listParent = null;
    let listPos = -1;

    for (let depth = selection.$from.depth; depth >= 0; depth--) {
      const node = selection.$from.node(depth);
      if (
        node.type === schema.nodes.listItem ||
        node.type === schema.nodes.orderedList ||
        node.type === schema.nodes.bulletList
      ) {
        listParent = node;
        listPos = selection.$from.before(depth);
        break;
      }
    }
    console.log("toggleMultilevelList[4]", listParent);

    if (!listParent) {
      // If not in a list, return false to indicate the command can't be executed
      return false;
    }

    if (!dispatch) return true;

    const currentIsMultilevel = listParent.attrs.isMultilevel || false;

    // Create a new transaction to update the node's attributes
    const tr = state.tr.setNodeMarkup(listPos, undefined, {
      ...listParent.attrs,
      isMultilevel: !currentIsMultilevel,
    });

    dispatch(tr);
    return true;
  };
}

/**
 * @internal
 */
export function defineListItemCommands(): ListItemCommandsExtension {
  return defineCommands({
    toggleMultilevelList: () => toggleMultilevelList(),
  });
}
