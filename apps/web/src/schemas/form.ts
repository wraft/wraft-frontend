import { z } from 'zod';

import { safeTextRegex } from 'utils/regex';

export const FormSchema = z.object({
  name: z
    .string()
    .nonempty({ message: 'Name is required' })
    .trim()
    .regex(safeTextRegex, 'Only letters, numbers, spaces, -, _ allowed'),
  description: z.string().nonempty({ message: 'Description is required' }),
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
});

export type Form = z.infer<typeof FormSchema>;
