import { defineCommands, insertNode } from "@prosekit/core";
import type { HolderAttrs } from "./holder-spec";

export function defineHolderCommands() {
  return defineCommands({
    insertHolder: (attrs: HolderAttrs) => insertNode({ type: "holder", attrs }),
  });
}
