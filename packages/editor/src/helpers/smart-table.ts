/**
 * Helper functions for Smart Table feature
 * Converts JSON data to ProseMirror table format
 */

export interface SmartTableData {
  headers: string[];
  rows: string[][];
  footer?: string[];
}

export type SmartTableJSON =
  | {
      type: "smartTableWrapper";
      attrs?: {
        tableName?: string | null;
        machineName?: string | null;
        isSmartTable?: boolean;
      };
      content: any[];
    }
  | {
      type: "table";
      attrs?: Record<string, any>;
      content: any[];
    };

/**
 * Validates smart table JSON data
 */
export function validateSmartTableData(data: any): {
  valid: boolean;
  error?: string;
} {
  if (!data || typeof data !== "object") {
    return { valid: false, error: "Invalid JSON format" };
  }

  if (!Array.isArray(data.headers) || data.headers.length === 0) {
    return { valid: false, error: "Headers must be a non-empty array" };
  }

  if (!Array.isArray(data.rows)) {
    return { valid: false, error: "Rows must be an array" };
  }

  const headerCount = data.headers.length;

  for (let i = 0; i < data.rows.length; i++) {
    if (!Array.isArray(data.rows[i])) {
      return { valid: false, error: `Row ${i + 1} must be an array` };
    }
    if (data.rows[i].length !== headerCount) {
      return {
        valid: false,
        error: `Row ${i + 1} has ${data.rows[i].length} columns, expected ${headerCount}`,
      };
    }
  }

  if (data.footer !== undefined) {
    if (!Array.isArray(data.footer)) {
      return { valid: false, error: "Footer must be an array" };
    }
    if (data.footer.length !== headerCount) {
      return {
        valid: false,
        error: `Footer has ${data.footer.length} columns, expected ${headerCount}`,
      };
    }
  }

  return { valid: true };
}

/**
 * Creates a table cell with text content
 */
function createTableCell(text: string, isHeader = false, attrs?: any) {
  return {
    type: "tableCell",
    attrs: {
      ...attrs,
      ...(attrs?.colspan ? { colspan: attrs.colspan } : {}),
      ...(attrs?.rowspan ? { rowspan: attrs.rowspan } : {}),
    },
    content: [
      {
        type: "paragraph",
        content: text
          ? [
              {
                type: "text",
                text: String(text),
                ...(isHeader ? { marks: [{ type: "bold" }] } : {}),
              },
            ]
          : [],
      },
    ],
  };
}

/**
 * Creates a table row
 */
function createTableRow(cells: any[]) {
  return {
    type: "tableRow",
    content: cells,
  };
}

/**
 * Converts smart table data to ProseMirror table JSON
 */
export function smartTableDataToJSON(
  data: SmartTableData,
  tableName?: string,
  machineName?: string | null,
): SmartTableJSON {
  const rows: any[] = [];

  const headerCells = data.headers.map((header) =>
    createTableCell(header, true),
  );
  rows.push(createTableRow(headerCells));

  data.rows.forEach((row) => {
    const cells = row.map((cell) => createTableCell(cell, false));
    rows.push(createTableRow(cells));
  });

  if (data.footer && data.footer.length > 0) {
    const footerCells = data.footer.map((cell) =>
      createTableCell(cell, false, { isFooter: true }),
    );
    rows.push(createTableRow(footerCells));
  }

  const table: any = {
    type: "table",
    content: rows,
  };

  if (tableName) {
    const wrappedTable: SmartTableJSON = {
      type: "smartTableWrapper",
      attrs: {
        tableName,
        ...(machineName && { machineName }),
        isSmartTable: true,
      },
      content: [table],
    };

    return wrappedTable;
  }

  const regularTable: SmartTableJSON = {
    type: "table",
    content: rows,
  };
  return regularTable;
}

/**
 * Parses JSON string and validates it
 */
export function parseAndValidateJSON(jsonString: string): {
  data?: SmartTableData;
  error?: string;
} {
  try {
    const parsed = JSON.parse(jsonString);
    const validation = validateSmartTableData(parsed);

    if (!validation.valid) {
      return { error: validation.error };
    }

    return { data: parsed as SmartTableData };
  } catch (e) {
    return { error: `Invalid JSON: ${(e as Error).message}` };
  }
}

/**
 * Generates empty smart table data
 */
export function generateEmptySmartTableData(
  rows = 2,
  cols = 3,
): SmartTableData {
  return {
    headers: Array(cols)
      .fill("")
      .map((_, i) => `Column ${i + 1}`),
    rows: Array(rows)
      .fill(null)
      .map(() => Array(cols).fill("")),
  };
}
