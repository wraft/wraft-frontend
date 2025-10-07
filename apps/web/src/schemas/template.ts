import { z } from 'zod';

import { nameRegex } from 'utils/regex';

export const TemplateSchema = z.object({
  title: z
    .string()
    .nonempty({ message: 'Name is required' })
    .trim()
    .regex(nameRegex, 'Allows only letters and spaces'),
  variant: z.object({
    id: z.string().nonempty({ message: 'Variant is required' }),
    name: z.string().optional(),
  }),
  title_template: z.string().optional(),
  serialized: z.string().optional(),
});

export type Template = z.infer<typeof TemplateSchema>;
