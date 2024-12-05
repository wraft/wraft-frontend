import { defineNodeSpec, type Extension } from "@prosekit/core";
import { createListSpec } from "prosemirror-flat-list";

// [TODO] should be fix this module. it's temp

export interface ListAttrs {
  /**
   * The kind of list node.
   */
  kind?: "bullet" | "ordered" | "task" | "toggle";
  /**
   * The optional order of the list node.
   */
  order?: number | null;
  /**
   * Whether the list node is checked if its `kind` is `"task"`.
   */
  checked?: boolean;
  /**
   * Whether the list node is collapsed if its `kind` is `"toggle"`.
   */
  collapsed?: boolean;
}

/**
 * @internal
 */
export type ListItemSpecExtension = Extension<{
  Nodes: {
    listItem: ListAttrs;
  };
}>;

/**
 * @internal
 */
export function defineListItemSpec(): ListItemSpecExtension {
  return defineNodeSpec<"listItem", ListAttrs>({
    ...createListSpec(),
    name: "listItem",
  });
}

/**
 * @internal
 */
export type OrderedListSpecExtension = Extension<{
  Nodes: {
    orderedList: ListAttrs;
  };
}>;

/**
 * @internal
 */
export function defineOrderedListSpec(): OrderedListSpecExtension {
  return defineNodeSpec<"orderedList", ListAttrs>({
    ...createListSpec(),
    name: "orderedList",
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
