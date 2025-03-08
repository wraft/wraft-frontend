import { defineNodeSpec, type Extension } from "@prosekit/core";
import type { Attrs } from "@prosekit/pm/model";

export type PageBreakSpecExtension = Extension<{
  Nodes: {
    pageBreak: Attrs;
  };
}>;

export function definePageBreakSpec(): PageBreakSpecExtension {
  return defineNodeSpec({
    name: "pageBreak",
    group: "block",
    parseDOM: [{ tag: "div.prosekit-page-break" }],
    toDOM: () => ["div", { class: "prosekit-page-break" }],
  });
}
