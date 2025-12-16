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
  machineName?: string | null;
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
      machineName: { default: null },
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
          machineName: dom.getAttribute("data-attribute-machine-name") || "",
        }),
      },
    ],
    toDOM(node) {
      const { named, name, id, machineName } = node.attrs;

      const attrs = {
        class: named ? "holder" : "no-holder",
        "data-attribute-id": id,
        "data-attribute-name": name || "",
        "data-attribute-named": named || "",
        ...(machineName && { "data-attribute-machine-name": machineName }),
      };

      const value = named ? named : name;
      return ["span", attrs, value];
    },
  });
}
