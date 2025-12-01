import { defineNodeSpec, type Extension } from "prosekit/core";
import type { Attrs } from "@prosekit/pm/model";

export type SmartTableExtension = Extension<{
  Nodes: {
    smartTableWrapper: Attrs;
  };
}>;

export function defineSmartTable(): SmartTableExtension {
  return defineNodeSpec({
    name: "smartTableWrapper",
    content: "table",
    group: "block",
    attrs: {
      tableName: { default: null },
      isSmartTable: { default: true },
    },
    parseDOM: [
      {
        tag: "div[data-smart-table-wrapper]",
        getAttrs: (dom) => {
          if (dom instanceof HTMLElement) {
            return {
              tableName: dom.getAttribute("data-table-name") || null,
              isSmartTable: true,
            };
          }
          return null;
        },
      },
    ],
    toDOM(node) {
      const attrs: Record<string, string> = {
        "data-smart-table-wrapper": "true",
        class: "smart-table-wrapper",
      };

      if (node.attrs.tableName) {
        attrs["data-table-name"] = String(node.attrs.tableName);
      }

      return ["div", attrs, 0];
    },
  });
}
