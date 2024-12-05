import { defineNodeSpec, type Extension } from "@prosekit/core";
import type { Attrs } from "@prosekit/pm/model";

/**
 * @internal
 */
export type HolderSpecExtension = Extension<{
  Marks: {
    holder: Attrs;
  };
}>;

export interface HolderAttrs {
  named: string;
  name: string;
  id: string;
}

/**
 * @internal
 */
export function defineHolderSpec() {
  return defineNodeSpec<"holder", HolderAttrs>({
    name: "holder",
    atom: true,
    inline: true,
    group: "inline",
    attrs: {
      named: {},
      name: {},
      id: {},
    },
    leafText(node) {
      return `@${node.attrs.name}`;
    },
    parseDOM: [{ tag: "span[data-holder]" }],
    toDOM(node) {
      const { named, name, id } = node.attrs;

      const attrs = {
        class: named ? "holder" : "no-holder",
        "data-attribute-id": id,
        "data-attribute-name": name || "",
        style: named
          ? "background-color: #ffe889; color: #000; font-weight: bold; padding: 2px;"
          : "background-color: rgba(243, 120, 18, 0.38); color: rgba(95, 54, 20, 0.9); font-weight: bold; padding: 1px; border-bottom: 2px solid rgb(112, 212, 191);",
      };

      const value = named ? named : name;
      return ["span", attrs, value];
    },
  });
}
