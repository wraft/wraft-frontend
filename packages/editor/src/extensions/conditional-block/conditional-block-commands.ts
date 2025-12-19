import type { Extension } from "@prosekit/core";
import { defineCommands } from "@prosekit/core";
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
    insertConditionalBlock:
      (attrs?: Partial<ConditionalBlockAttrs>) => (state, dispatch) => {
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

        if (dispatch) {
          const { schema } = state;
          const node = schema.nodeFromJSON({
            type: "conditionalBlock",
            attrs: finalAttrs,
            content: [
              {
                type: "paragraph",
                content: [],
              },
            ],
          });
          const tr = state.tr.replaceSelectionWith(node);
          dispatch(tr);
          return true;
        }
        return true;
      },
  });
}
