import { defineNodeSpec, type Extension } from "@prosekit/core";
import type { Attrs } from "@prosekit/pm/model";

/**
 * @internal
 */
export type HolderSpecExtension = Extension<{
  Nodes: {
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
    parseDOM: [
      {
        tag: `span[data-mention]`,
        getAttrs: (dom: HTMLElement): HolderAttrs => ({
          id: dom.getAttribute("data-attribute-id") || "",
          name: dom.getAttribute("data-attribute-name") || "",
          named: dom.getAttribute("data-attribute-named") || "",
        }),
      },
    ],
    toDOM(node) {
      const { named, name, id } = node.attrs;

      const attrs = {
        class: named ? "holder" : "no-holder",
        "data-attribute-id": id,
        "data-attribute-name": name || "",
        "data-attribute-namd": named || "",
      };

      const value = named ? named : name;
      return ["span", attrs, value];
    },
  });
}
