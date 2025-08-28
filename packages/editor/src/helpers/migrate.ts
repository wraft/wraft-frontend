import type { ListAttrs } from "@extensions/list-item";
import type { ProsemirrorNodeJSON } from "prosemirror-flat-list";

function migrateNodes(
  nodes: ProsemirrorNodeJSON[],
): [ProsemirrorNodeJSON[], boolean] {
  const content: ProsemirrorNodeJSON[] = [];
  let updated = false;

  for (const node of nodes) {
    if (node.type === "bullet_list" || node.type === "bulletList") {
      updated = true;
      for (const child of node.content ?? []) {
        content.push(migrateNode(child, { kind: "bullet" })[0]);
      }
    } else if (node.type === "ordered_list" || node.type === "orderedList") {
      updated = true;
      for (const child of node.content ?? []) {
        content.push(migrateNode(child, { kind: "ordered" })[0]);
      }
    } else {
      content.push(node);
    }
  }

  return [content, updated];
}

function migrateNode(
  node: ProsemirrorNodeJSON,
  {
    kind,
  }: {
    kind?:
      | "bullet"
      | "ordered"
      | "lower-alpha"
      | "upper-alpha"
      | "lower-roman"
      | "upper-roman";
  },
): [ProsemirrorNodeJSON, boolean] {
  if (
    node.type === "list_item" ||
    node.type === "listItem" ||
    node.type === "taskListItem"
  ) {
    return [
      {
        ...node,
        type: "list",
        attrs: {
          ...node.attrs,
          kind: kind ?? "bullet",
        } satisfies ListAttrs,
        content: node.content ? migrateNodes(node.content)[0] : undefined,
      },
      true,
    ];
  } else if (node.content) {
    const [content, updated] = migrateNodes(node.content);
    return [{ ...node, content }, updated];
  }

  return [node, false];
}
