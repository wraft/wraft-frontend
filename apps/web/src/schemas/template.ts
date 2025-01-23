import { z } from 'zod';

export const TemplateSchema = z.object({
  title: z.string().nonempty({ message: 'Name is required' }),
  variant: z.object({
    id: z.string().nonempty({ message: 'Variant is required' }),
  }),
  title_template: z.string().optional(),
  serialized: z.string().optional(),
});

export type Template = z.infer<typeof TemplateSchema>;
