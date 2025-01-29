import { z } from 'zod';

import { uuidRegex } from 'utils/regex';

export const Layoutschema = z.object({
  name: z
    .string()
    .min(4, { message: 'Minimum 4 characters required' })
    .max(20, { message: 'Maximum 20 characters allowed' }),
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
    .optional(),
  engine: z.object({
    id: z.string().regex(uuidRegex, 'Invalid Engine'),
    name: z.string().min(1, 'Invalid Engine'),
  }),
  screenshot: z.any(),
  height: z.coerce.number(),
  width: z.coerce.number(),
  unit: z.string(),
  assets: z.any(),
});

export type Layout = z.infer<typeof Layoutschema>;
