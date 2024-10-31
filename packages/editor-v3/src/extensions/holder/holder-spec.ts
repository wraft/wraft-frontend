import { defineNodeSpec, defineMarkSpec, type Extension } from "@prosekit/core";
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
  mentionTag: string;
  id: string;
  label: string;
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
      mentionTag: {},
      id: {},
      label: {},
    },
    leafText(node) {
      return `@${node.attrs.named}`;
    },
    parseDOM: [{ tag: "span[data-holder]" }],
    toDOM(node) {
      const { named, name, id } = node.attrs;

      const attrs = {
        class: named?.length > 0 ? "holder" : "no-holder",
        "data-attribute-id": id,
        "data-attribute-name": name || "",
      };

      const value = named ? named : name;
      return ["span", attrs, value];
    },
  });
}
