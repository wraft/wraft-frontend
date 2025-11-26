import type { Node as ProseMirrorNode } from "@prosekit/pm/model";
import type { SmartTableData } from "./smart-table";

export function extractTableDataFromNode(
  wrapperNode: ProseMirrorNode,
): SmartTableData | null {
  try {
    const tableNode = wrapperNode.firstChild;
    if (!tableNode || tableNode.type.name !== "table") {
      return null;
    }

    const headers: string[] = [];
    const rows: string[][] = [];
    let footer: string[] | undefined;

    let isFirstRow = true;
    tableNode.forEach((rowNode) => {
      if (rowNode.type.name !== "tableRow") return;

      const cells: string[] = [];
      rowNode.forEach((cellNode) => {
        if (cellNode.type.name !== "tableCell") return;

        let text = "";
        cellNode.forEach((contentNode) => {
          if (contentNode.type.name === "paragraph") {
            contentNode.forEach((textNode) => {
              if (textNode.type.name === "text") {
                text += textNode.text || "";
              }
            });
          }
        });
        cells.push(text);
      });

      if (isFirstRow) {
        headers.push(...cells);
        isFirstRow = false;
      } else {
        rows.push(cells);
      }
    });

    const lastRow = tableNode.lastChild;
    if (lastRow && lastRow.type.name === "tableRow") {
      const firstCell = lastRow.firstChild;
      if (firstCell?.attrs.isFooter) {
        footer = rows.pop();
      }
    }

    return {
      headers,
      rows,
      footer,
    };
  } catch (error) {
    console.error("Error extracting table data:", error);
    return null;
  }
}

export function extractTableData(
  tableNode: ProseMirrorNode,
): SmartTableData | null {
  try {
    const headers: string[] = [];
    const rows: string[][] = [];

    let isFirstRow = true;
    tableNode.forEach((rowNode) => {
      if (rowNode.type.name !== "tableRow") return;

      const cells: string[] = [];
      rowNode.forEach((cellNode) => {
        if (cellNode.type.name !== "tableCell") return;

        let text = "";
        cellNode.forEach((contentNode) => {
          if (contentNode.type.name === "paragraph") {
            contentNode.forEach((textNode) => {
              if (textNode.type.name === "text") {
                text += textNode.text || "";
              }
            });
          }
        });
        cells.push(text);
      });

      if (isFirstRow) {
        headers.push(...cells);
        isFirstRow = false;
      } else {
        rows.push(cells);
      }
    });

    return {
      headers,
      rows,
    };
  } catch (error) {
    console.error("Error extracting table data:", error);
    return null;
  }
}
