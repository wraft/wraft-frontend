import { z } from 'zod';

import { hexColorRegex, safeTextRegex, uuidRegex } from 'utils/regex';

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
  type: z.enum(['document', 'contract'], {
    errorMap: () => ({
      message: 'Value must be either "document" or "contract"',
    }),
  }),

  frame_mapping: z
    .array(
      z.object({
        variantField: z.string().min(1, 'Content field is required'),
        frameField: z.string().min(1, 'Frame field is required'),
      }),
    )
    .optional(),

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

  fields: z
    .array(
      z.object({
        type: z.string().regex(uuidRegex, 'Invalid field type'),
        name: z.string().min(1, 'Name is required'),
        fromFrame: z.boolean().optional(),
        smartTableName: z.string().optional(),
        required: z.boolean().optional(),
        order: z.number().int().min(0).optional(),
        machine_name: z.string().optional(),
        dateFormat: z.string().optional(),
        values: z
          .array(
            z.object({
              id: z.string(),
              name: z.string().min(1, 'Option name is required'),
            }),
          )
          .optional(),
        validations: z
          .array(
            z.object({
              validation: z.any(),
              error_message: z.string().optional(),
            }),
          )
          .optional(),
      }),
    )
    .superRefine((fields, ctx) => {
      const nameSet = new Set<string>();
      fields.forEach((field, index) => {
        const normalizedName = field.name.toLowerCase();
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

  frame: z
    .object({
      id: z.string().regex(uuidRegex),
      name: z.string(),
    })
    .optional(),
});

export type Variant = z.infer<typeof VariantSchema>;
