import { defineNodeSpec, type Extension } from "@prosekit/core";
import type { Attrs } from "@prosekit/pm/model";

/**
 * @internal
 */
export type ConditionalBlockSpecExtension = Extension<{
  Nodes: {
    conditionalBlock: Attrs;
  };
}>;

export interface ConditionalBlockAttrs {
  conditions: {
    placeholder: string;
    operation: string;
    value: string;
    logic?: "and" | "or";
  }[];
}

/**
 * @internal
 */
export function defineConditionalBlockSpec() {
  return defineNodeSpec<"conditionalBlock", ConditionalBlockAttrs>({
    name: "conditionalBlock",
    group: "block",
    content: "block+",
    attrs: {
      conditions: {
        default: [
          {
            placeholder: "",
            operation: "equal",
            value: "",
          },
        ],
      },
    },
    parseDOM: [
      {
        tag: `div[data-conditional-block]`,
        getAttrs: (dom: HTMLElement): ConditionalBlockAttrs => {
          const conditionsAttr = dom.getAttribute("data-conditions");

          let conditions = [
            {
              placeholder: "",
              operation: "equal",
              value: "",
            },
          ];

          if (conditionsAttr) {
            try {
              conditions = JSON.parse(conditionsAttr);
            } catch (e) {}
          }

          return {
            conditions,
          };
        },
      },
    ],
    toDOM(node) {
      const { conditions } = node.attrs;

      return [
        "div",
        {
          class: "conditional-block",
          "data-conditional-block": "true",
          "data-conditions": JSON.stringify(conditions),
        },
        0,
      ];
    },
  });
}
