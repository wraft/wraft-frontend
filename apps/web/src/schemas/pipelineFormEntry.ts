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
});

// Schema for form entry submission data
export const FormEntrySubmissionSchema = z.object({
  field_id: z.string(),
  value: z.string(),
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

// Helper function to prepare form entry submission data
export const prepareFormEntrySubmission = (
  entries: FormFieldEntry[],
): FormEntryRequest => {
  const data = entries.map((entry) => ({
    field_id: entry.id,
    value: entry.value,
  }));

  return { data };
};
