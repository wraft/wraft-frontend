import { z } from 'zod';

import { FieldType } from '../components/Form/FormFieldTypes';

// Schema for field values (options)
export const FieldValueSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Option name is required' }),
});

// Schema for a single form field
export const FormFieldSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, { message: 'Field label is required' })
    // Ensure first letter is uppercase
    .refine((val) => val.charAt(0) === val.charAt(0).toUpperCase(), {
      message: 'Field label must start with an uppercase letter',
    }),
  type: z.string(),
  fieldTypeId: z.string(),
  required: z.boolean().optional(),
  long: z.boolean().optional(),
  multiple: z.boolean().optional(),
  fileSize: z.number().optional(),
  values: z.array(FieldValueSchema).optional(),
  error: z.string().optional(),
  uiType: z.nativeEnum(FieldType).optional(),
});

// Schema for an array of form fields with unique name validation
export const FormFieldsSchema = z
  .array(FormFieldSchema)
  // Ensure field names are unique (case-insensitive)
  .refine(
    (fields) => {
      const names = fields.map((field) => field.name.toLowerCase());
      return new Set(names).size === names.length;
    },
    {
      message: 'Field labels must be unique',
      path: ['name'],
    },
  );

// Type definitions for use with React Hook Form
export type FieldValueType = z.infer<typeof FieldValueSchema>;
export type FormFieldType = z.infer<typeof FormFieldSchema>;
export type FormFieldsType = z.infer<typeof FormFieldsSchema>;

// Helper function to capitalize the first letter of a string
export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Helper function to check for duplicate field names
export const hasDuplicateFieldNames = (fields: FormFieldType[]): boolean => {
  const names = fields.map((field) => field.name.toLowerCase());
  return new Set(names).size !== names.length;
};

// Helper function to get duplicate field names
export const getDuplicateFieldNames = (fields: FormFieldType[]): string[] => {
  const nameCounts: Record<string, number> = {};
  const duplicates: string[] = [];

  fields.forEach((field) => {
    const lowerName = field.name.toLowerCase();
    nameCounts[lowerName] = (nameCounts[lowerName] || 0) + 1;

    if (nameCounts[lowerName] > 1 && !duplicates.includes(field.name)) {
      duplicates.push(field.name);
    }
  });

  return duplicates;
};
