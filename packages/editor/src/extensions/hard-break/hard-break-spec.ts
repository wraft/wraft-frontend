import { defineNodeSpec, type Extension } from "@prosekit/core";
import type { Attrs } from "@prosekit/pm/model";

export type HardBreakSpecExtension = Extension<{
  Nodes: {
    hardBreak: Attrs;
  };
}>;

/**
 * @internal
 */
export function defineHardBreakSpec(): HardBreakSpecExtension {
  return defineNodeSpec({
    name: "hardBreak",
    inline: true,
    selectable: false,
    group: "inline",
    atom: true,
    parseDOM: [{ tag: "br" }],
    toDOM: () => ["br"],
  });
}
