import { defineMarkSpec, type Extension } from "@prosekit/core";
import type { Attrs } from "@prosekit/pm/model";

/**
 * @internal
 */
export type TextHighlightSpec = Extension<{
  Marks: {
    textHighlight: Attrs;
  };
}>;

/**
 * @internal
 */
export function defineTextHighlightSpec(): TextHighlightSpec {
  return defineMarkSpec({
    name: "textHighlight",
    parseDOM: [
      { tag: "i" },
      { tag: "em" },
      { style: "font-style=italic" },
      {
        style: "font-style=normal",
        clearMark: (m) => m.type.name === "italic",
      },
    ],
    toDOM() {
      return ["em", 0];
    },
  });
}
