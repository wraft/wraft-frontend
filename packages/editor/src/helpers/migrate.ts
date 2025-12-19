import type { ProsemirrorNodeJSON } from "prosemirror-flat-list";
import type { ListAttrs } from "@extensions/list-item";

function migrateNodes(
  nodes: ProsemirrorNodeJSON[],
): [ProsemirrorNodeJSON[], boolean] {
  const content: ProsemirrorNodeJSON[] = [];
  let updated = false;

  for (const node of nodes) {
    if (node.type === "bullet_list" || node.type === "bulletList") {
      updated = true;
      for (const child of node.content ?? []) {
        const [migratedChild, childUpdated] = migrateNode(child, {
          kind: "bullet",
        });
        content.push(migratedChild);
        if (childUpdated) updated = true;
      }
    } else if (node.type === "ordered_list" || node.type === "orderedList") {
      updated = true;
      for (const child of node.content ?? []) {
        const [migratedChild, childUpdated] = migrateNode(child, {
          kind: "ordered",
        });
        content.push(migratedChild);
        if (childUpdated) updated = true;
      }
    } else {
      const [migratedNode, nodeUpdated] = migrateNode(node, {});
      content.push(migratedNode);
      if (nodeUpdated) updated = true;
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
  let updated = false;

  // Handle direct list item migrations
  if (
    node.type === "list_item" ||
    node.type === "bulletList" ||
    node.type === "orderedList" ||
    node.type === "taskListItem"
  ) {
    const [migratedContent, _contentUpdated] = node.content
      ? migrateNodes(node.content)
      : [undefined, false];

    return [
      {
        ...node,
        type: "listItem",
        attrs: {
          ...node.attrs,
          kind: kind ?? "bullet",
        } satisfies ListAttrs,
        content: migratedContent,
      },
      true,
    ];
  }

  if (node.content) {
    const [content, contentUpdated] = migrateNodes(node.content);
    updated = contentUpdated;

    if (updated) {
      return [{ ...node, content }, updated];
    }
  }

  return [node, updated];
}

export function migrateDocJSON(
  docJSON: ProsemirrorNodeJSON,
): ProsemirrorNodeJSON | null {
  const [migrated, updated] = migrateNode(docJSON, {});
  return updated ? migrated : docJSON;
}
