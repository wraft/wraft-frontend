import type { Extension } from "@prosekit/core";
import { defineCommands, insertNode } from "@prosekit/core";
import type { ConditionalBlockAttrs } from "./conditional-block-spec";

/**
 * @internal
 */
export type ConditionalBlockCommandsExtension = Extension<{
  Commands: {
    insertConditionalBlock: [attrs?: Partial<ConditionalBlockAttrs>];
  };
}>;

export function defineConditionalBlockCommands(): ConditionalBlockCommandsExtension {
  return defineCommands({
    insertConditionalBlock: (attrs?: Partial<ConditionalBlockAttrs>) => {
      const defaultAttrs: ConditionalBlockAttrs = {
        conditions: [
          {
            placeholder: "",
            operation: "equal",
            value: "",
          },
        ],
      };

      const finalAttrs = { ...defaultAttrs, ...attrs };

      return insertNode({
        type: "conditionalBlock",
        attrs: finalAttrs,
        content: [
          {
            type: "paragraph",
            content: [],
          },
        ],
      });
    },
  });
}
