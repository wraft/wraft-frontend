import { z } from 'zod';

// Schema for form field entry value
export const FormFieldEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  fieldTypeId: z.string(),
  order: z.number(),
  required: z.boolean(),
  value: z.string(),
  error: z.string().optional(),
  smartTableName: z.string().optional(),
  tableColumns: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    )
    .optional(),
});

// Schema for form entry submission data
export const FormEntrySubmissionSchema = z.object({
  field_id: z.string(),
  value: z.union([z.string(), z.array(z.any()), z.record(z.any())]),
});

// Schema for form entry request payload
export const FormEntryRequestSchema = z.object({
  pipeline_id: z.string().optional(),
  data: z.array(FormEntrySubmissionSchema),
});

// Type definitions
export type FormFieldEntry = z.infer<typeof FormFieldEntrySchema>;
export type FormEntrySubmission = z.infer<typeof FormEntrySubmissionSchema>;
export type FormEntryRequest = z.infer<typeof FormEntryRequestSchema>;

// Helper function to validate form entries
export const validateFormEntries = (entries: FormFieldEntry[]): boolean => {
  return !entries.some((entry) => entry.required && !entry.value);
};

// Helper function to transform table data to the new format
const transformTableData = (
  tableRows: Array<Record<string, string>>,
  tableColumns?: Array<{ id: string; name: string }>,
  footer?: string[],
): Record<string, any> => {
  const headers =
    tableColumns?.map((col) => col.name) ||
    (tableRows.length > 0 ? Object.keys(tableRows[0]) : []);

  const rows = tableRows.map((row) => {
    if (tableColumns && tableColumns.length > 0) {
      return tableColumns.map((col) => row[col.id] || '');
    }
    return headers.map((header) => {
      return row[header] || '';
    });
  });

  const result: Record<string, any> = {
    headers,
    rows,
  };

  if (footer && footer.length > 0) {
    result.footer = footer;
  }

  return result;
};

// Helper function to prepare form entry submission data
export const prepareFormEntrySubmission = (
  entries: FormFieldEntry[],
): FormEntryRequest => {
  const data = entries.map((entry) => {
    let value: string | any = entry.value;

    if (entry.type === 'Table' && typeof entry.value === 'string') {
      try {
        const parsed = JSON.parse(entry.value);
        if (Array.isArray(parsed)) {
          const transformed = transformTableData(parsed, entry.tableColumns);
          value = transformed;
        } else if (typeof parsed === 'object' && parsed !== null) {
          if (parsed.headers && parsed.rows) {
            value = parsed;
          } else if (Array.isArray(parsed.rows)) {
            const transformed = transformTableData(
              parsed.rows,
              entry.tableColumns,
              parsed.footer,
            );
            value = transformed;
          } else {
            value = parsed;
          }
        }
      } catch {
        value = entry.value;
      }
    }

    return {
      field_id: entry.id,
      value,
    };
  });

  return { data };
};
