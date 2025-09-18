import { defineNodeSpec, type Extension } from "@prosekit/core";
import type { DOMOutputSpec, ProseMirrorNode } from "@prosekit/pm/model";
import type { ListAttributes } from "prosemirror-flat-list";
import { createListSpec, listToDOM } from "prosemirror-flat-list";

export type ListKind =
  | "bullet"
  | "ordered"
  | "lower-alpha"
  | "upper-alpha"
  | "lower-roman"
  | "upper-roman";

export interface ListAttrs {
  /**
   * The kind of list node.
   */
  kind?: ListKind;
  /**
   * The optional order of the list node.
   */
  order?: number | null;
  /**
   * Whether the list node is multilevel list numbering.
   */
  isMultilevel?: boolean;
}

/**
 * @internal
 */
export type ListItemSpecExtension = Extension<{
  Nodes: {
    listItem: ListAttrs;
  };
}>;

function getMarkers(node: ProseMirrorNode): DOMOutputSpec[] {
  const attrs = node.attrs as ListAttributes;
  switch (attrs.kind) {
    case "task":
      // Use a `label` element here so that the area around the checkbox is also checkable.
      return [];
    default:
      // Always return an empty array so that the marker element is rendered. This
      // is required to make the drop indicator locate the correct position.
      return [];
  }
}

/**
 * @internal
 */
export function defineListItemSpec(): ListItemSpecExtension {
  const spec = createListSpec();

  return defineNodeSpec<"listItem", ListAttrs>({
    ...spec,
    attrs: {
      kind: { default: "bullet" },
      order: { default: null },
      isMultilevel: { default: false },
    },
    toDOM: (node) => {
      return listToDOM({ node, getMarkers });
    },
    name: "listItem",
  });
}

/**
 * @internal
 */
export type BulletListSpecExtension = Extension<{
  Nodes: {
    bulletList: ListAttrs;
  };
}>;

/**
 * @internal
 */
export function defineBulletListSpec(): BulletListSpecExtension {
  return defineNodeSpec<"bulletList", ListAttrs>({
    ...createListSpec(),
    name: "bulletList",
  });
}
