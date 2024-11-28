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
    atom: true,
    leafText: () => "\n",
    parseDOM: [{ tag: "br" }],
    toDOM: () => ["br"],
  });
}
