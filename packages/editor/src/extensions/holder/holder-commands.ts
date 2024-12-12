import type { Extension } from "@prosekit/core";
import { defineCommands, insertNode } from "@prosekit/core";
import type { HolderAttrs } from "./holder-spec";

/**
 * @internal
 */
export type HolderCommandsExtension = Extension<{
  Commands: {
    insertHolder: [attrs: HolderAttrs];
  };
}>;

export function defineHolderCommands(): HolderCommandsExtension {
  return defineCommands({
    insertHolder: (attrs: HolderAttrs) => insertNode({ type: "holder", attrs }),
  });
}
