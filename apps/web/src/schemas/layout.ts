import { z } from 'zod';

import { safeTextRegex, uuidRegex } from 'utils/regex';

const MarginSchema = z.object({
  top: z
    .number()
    .min(0)
    .max(10)
    .refine((val) => Number(val.toFixed(2)) === val, {})
    .transform((val) => parseFloat(val.toFixed(2))),
  right: z
    .number()
    .min(0)
    .max(10)
    .refine((val) => Number(val.toFixed(2)) === val, {})
    .transform((val) => parseFloat(val.toFixed(2))),
  bottom: z
    .number()
    .min(0)
    .max(10)
    .refine((val) => Number(val.toFixed(2)) === val, {})
    .transform((val) => parseFloat(val.toFixed(2))),
  left: z
    .number()
    .min(0)
    .max(10)
    .refine((val) => Number(val.toFixed(2)) === val, {})
    .transform((val) => parseFloat(val.toFixed(2))),
});

// Asset schema for direct upload
const AssetSchema = z.object({
  id: z.string().optional(),
  asset_name: z.string().optional(),
  type: z.string().optional(),
  file: z.string().optional(),
  inserted_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const Layoutschema = z.object({
  name: z
    .string()
    .min(4, { message: 'Minimum 4 characters required' })
    .max(120, { message: 'Maximum 120 characters allowed' })
    .trim()
    .regex(safeTextRegex, 'Only letters, numbers, spaces, -, _ allowed'),
  slug: z
    .string()
    .refine((value) => value === 'pletter' || value === 'contract', {
      message: 'Value must be either "pletter" or "contract"',
    }),
  description: z
    .string()
    .min(5, 'Minimum 5 characters required')
    .max(255, { message: 'Maximum 255 characters allowed' })
    .trim()
    .regex(safeTextRegex, 'Only letters, numbers, spaces, -, _ allowed')
    .optional(),
  engine: z.object({
    id: z.string().regex(uuidRegex, 'Invalid Engine'),
    name: z.string().min(1, 'Invalid Engine'),
  }),
  screenshot: z.any(),
  height: z.coerce.number(),
  width: z.coerce.number(),
  unit: z.string(),
  assets: z.any().optional(),

  // New direct asset field
  asset: AssetSchema.nullable().optional(),
  margin: MarginSchema.nullable().optional(),
  file: z.any().optional(),

  frame: z
    .union([
      z.object({
        id: z.string().regex(uuidRegex, 'Invalid Frame'),
        name: z.string().min(1, 'Frame name is required'),
      }),
      z.string().optional(),
    ])
    .optional(),
});

export type Layout = z.infer<typeof Layoutschema>;
export type LayoutMargins = z.infer<typeof MarginSchema>;
