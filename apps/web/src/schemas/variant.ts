import { z } from 'zod';

import { hexColorRegex, safeTextRegex, uuidRegex } from 'utils/regex';

// First, update the VariantSchema

export const VariantSchema = z.object({
  name: z
    .string()
    .min(4, 'Minimum 4 characters required')
    .max(120, 'Maximum 120 characters allowed')
    .trim()
    .regex(safeTextRegex, 'Only letters, numbers, spaces, -, _ allowed')
    .optional(),
  description: z
    .string()
    .min(5, 'Minimum 5 characters required')
    .trim()
    .regex(safeTextRegex, 'Only letters, numbers, spaces, -, _ allowed')
    .optional(),
  prefix: z
    .string()
    .min(2, 'Minimum 2 characters required')
    .max(18, 'Maximum 18 characters allowed')
    .regex(
      /^[A-Za-z0-9]+$/,
      'Prefix can only contain letters and numbers, and no spaces or special characters.',
    )
    .transform((val) => val.toUpperCase())
    .optional(),
  type: z
    .string()
    .refine((value) => value === 'document' || value === 'contract', {
      message: 'Value must be either "document" or "contract"',
    }),

  mappings: z
    .array(
      z.object({
        variantField: z.string(),
        frameField: z.string(),
      }),
    )
    .optional(),

  //next
  layout: z.union([
    z.string().regex(uuidRegex, 'Layout is required'),
    z.object({
      id: z.string().regex(uuidRegex, 'Invalid ObjectId'),
      name: z.string().min(1, 'Layout is required'),
      frame: z.union([
        z.undefined(),
        z.null(),
        z.object({
          id: z.string().regex(uuidRegex, 'Invalid Frame'),
          name: z.string().min(1, 'Frame name is required'),
          fields: z
            .array(
              z.object({
                id: z.string().regex(uuidRegex, 'Invalid Field ID'),
                name: z.string().min(1, 'Field name is required'),
              }),
            )
            .optional()
            .nullable(),
        }),
      ]),
    }),
  ]),
  flow: z.union([
    z.string().regex(uuidRegex, 'Flow is required'),
    z.object({
      id: z.string().regex(uuidRegex, 'Invalid ObjectId'),
      name: z.string().min(1, 'Flow is required'),
    }),
  ]),
  theme: z.union([
    z.string().regex(uuidRegex, 'Theme is required'),
    z.object({
      id: z.string().regex(uuidRegex, 'Invalid ObjectId'),
      name: z.string().min(1, 'Theme is required'),
    }),
  ]),
  color: z
    .string()
    .regex(hexColorRegex, 'Invalid hexadecimal color')
    .optional(),

  //next
  fields: z
    .array(
      z.object({
        type: z.string().regex(uuidRegex, 'Invalid field type'),
        name: z.string().min(1, 'Name is required'),
      }),
    )
    .superRefine((fields, ctx) => {
      const nameSet = new Set<string>();
      fields.forEach((field, index) => {
        // Case-insensitive uniqueness check
        const normalizedName = field.name.toLowerCase(); // Normalize for case-insensitive comparison
        if (nameSet.has(normalizedName)) {
          ctx.addIssue({
            code: 'custom',
            path: [index, 'name'],
            message: `The name "${field.name}" is not unique.`,
          });
        } else {
          nameSet.add(normalizedName);
        }
      });
    }),

  frameMapping: z
    .array(
      z.object({
        source: z.object({
          id: z.string().regex(uuidRegex),
          name: z.string(),
        }),
        destination: z.object({
          id: z.string().regex(uuidRegex),
          name: z.string(),
        }),
      }),
    )
    .optional(),

  frame: z
    .object({
      id: z.string().regex(uuidRegex),
      name: z.string(),
    })
    .optional(),
});

export type Variant = z.infer<typeof VariantSchema>;
